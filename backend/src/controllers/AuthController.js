const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

class AuthController {
  async login(request, response, next) {
    try {
      const result = await authService.login(request.body);

      return response.json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
