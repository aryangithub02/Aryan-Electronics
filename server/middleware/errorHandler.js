/**
 * Global API Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  const response = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    response.error.message = 'Validation Error';
    response.error.details = Object.values(err.errors).map(val => val.message);
    return res.status(400).json(response);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    response.error.message = `Duplicate value entered for ${field}`;
    return res.status(400).json(response);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
