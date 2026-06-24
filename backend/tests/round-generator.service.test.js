const RoundGeneratorService = require('../src/services/RoundGeneratorService');

function createChampionshipTeam(teamId) {
  return {
    team_id: teamId,
  };
}

function createService({
  teamIds,
  existingRounds = [],
  existingMatches = [],
} = {}) {
  const championship = {
    id: 1,
    status: 'draft',
  };
  const createdRounds = [];
  const createdMatches = [];

  const service = new RoundGeneratorService(
    {
      findById: jest.fn().mockResolvedValue(championship),
      update: jest.fn().mockImplementation(async (championshipToUpdate, data) => {
        Object.assign(championshipToUpdate, data);
        return championshipToUpdate;
      }),
    },
    {
      findByChampionshipId: jest.fn().mockResolvedValue(teamIds.map(createChampionshipTeam)),
    },
    {
      findByChampionshipId: jest.fn().mockResolvedValue(existingRounds),
      create: jest.fn().mockImplementation(async (data) => {
        const round = {
          id: createdRounds.length + 1,
          ...data,
        };

        createdRounds.push(round);

        return round;
      }),
    },
    {
      findByChampionshipId: jest.fn().mockResolvedValue(existingMatches),
      create: jest.fn().mockImplementation(async (data) => {
        const match = {
          id: createdMatches.length + 1,
          ...data,
        };

        createdMatches.push(match);

        return match;
      }),
    },
  );

  return {
    championship,
    createdMatches,
    createdRounds,
    service,
  };
}

describe('RoundGeneratorService', () => {
  it('generates first leg and second leg for an even number of teams', async () => {
    const { service } = createService({
      teamIds: [1, 2, 3, 4],
    });

    const result = await service.generate(1);

    expect(result.rounds).toHaveLength(6);
    expect(result.rounds.slice(0, 3).every((round) => round.type === 'first_leg')).toBe(true);
    expect(result.rounds.slice(3).every((round) => round.type === 'second_leg')).toBe(true);
    expect(result.matches).toHaveLength(12);
  });

  it('generates rounds and matches correctly for four teams', async () => {
    const { service } = createService({
      teamIds: [1, 2, 3, 4],
    });

    const result = await service.generate(1);

    expect(result.rounds.map((round) => round.number)).toEqual([1, 2, 3, 4, 5, 6]);

    result.rounds.forEach((round) => {
      const roundMatches = result.matches.filter((match) => match.round_id === round.id);

      expect(roundMatches).toHaveLength(2);
      roundMatches.forEach((match) => {
        expect(match.status).toBe('scheduled');
        expect(match.home_goals).toBeUndefined();
        expect(match.away_goals).toBeUndefined();
      });
    });
  });

  it('handles odd number of teams with byes', async () => {
    const teamIds = [1, 2, 3, 4, 5];
    const { service } = createService({
      teamIds,
    });

    const result = await service.generate(1);

    expect(result.rounds).toHaveLength(10);
    expect(result.matches).toHaveLength(20);

    const firstLegRounds = result.rounds.filter((round) => round.type === 'first_leg');
    const byesByTeam = teamIds.reduce((byes, teamId) => ({
      ...byes,
      [teamId]: 0,
    }), {});

    firstLegRounds.forEach((round) => {
      const playingTeamIds = new Set(
        result.matches
          .filter((match) => match.round_id === round.id)
          .flatMap((match) => [match.home_team_id, match.away_team_id]),
      );
      const byeTeamId = teamIds.find((teamId) => !playingTeamIds.has(teamId));

      byesByTeam[byeTeamId] += 1;
    });

    expect(byesByTeam).toEqual({
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
    });
  });

  it('does not create matches against the bye', async () => {
    const { service } = createService({
      teamIds: [1, 2, 3, 4, 5],
    });

    const result = await service.generate(1);

    result.matches.forEach((match) => {
      expect(match.home_team_id).not.toBeNull();
      expect(match.away_team_id).not.toBeNull();
    });
  });

  it('blocks duplicated generation when rounds already exist', async () => {
    const { service } = createService({
      teamIds: [1, 2, 3, 4],
      existingRounds: [{ id: 1 }],
    });

    await expect(service.generate(1)).rejects.toMatchObject({
      message: 'Rounds already generated for this championship',
      statusCode: 409,
    });
  });

  it('blocks duplicated generation when matches already exist', async () => {
    const { service } = createService({
      teamIds: [1, 2, 3, 4],
      existingMatches: [{ id: 1 }],
    });

    await expect(service.generate(1)).rejects.toMatchObject({
      message: 'Rounds already generated for this championship',
      statusCode: 409,
    });
  });

  it('changes championship status to active after generating rounds', async () => {
    const { championship, service } = createService({
      teamIds: [1, 2, 3, 4],
    });

    await service.generate(1);

    expect(championship.status).toBe('active');
  });
});
