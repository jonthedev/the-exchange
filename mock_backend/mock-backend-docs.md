# Mock API back-end

You will find an implementation of a primitive exchange back-end together with the assignment. It’s provided for your convenience, you can run it in the background and implement your front-end components against its ‘real’ back-end APIs.
You are not required to use this back-end, nor use all of its APIs. You could as well opt for mocking exchange state on the front-end itself, or even implement your own back-end.

This back-end provides HTTP APIs to list open orders, insert a new order, and a WebSocket API to subscribe to order updates. See API docs section below for details.

The back-end does not perform any order matching or trading. Instead, it mimics the exchange behavior by constantly removing older orders and inserting new ones, quoting random prices and amounts. You can expect it to produce thousands of order updates per second.

Feel free to modify the back-end code if you believe it’s necessary for the assignment. Note though, the implementation is intentionally kept simple and does not represent production-quality code, let alone proper API design.

##Running the mock back-end

The back-end is implemented using node with express framework and ws library used for HTTP and WebSocket servers respectively. Node 20 should be sufficient to run the backend.

To build and run it use:

```
cd mock_backend
npm install
node .
```

Tip: if you’re planning to modify the code, consider running nodemon . for hot reload.
