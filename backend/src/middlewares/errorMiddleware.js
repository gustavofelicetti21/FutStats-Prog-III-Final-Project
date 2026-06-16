const AppError = require('../utils/AppError');

function errorMiddleware(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error',
  });
}

module.exports = errorMiddleware;
