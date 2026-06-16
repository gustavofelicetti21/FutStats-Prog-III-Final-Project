const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new AppError('Email and password are required');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || 'change_me',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}

module.exports = AuthService;
