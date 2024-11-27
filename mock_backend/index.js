const express = require("express");
var cors = require('cors')
const ws = require("ws");

const PORT = 8080;
const ORDER_BOOK_SIZE = 1000;
const ORDER_BOOK_SIZE_BURST = 100;
const ORDER_PROCESS_INTERVAL = 35;
const BROADCAST_INTERVAL = 100;

// List of orders in order of insertions.
// Each order is an object with the following properties:
// - id: unique ID, integer
// - side: "buy" or "sell"
// - price: number, non-negative
// - amount: number, non-negative
const orders = [];

// Sequential order ID
let nextOrderId = 0;
function genOrderId() {
  nextOrderId++;
  return nextOrderId;
}

// Pending packet of delta updates (inserts, deletes) to be sent
// in the next WebSocket broadcast iteration
let pendingWSBroadcast = {};

function insertOrder(order) {
  orders.push(order);
  pendingWSBroadcast.insert = pendingWSBroadcast.insert || [];
  pendingWSBroadcast.insert.push(order);
}

function removeOldestOrder() {
  const removedOrder = orders.shift();
  if (removedOrder !== undefined) {
    pendingWSBroadcast.delete = pendingWSBroadcast.delete || [];
    pendingWSBroadcast.delete.push(removedOrder.id);
  }
}

// Calculate mark price from current orders.
// Mark price is an average between the best bid and the best ask prices.
function getMark() {
  const min_ask = Math.min(
    ...orders.filter((o) => o.side === "sell").map((o) => o.price)
  );
  const max_bid = Math.max(
    ...orders.filter((o) => o.side === "buy").map((o) => o.price)
  );

  if (isFinite(min_ask) && isFinite(max_bid)) {
    return (min_ask + max_bid) * 0.5;
  } else if (isFinite(min_ask)) {
    return min_ask;
  } else if (isFinite(max_bid)) {
    return max_bid;
  } else {
    return undefined;
  }
}

// We process orders in the background. Every iteration of this processing
// will remove a random burst of older orders, and insert a random burst of new ones
// to the end of the list. It will maintain approximately the given book size.
// Note, we're not matching or trading orders, just mocking this process.
setInterval(() => {
  while (
    orders.length >=
    Math.max(0, ORDER_BOOK_SIZE - Math.random() * ORDER_BOOK_SIZE_BURST)
  ) {
    removeOldestOrder();
  }

  while (
    orders.length <
    ORDER_BOOK_SIZE + Math.random() * ORDER_BOOK_SIZE_BURST
  ) {
    const side = Math.random() < 0.5 ? "buy" : "sell";
    const mark = getMark();

    let price = 20000;
    if (mark !== undefined) {
      if (side === "buy") {
        price -= 1 + Math.random() * 1000;
      } else {
        price += 1 + Math.random() * 1000;
      }
    }

    const order = {
      id: genOrderId(),
      side,
      amount: Math.random() * 100,
      price,
    };

    insertOrder(order);
  }
}, ORDER_PROCESS_INTERVAL);

const app = express();
app.use(express.json());
app.use(cors())

// GET /orders simply returns all current orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// POST /orders adds a new order
app.post("/orders", (req, res) => {
  const order = req.body;
  if (!order.price || order.price <= 0) {
    res.send("Invalid price");
    return;
  }
  if (!order.amount || order.amount <= 0) {
    res.send("Invalid amount");
    return;
  }
  if (!order.side || (order.side !== "buy" && order.side !== "sell")) {
    res.send("Invalid side");
    return;
  }

  const mark = getMark();

  // Note: we're not doing any matching here, we just mock it in a way that if
  // the order price crosses the mark (not even the best offer on the other side),
  // we assume the order executed immediately.
  const to_insert =
    mark === undefined ||
    (order.side === "buy" && order.price <= mark) ||
    (order.side === "sell" && order.price >= mark);

  if (to_insert) {
    // Generate ID that will be sent back
    order.id = genOrderId();

    // Add the order to the end of the book
    insertOrder(order);
  }

  let payload = {
    result: to_insert ? "inserted" : "executed",
  };

  if (to_insert) {
    payload = { ...payload, ...{ order } };
  }

  res.json(payload);
});

// HTTP server
const server = app.listen(PORT, () => {
  console.log(`Mock API listening at http://localhost:${PORT}`);
});

// WebSocket server (attaching to the same HTTP server)
const newWsClients = new Set();
const wsServer = new ws.Server({ server });
wsServer.on("connection", (socket) => {
  newWsClients.add(socket);
});

// Background sending of pending packages over WebSocket
setInterval(() => {
  const payload = JSON.stringify(pendingWSBroadcast);
  pendingWSBroadcast = {};

  wsServer.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      if (newWsClients.has(client)) {
        // Newly connected clients get a full snapshot, and only start getting
        // delta updates from the next cycle.
        client.send(JSON.stringify({ existing: orders }), { binary: false });
        newWsClients.delete(client);
      } else {
        // Old clients get the delta
        client.send(payload, { binary: false });
      }
    }
  });
}, BROADCAST_INTERVAL);
