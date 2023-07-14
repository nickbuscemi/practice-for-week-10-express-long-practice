const express = require('express');
require('express-async-errors');
const app = express();

// For serving static assets
app.use('/static', express.static('assets'));

// For parsing JSON
app.use(express.json());

// -------------------------------- middleware ------------------------------ //
// Logger middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);

  res.on('finish', () => {
    console.log(`Outgoing response with status code ${res.statusCode}`);
  })
  next();
}

app.use(loggerMiddleware);

// -------------------------------------------------------------------------- //
// Import the dog router
const dogsRouter = require('./routes/dogs.js');
// connect the dog router
app.use('/dogs', dogsRouter);

// Resource not found middleware
const notFoundMiddleware = (req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.statusCode = 404;
  next(err);
};

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use(notFoundMiddleware);

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));