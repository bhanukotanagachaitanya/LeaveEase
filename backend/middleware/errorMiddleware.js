const { errorResponse } = require('../utils/responseHandler');

const notFound = (req, res, next) => {
  return errorResponse(res, 404, `API Route Not Found - [${req.method}] ${req.originalUrl}`);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error (e.g. duplicate Email or Employee ID)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${err.keyValue[field]}' already exists.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  console.error(`[Error Handler]: ${message}`);

  return errorResponse(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = { notFound, errorHandler };
