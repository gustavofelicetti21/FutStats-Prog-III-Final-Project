const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');

function authMiddleware(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return next(new AppError('JWT token is required', 401));
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new AppError('Invalid authorization format', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_me');

    request.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (error) {
    return next(new AppError('Invalid JWT token', 401));
  }
}

module.exports = authMiddleware;
