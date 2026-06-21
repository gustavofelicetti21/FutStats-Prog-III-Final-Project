const ClassificationService = require('../src/services/ClassificationService');

function createChampionshipTeam(teamId, teamName) {
  return {
    team_id: teamId,
    Team: {
      name: teamName,
    },
  };
}

function createMatch(homeTeamId, awayTeamId, homeGoals, awayGoals, status = 'finished') {
  return {
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    home_goals: homeGoals,
    away_goals: awayGoals,
    status,
  };
}

function createService({ championshipTeams, matches }) {
  return new ClassificationService(
    {
      findById: jest.fn().mockResolvedValue({ id: 1 }),
    },
    {
      findByChampionshipId: jest.fn().mockResolvedValue(championshipTeams),
    },
    {
      findByChampionshipId: jest.fn().mockResolvedValue(matches),
    },
  );
}

describe('ClassificationService', () => {
  it('calculates wins, losses and points correctly', async () => {
    const service = createService({
      championshipTeams: [
        createChampionshipTeam(1, 'Alpha'),
        createChampionshipTeam(2, 'Beta'),
      ],
      matches: [
        createMatch(1, 2, 2, 0),
      ],
    });

    const standings = await service.getByChampionshipId(1);

    expect(standings[0]).toMatchObject({
      team_id: 1,
      points: 3,
      played: 1,
      wins: 1,
      draws: 0,
      losses: 0,
      goals_for: 2,
      goals_against: 0,
      goal_difference: 2,
    });
    expect(standings[1]).toMatchObject({
      team_id: 2,
      points: 0,
      played: 1,
      wins: 0,
      draws: 0,
      losses: 1,
      goals_for: 0,
      goals_against: 2,
      goal_difference: -2,
    });
  });

  it('calculates draws correctly', async () => {
    const service = createService({
      championshipTeams: [
        createChampionshipTeam(1, 'Alpha'),
        createChampionshipTeam(2, 'Beta'),
      ],
      matches: [
        createMatch(1, 2, 1, 1),
      ],
    });

    const standings = await service.getByChampionshipId(1);

    expect(standings).toEqual([
      expect.objectContaining({
        team_id: 1,
        points: 1,
        played: 1,
        wins: 0,
        draws: 1,
        losses: 0,
        goals_for: 1,
        goals_against: 1,
        goal_difference: 0,
      }),
      expect.objectContaining({
        team_id: 2,
        points: 1,
        played: 1,
        wins: 0,
        draws: 1,
        losses: 0,
        goals_for: 1,
        goals_against: 1,
        goal_difference: 0,
      }),
    ]);
  });

  it('sorts standings by points, wins, goal difference and goals for', async () => {
    const service = createService({
      championshipTeams: [],
      matches: [],
    });
    const standings = service.sortStandings([
      { team_id: 1, team_name: 'Alpha', points: 6, wins: 2, goal_difference: 1, goals_for: 3 },
      { team_id: 2, team_name: 'Beta', points: 6, wins: 2, goal_difference: 3, goals_for: 3 },
      { team_id: 3, team_name: 'Delta', points: 6, wins: 2, goal_difference: 3, goals_for: 5 },
      { team_id: 4, team_name: 'Gamma', points: 6, wins: 1, goal_difference: 10, goals_for: 10 },
      { team_id: 5, team_name: 'Omega', points: 7, wins: 1, goal_difference: 0, goals_for: 1 },
    ]);

    expect(standings.map((teamStanding) => teamStanding.team_id)).toEqual([5, 3, 2, 1, 4]);
  });

  it('includes linked teams without finished matches with zeroed stats', async () => {
    const service = createService({
      championshipTeams: [
        createChampionshipTeam(1, 'Alpha'),
        createChampionshipTeam(2, 'Beta'),
        createChampionshipTeam(3, 'Gamma'),
      ],
      matches: [
        createMatch(1, 2, 1, 0),
      ],
    });

    const standings = await service.getByChampionshipId(1);
    const gammaStanding = standings.find((teamStanding) => teamStanding.team_id === 3);

    expect(gammaStanding).toMatchObject({
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
    });
  });

  it('ignores matches that are not finished', async () => {
    const service = createService({
      championshipTeams: [
        createChampionshipTeam(1, 'Alpha'),
        createChampionshipTeam(2, 'Beta'),
      ],
      matches: [
        createMatch(1, 2, 4, 0, 'scheduled'),
      ],
    });

    const standings = await service.getByChampionshipId(1);

    standings.forEach((teamStanding) => {
      expect(teamStanding).toMatchObject({
        points: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
      });
    });
  });
});
