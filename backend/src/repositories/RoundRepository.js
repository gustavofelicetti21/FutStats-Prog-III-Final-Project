const { Round } = require('../models');

class RoundRepository {
  async findAll() {
    return Round.findAll({
      order: [
        ['championship_id', 'ASC'],
        ['number', 'ASC'],
      ],
    });
  }

  async findById(id) {
    return Round.findByPk(id);
  }

  async findByChampionshipId(championshipId) {
    return Round.findAll({
      where: { championship_id: championshipId },
      order: [['number', 'ASC']],
    });
  }

  async findByChampionshipIdAndNumber(championshipId, number) {
    return Round.findOne({
      where: {
        championship_id: championshipId,
        number,
      },
    });
  }

  async create(data) {
    return Round.create(data);
  }

  async update(round, data) {
    return round.update(data);
  }

  async delete(round) {
    await round.destroy();
  }
}

module.exports = RoundRepository;
