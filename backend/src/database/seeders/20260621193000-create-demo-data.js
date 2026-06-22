'use strict';

const demoTeams = [
  { name: 'FutStats Aurora', city: 'Curitiba', acronym: 'AUR' },
  { name: 'Verde Vale FC', city: 'Londrina', acronym: 'VVF' },
  { name: 'Atletico Serrano', city: 'Ponta Grossa', acronym: 'ATS' },
  { name: 'Operario Central', city: 'Maringa', acronym: 'OPC' },
];

const championshipName = 'Copa FutStats Demo';

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await removeDemoData(queryInterface, transaction);

      const now = new Date();

      await queryInterface.bulkInsert(
        'teams',
        demoTeams.map((team) => ({
          ...team,
          status: 'active',
          created_at: now,
          updated_at: now,
        })),
        { transaction },
      );

      await queryInterface.bulkInsert(
        'championships',
        [
          {
            name: championshipName,
            season: '2026',
            status: 'active',
            created_at: now,
            updated_at: now,
          },
        ],
        { transaction },
      );

      const teams = await selectTeams(queryInterface, transaction);
      const championship = await selectChampionship(queryInterface, transaction);

      await queryInterface.bulkInsert(
        'championship_teams',
        teams.map((team) => ({
          championship_id: championship.id,
          team_id: team.id,
          created_at: now,
          updated_at: now,
        })),
        { transaction },
      );

      await queryInterface.bulkInsert(
        'rounds',
        [
          { championship_id: championship.id, number: 1, type: 'first_leg', created_at: now, updated_at: now },
          { championship_id: championship.id, number: 2, type: 'first_leg', created_at: now, updated_at: now },
          { championship_id: championship.id, number: 3, type: 'second_leg', created_at: now, updated_at: now },
        ],
        { transaction },
      );

      const rounds = await selectRounds(queryInterface, championship.id, transaction);
      const teamByAcronym = Object.fromEntries(teams.map((team) => [team.acronym, team]));
      const roundByNumber = Object.fromEntries(rounds.map((round) => [round.number, round]));

      await queryInterface.bulkInsert(
        'matches',
        [
          createMatch(championship.id, roundByNumber[1].id, teamByAcronym.AUR.id, teamByAcronym.VVF.id, 2, 1, 'finished', now),
          createMatch(championship.id, roundByNumber[1].id, teamByAcronym.ATS.id, teamByAcronym.OPC.id, 1, 1, 'finished', now),
          createMatch(championship.id, roundByNumber[2].id, teamByAcronym.AUR.id, teamByAcronym.ATS.id, 0, 3, 'finished', now),
          createMatch(championship.id, roundByNumber[2].id, teamByAcronym.VVF.id, teamByAcronym.OPC.id, null, null, 'scheduled', now),
          createMatch(championship.id, roundByNumber[3].id, teamByAcronym.OPC.id, teamByAcronym.AUR.id, null, null, 'scheduled', now),
          createMatch(championship.id, roundByNumber[3].id, teamByAcronym.VVF.id, teamByAcronym.ATS.id, null, null, 'scheduled', now),
        ],
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await removeDemoData(queryInterface, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

async function removeDemoData(queryInterface, transaction) {
  const championship = await selectChampionship(queryInterface, transaction);
  const teamAcronyms = demoTeams.map((team) => team.acronym);

  if (championship) {
    await queryInterface.bulkDelete('matches', { championship_id: championship.id }, { transaction });
    await queryInterface.bulkDelete('rounds', { championship_id: championship.id }, { transaction });
    await queryInterface.bulkDelete('championship_teams', { championship_id: championship.id }, { transaction });
    await queryInterface.bulkDelete('championships', { id: championship.id }, { transaction });
  }

  await queryInterface.bulkDelete('teams', { acronym: teamAcronyms }, { transaction });
}

async function selectChampionship(queryInterface, transaction) {
  const [championships] = await queryInterface.sequelize.query(
    'SELECT id FROM championships WHERE name = :name LIMIT 1',
    {
      replacements: { name: championshipName },
      transaction,
    },
  );

  return championships[0];
}

async function selectTeams(queryInterface, transaction) {
  const [teams] = await queryInterface.sequelize.query(
    'SELECT id, acronym FROM teams WHERE acronym IN (:acronyms)',
    {
      replacements: { acronyms: demoTeams.map((team) => team.acronym) },
      transaction,
    },
  );

  return teams;
}

async function selectRounds(queryInterface, championshipId, transaction) {
  const [rounds] = await queryInterface.sequelize.query(
    'SELECT id, number FROM rounds WHERE championship_id = :championshipId',
    {
      replacements: { championshipId },
      transaction,
    },
  );

  return rounds;
}

function createMatch(
  championshipId,
  roundId,
  homeTeamId,
  awayTeamId,
  homeGoals,
  awayGoals,
  status,
  now,
) {
  return {
    championship_id: championshipId,
    round_id: roundId,
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    home_goals: homeGoals,
    away_goals: awayGoals,
    status,
    match_date: null,
    created_at: now,
    updated_at: now,
  };
}
