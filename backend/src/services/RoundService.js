const AppError = require('../utils/AppError');
const ChampionshipRepository = require('../repositories/ChampionshipRepository');
const RoundRepository = require('../repositories/RoundRepository');

class RoundService {
  constructor(
    roundRepository = new RoundRepository(),
    championshipRepository = new ChampionshipRepository(),
  ) {
    this.roundRepository = roundRepository;
    this.championshipRepository = championshipRepository;
  }

  async getByChampionshipId(championshipId) {
    const championship = await this.championshipRepository.findById(championshipId);

    if (!championship) {
      throw new AppError('Championship not found', 404);
    }

    return this.roundRepository.findByChampionshipId(championship.id);
  }
}

module.exports = RoundService;
