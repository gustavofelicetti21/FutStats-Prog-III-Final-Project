const { ChampionshipTeam } = require('../models');

class ChampionshipTeamRepository {
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
