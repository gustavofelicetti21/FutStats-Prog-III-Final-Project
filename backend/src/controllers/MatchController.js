const MatchService = require('../services/MatchService');

const matchService = new MatchService();

class MatchController {
  async index(request, response, next) {
    try {
      const matches = await matchService.list();

      return response.json(matches);
    } catch (error) {
      return next(error);
    }
  }

  async show(request, response, next) {
    try {
      const match = await matchService.getById(request.params.id);

      return response.json(match);
    } catch (error) {
      return next(error);
    }
  }

  async byChampionship(request, response, next) {
    try {
      const matches = await matchService.getByChampionshipId(request.params.championshipId);

      return response.json(matches);
    } catch (error) {
      return next(error);
    }
  }

  async byRound(request, response, next) {
    try {
      const matches = await matchService.getByRoundId(request.params.roundId);

      return response.json(matches);
    } catch (error) {
      return next(error);
    }
  }

  async updateResult(request, response, next) {
    try {
      const match = await matchService.updateResult(request.params.id, request.body);

      return response.json(match);
    } catch (error) {
      return next(error);
    }
  }

  async delete(request, response, next) {
    try {
      await matchService.delete(request.params.id);

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new MatchController();
