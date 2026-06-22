const { Match, Team } = require('../models');

class MatchRepository {
  async findAll() {
    return Match.findAll({
      include: [
        {
          model: Team,
          as: 'HomeTeam',
        },
        {
          model: Team,
          as: 'AwayTeam',
        },
      ],
      order: [
        ['round_id', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  }

  async findById(id) {
    return Match.findByPk(id, {
      include: [
        {
          model: Team,
          as: 'HomeTeam',
        },
        {
          model: Team,
          as: 'AwayTeam',
        },
      ],
    });
  }

  async findByChampionshipId(championshipId) {
    return Match.findAll({
      where: { championship_id: championshipId },
      include: [
        {
          model: Team,
          as: 'HomeTeam',
        },
        {
          model: Team,
          as: 'AwayTeam',
        },
      ],
      order: [
        ['round_id', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  }

  async findByRoundId(roundId) {
    return Match.findAll({
      where: { round_id: roundId },
      order: [['id', 'ASC']],
    });
  }

  async create(data) {
    return Match.create(data);
  }

  async update(match, data) {
    return match.update(data);
  }

  async delete(match) {
    await match.destroy();
  }
}

module.exports = MatchRepository;
