const ChampionshipService = require('../services/ChampionshipService');
const ChampionshipTeamService = require('../services/ChampionshipTeamService');
const RoundGeneratorService = require('../services/RoundGeneratorService');

const championshipService = new ChampionshipService();
const championshipTeamService = new ChampionshipTeamService();
const roundGeneratorService = new RoundGeneratorService();

class ChampionshipController {
  async index(request, response, next) {
    try {
      const championships = await championshipService.list();

      return response.json(championships);
    } catch (error) {
      return next(error);
    }
  }

  async show(request, response, next) {
    try {
      const championship = await championshipService.getById(request.params.id);

      return response.json(championship);
    } catch (error) {
      return next(error);
    }
  }

  async create(request, response, next) {
    try {
      const championship = await championshipService.create(request.body);

      return response.status(201).json(championship);
    } catch (error) {
      return next(error);
    }
  }

  async update(request, response, next) {
    try {
      const championship = await championshipService.update(request.params.id, request.body);

      return response.json(championship);
    } catch (error) {
      return next(error);
    }
  }

  async delete(request, response, next) {
    try {
      await championshipService.delete(request.params.id);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async deactivate(request, response, next) {
    try {
      const championship = await championshipService.deactivate(request.params.id);

      return response.json(championship);
    } catch (error) {
      return next(error);
    }
  }

  async addTeam(request, response, next) {
    try {
      const body = request.body || {};
      const championshipTeam = await championshipTeamService.addTeam(
        request.params.id,
        body.team_id || body.teamId,
      );

      return response.status(201).json(championshipTeam);
    } catch (error) {
      return next(error);
    }
  }

  async removeTeam(request, response, next) {
    try {
      await championshipTeamService.removeTeam(request.params.id, request.params.teamId);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async generateRounds(request, response, next) {
    try {
      const result = await roundGeneratorService.generate(request.params.id);

      return response.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ChampionshipController();
