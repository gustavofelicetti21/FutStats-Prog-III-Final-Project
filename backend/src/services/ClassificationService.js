const AppError = require('../utils/AppError');
const ChampionshipRepository = require('../repositories/ChampionshipRepository');
const ChampionshipTeamRepository = require('../repositories/ChampionshipTeamRepository');
const MatchRepository = require('../repositories/MatchRepository');

class ClassificationService {
  constructor(
    championshipRepository = new ChampionshipRepository(),
    championshipTeamRepository = new ChampionshipTeamRepository(),
    matchRepository = new MatchRepository(),
  ) {
    this.championshipRepository = championshipRepository;
    this.championshipTeamRepository = championshipTeamRepository;
    this.matchRepository = matchRepository;
  }

  async getByChampionshipId(championshipId) {
    const championship = await this.championshipRepository.findById(championshipId);

    if (!championship) {
      throw new AppError('Championship not found', 404);
    }

    const standings = await this.createInitialStandings(championship.id);
    const matches = await this.matchRepository.findByChampionshipId(championship.id);
    const finishedMatches = matches.filter((match) => match.status === 'finished');

    finishedMatches.forEach((match) => {
      this.applyMatchResult(standings, match);
    });

    return this.sortStandings([...standings.values()]).map((teamStanding, index) => ({
      position: index + 1,
      team_id: teamStanding.team_id,
      team_name: teamStanding.team_name,
      points: teamStanding.points,
      played: teamStanding.played,
      wins: teamStanding.wins,
      draws: teamStanding.draws,
      losses: teamStanding.losses,
      goals_for: teamStanding.goals_for,
      goals_against: teamStanding.goals_against,
      goal_difference: teamStanding.goal_difference,
    }));
  }

  async createInitialStandings(championshipId) {
    const championshipTeams = await this.championshipTeamRepository.findByChampionshipId(
      championshipId,
    );

    return championshipTeams.reduce((standings, championshipTeam) => {
      standings.set(championshipTeam.team_id, this.createTeamStanding(championshipTeam));

      return standings;
    }, new Map());
  }

  createTeamStanding(championshipTeam) {
    return {
      team_id: championshipTeam.team_id,
      team_name: championshipTeam.Team.name,
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
    };
  }

  applyMatchResult(standings, match) {
    const homeTeamStanding = standings.get(match.home_team_id);
    const awayTeamStanding = standings.get(match.away_team_id);

    if (!homeTeamStanding || !awayTeamStanding) {
      return;
    }

    this.applyTeamResult(
      homeTeamStanding,
      match.home_goals,
      match.away_goals,
    );
    this.applyTeamResult(
      awayTeamStanding,
      match.away_goals,
      match.home_goals,
    );
  }

  applyTeamResult(teamStanding, goalsFor, goalsAgainst) {
    teamStanding.played += 1;
    teamStanding.goals_for += goalsFor;
    teamStanding.goals_against += goalsAgainst;
    teamStanding.goal_difference = teamStanding.goals_for - teamStanding.goals_against;

    if (goalsFor > goalsAgainst) {
      teamStanding.wins += 1;
      teamStanding.points += 3;
      return;
    }

    if (goalsFor === goalsAgainst) {
      teamStanding.draws += 1;
      teamStanding.points += 1;
      return;
    }

    teamStanding.losses += 1;
  }

  sortStandings(standings) {
    return standings.sort((firstTeam, secondTeam) => {
      if (secondTeam.points !== firstTeam.points) {
        return secondTeam.points - firstTeam.points;
      }

      if (secondTeam.wins !== firstTeam.wins) {
        return secondTeam.wins - firstTeam.wins;
      }

      if (secondTeam.goal_difference !== firstTeam.goal_difference) {
        return secondTeam.goal_difference - firstTeam.goal_difference;
      }

      if (secondTeam.goals_for !== firstTeam.goals_for) {
        return secondTeam.goals_for - firstTeam.goals_for;
      }

      return firstTeam.team_name.localeCompare(secondTeam.team_name);
    });
  }
}

module.exports = ClassificationService;
