const { ChampionshipTeam, Team } = require('../models');

class ChampionshipTeamRepository {
  async findByChampionshipId(championshipId) {
    return ChampionshipTeam.findAll({
      where: { championship_id: championshipId },
      include: [
        {
          model: Team,
        },
      ],
      order: [['team_id', 'ASC']],
    });
  }

  async findByChampionshipAndTeam(championshipId, teamId) {
    return ChampionshipTeam.findOne({
      where: {
        championship_id: championshipId,
        team_id: teamId,
      },
    });
  }

  async create(data) {
    return ChampionshipTeam.create(data);
  }

  async delete(championshipTeam) {
    await championshipTeam.destroy();
  }
}

module.exports = ChampionshipTeamRepository;
