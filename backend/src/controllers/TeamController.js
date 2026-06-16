const TeamRepository = require('../repositories/TeamRepository');
const TeamService = require('../services/TeamService');

const teamRepository = new TeamRepository();
const teamService = new TeamService(teamRepository);

class TeamController {
  async index(request, response, next) {
    try {
      const teams = await teamService.list();

      return response.json(teams);
    } catch (error) {
      return next(error);
    }
  }

  async show(request, response, next) {
    try {
      const team = await teamService.getById(request.params.id);

      return response.json(team);
    } catch (error) {
      return next(error);
    }
  }

  async create(request, response, next) {
    try {
      const team = await teamService.create(request.body);

      return response.status(201).json(team);
    } catch (error) {
      return next(error);
    }
  }

  async update(request, response, next) {
    try {
      const team = await teamService.update(request.params.id, request.body);

      return response.json(team);
    } catch (error) {
      return next(error);
    }
  }

  async delete(request, response, next) {
    try {
      await teamService.delete(request.params.id);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async deactivate(request, response, next) {
    try {
      const team = await teamService.deactivate(request.params.id);

      return response.json(team);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TeamController();
