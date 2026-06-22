const AppError = require('../utils/AppError');
const ChampionshipRepository = require('../repositories/ChampionshipRepository');
const ChampionshipTeamRepository = require('../repositories/ChampionshipTeamRepository');
const MatchRepository = require('../repositories/MatchRepository');
const RoundRepository = require('../repositories/RoundRepository');

const BYE_TEAM_ID = null;

class RoundGeneratorService {
  constructor(
    championshipRepository = new ChampionshipRepository(),
    championshipTeamRepository = new ChampionshipTeamRepository(),
    roundRepository = new RoundRepository(),
    matchRepository = new MatchRepository(),
  ) {
    this.championshipRepository = championshipRepository;
    this.championshipTeamRepository = championshipTeamRepository;
    this.roundRepository = roundRepository;
    this.matchRepository = matchRepository;
  }

  async generate(championshipId) {
    const championship = await this.getDraftChampionship(championshipId);
    const teamIds = await this.getChampionshipTeamIds(championship.id);

    await this.ensureRoundsWereNotGenerated(championship.id);

    const roundsSchedule = this.createRoundRobinSchedule(teamIds);
    const rounds = [];
    const matches = [];

    for (const roundData of roundsSchedule) {
      const round = await this.roundRepository.create({
        championship_id: championship.id,
        number: roundData.number,
        type: roundData.type,
      });

      rounds.push(round);

      for (const matchData of roundData.matches) {
        const match = await this.matchRepository.create({
          championship_id: championship.id,
          round_id: round.id,
          home_team_id: matchData.home_team_id,
          away_team_id: matchData.away_team_id,
          status: 'scheduled',
        });

        matches.push(match);
      }
    }

    await this.championshipRepository.update(championship, {
      status: 'active',
    });

    return {
      rounds,
      matches,
    };
  }

  async getDraftChampionship(championshipId) {
    const championship = await this.championshipRepository.findById(championshipId);

    if (!championship) {
      throw new AppError('Championship not found', 404);
    }

    if (championship.status !== 'draft') {
      throw new AppError('Rounds can only be generated while championship is in draft status');
    }

    return championship;
  }

  async getChampionshipTeamIds(championshipId) {
    const championshipTeams = await this.championshipTeamRepository.findByChampionshipId(
      championshipId,
    );

    if (championshipTeams.length < 2) {
      throw new AppError('Championship must have at least two teams to generate rounds');
    }

    return championshipTeams.map((championshipTeam) => championshipTeam.team_id);
  }

  async ensureRoundsWereNotGenerated(championshipId) {
    const rounds = await this.roundRepository.findByChampionshipId(championshipId);
    const matches = await this.matchRepository.findByChampionshipId(championshipId);

    if (rounds.length > 0 || matches.length > 0) {
      throw new AppError('Rounds already generated for this championship', 409);
    }
  }

  createRoundRobinSchedule(teamIds) {
    const firstLegRounds = this.createFirstLegRounds(teamIds);
    const secondLegRounds = firstLegRounds.map((round) => ({
      number: round.number + firstLegRounds.length,
      type: 'second_leg',
      matches: round.matches.map((match) => ({
        home_team_id: match.away_team_id,
        away_team_id: match.home_team_id,
      })),
    }));

    return [...firstLegRounds, ...secondLegRounds];
  }

  createFirstLegRounds(teamIds) {
    const rounds = [];
    const schedulableTeamIds = this.getSchedulableTeamIds(teamIds);
    let rotatingTeamIds = [...schedulableTeamIds];
    const roundsCount = schedulableTeamIds.length - 1;
    const matchesPerRound = schedulableTeamIds.length / 2;

    for (let roundIndex = 0; roundIndex < roundsCount; roundIndex += 1) {
      const matches = [];

      for (let matchIndex = 0; matchIndex < matchesPerRound; matchIndex += 1) {
        const firstTeamId = rotatingTeamIds[matchIndex];
        const secondTeamId = rotatingTeamIds[rotatingTeamIds.length - 1 - matchIndex];
        const shouldInvertHomeTeam = roundIndex % 2 !== 0;

        if (this.isByeMatch(firstTeamId, secondTeamId)) {
          continue;
        }

        matches.push({
          home_team_id: shouldInvertHomeTeam ? secondTeamId : firstTeamId,
          away_team_id: shouldInvertHomeTeam ? firstTeamId : secondTeamId,
        });
      }

      rounds.push({
        number: roundIndex + 1,
        type: 'first_leg',
        matches,
      });

      rotatingTeamIds = this.rotateTeamIds(rotatingTeamIds);
    }

    return rounds;
  }

  getSchedulableTeamIds(teamIds) {
    if (teamIds.length % 2 === 0) {
      return teamIds;
    }

    return [...teamIds, BYE_TEAM_ID];
  }

  isByeMatch(firstTeamId, secondTeamId) {
    return firstTeamId === BYE_TEAM_ID || secondTeamId === BYE_TEAM_ID;
  }

  rotateTeamIds(teamIds) {
    return [teamIds[0], teamIds[teamIds.length - 1], ...teamIds.slice(1, -1)];
  }
}

module.exports = RoundGeneratorService;
