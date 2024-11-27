const ws = require("ws");

// This will just connect to the WebSocket server and log all received messages
// to the console.
const client = new ws("ws://localhost:8080");
client.on("message", (message) => console.log(message));
