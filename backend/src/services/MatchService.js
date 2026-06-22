const MatchRepository = require('../repositories/MatchRepository');
const AppError = require('../utils/AppError');

class MatchService {
  constructor(matchRepository = new MatchRepository()) {
    this.matchRepository = matchRepository;
  }

  async list() {
    return this.matchRepository.findAll();
  }

  async getById(id) {
    const match = await this.matchRepository.findById(id);

    if (!match) {
      throw new AppError('Match not found', 404);
    }

    return match;
  }

  async getByChampionshipId(championshipId) {
    return this.matchRepository.findByChampionshipId(championshipId);
  }

  async getByRoundId(roundId) {
    return this.matchRepository.findByRoundId(roundId);
  }

  async updateResult(id, data = {}) {
    const match = await this.getById(id);
    const homeGoals = this.validateGoals(data.home_goals, 'Home goals');
    const awayGoals = this.validateGoals(data.away_goals, 'Away goals');

    return this.matchRepository.update(match, {
      home_goals: homeGoals,
      away_goals: awayGoals,
      status: 'finished',
    });
  }

  async delete(id) {
    const match = await this.getById(id);

    await this.matchRepository.delete(match);
  }

  validateGoals(value, fieldName) {
    if (value === undefined || value === null) {
      throw new AppError(`${fieldName} is required`);
    }

    if (!Number.isInteger(value)) {
      throw new AppError(`${fieldName} must be an integer`);
    }

    if (value < 0) {
      throw new AppError(`${fieldName} cannot be negative`);
    }

    return value;
  }
}

module.exports = MatchService;
