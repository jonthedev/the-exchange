# Mock Order Book Backend

A JavaScript implementation of a mock exchange backend that simulates an order book with WebSocket updates. This server provides REST APIs for order management and WebSocket connections for real-time updates.

## Features

- REST API for order management
- WebSocket server for real-time updates
- Simulated order book with continuous updates
- Real-time price simulation based on mark price
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js 20 or higher
- npm

## Install dependencies

```bash
npm install
```

## Run the server

```bash
npm run dev
```

The server will start on port 8080.

## API Documentation

### REST Endpoints

#### GET /orders

Returns a list of all current orders.

Response:

```json
[
  {
    "id": 2680,
    "side": "sell",
    "amount": 52.18,
    "price": 20302.77
  }
]
```

#### POST /orders

Creates a new order.

Request:

```json
{
  "side": "buy",
  "price": 19500,
  "amount": 1.5
}
```

**Response (Inserted):**

```json
{
  "result": "inserted",
  "order": {
    "side": "buy",
    "price": 19500,
    "amount": 1.5,
    "id": 2449
  }
}
```

**Response (Executed):**

```json
{
  "result": "executed"
}
```

### WebSocket API

Connect to `ws://localhost:8080` to receive:

- Initial snapshot of all orders on connection
- Real-time updates for order insertions and deletions
- Updates broadcast every 100ms

## Technical Details

- Built with Express.js
- WebSocket implementation using 'ws' package
- Maintains approximately 1000 orders with random fluctuations
- Updates order book every 35ms
- Broadcasts changes every 100ms

## Testing WebSocket Connection

A WebSocket testing utility is included:

```bash
node ws_test.js
```
