# The Exchange

A simplified cryptocurrency exchange order entry form and an order book view.

### Features

**Order Entry**

- Buy/Sell order submission
- Real-time price and amount validation
- Responsive UI with clear feedback
- Integration with order book price selection

**Order Book**

- Real-time order updates via WebSocket
- Customizable price grouping (1, 5, 10, 50, 100)
- Mark price display (average of best bid/ask)
- Visual depth indication for order volumes
- Auto-scrolling to best prices
- Separate scrollable views for buy/sell orders

### Technology Stack

**Frontend**

- Vue 3 with TypeScript and Composition API
- Vite for fast development and optimized builds
- TailwindCSS for styling
- Comprehensive testing
  - Unit testing with Vitest
  - E2E testing with Cypress
- Development tooling
  - ESLint + Prettier for code quality
  - TypeScript for type safety
  - Vue Macros for enhanced Vue features

**Backend**

- Express.js server
- WebSocket (ws) implementation for real-time updates
- CORS enabled for development

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Installation

Clone the repository

```bash
git clone <repository-url>
```

## Setup

**At the root of the project, run:**

```bash
npm run setup
```

## Development

**This command will start both the frontend and backend in parallel.**

```bash
npm run dev
```

Note: The backend will be available at `http://localhost:8080` and the frontend will be available at `http://localhost:5173`.

If you want to start the backend only, you can run:

```bash
npm run dev:backend
```

If you want to start the frontend only, you can run:

```bash
npm run dev:frontend
```

## Testing

Run all unit tests:

```bash
npm run test
```

Run frontend unit tests:

```bash
npm run test:unit
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## Cleaning

**This command will remove the `node_modules` directory and all the dependencies.**

```bash
npm run clean
```
