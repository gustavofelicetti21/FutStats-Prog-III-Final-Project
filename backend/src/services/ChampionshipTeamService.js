const AppError = require('../utils/AppError');
const ChampionshipRepository = require('../repositories/ChampionshipRepository');
const ChampionshipTeamRepository = require('../repositories/ChampionshipTeamRepository');
const TeamRepository = require('../repositories/TeamRepository');

class ChampionshipTeamService {
  constructor(
    championshipTeamRepository = new ChampionshipTeamRepository(),
    championshipRepository = new ChampionshipRepository(),
    teamRepository = new TeamRepository(),
  ) {
    this.championshipTeamRepository = championshipTeamRepository;
    this.championshipRepository = championshipRepository;
    this.teamRepository = teamRepository;
  }

  async addTeam(championshipId, teamId) {
    const championship = await this.getDraftChampionship(championshipId);
    const team = await this.getTeam(teamId);

    if (team.status === 'deactivated') {
      throw new AppError('Cannot add a deactivated team to a championship');
    }

    const existingRelationship = await this.championshipTeamRepository.findByChampionshipAndTeam(
      championship.id,
      team.id,
    );

    if (existingRelationship) {
      throw new AppError('Team already linked to this championship', 409);
    }

    return this.championshipTeamRepository.create({
      championship_id: championship.id,
      team_id: team.id,
    });
  }

  async removeTeam(championshipId, teamId) {
    const championship = await this.getDraftChampionship(championshipId);
    const team = await this.getTeam(teamId);

    const championshipTeam = await this.championshipTeamRepository.findByChampionshipAndTeam(
      championship.id,
      team.id,
    );

    if (!championshipTeam) {
      throw new AppError('Team is not linked to this championship', 404);
    }

    await this.championshipTeamRepository.delete(championshipTeam);
  }

  async getDraftChampionship(championshipId) {
    const championship = await this.championshipRepository.findById(championshipId);

    if (!championship) {
      throw new AppError('Championship not found', 404);
    }

    if (championship.status !== 'draft') {
      throw new AppError('Championship teams can only be changed while championship is in draft status');
    }

    return championship;
  }

  async getTeam(teamId) {
    if (!teamId) {
      throw new AppError('Team is required');
    }

    const team = await this.teamRepository.findById(teamId);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    return team;
  }
}

module.exports = ChampionshipTeamService;
