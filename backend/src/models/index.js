const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');
const Championship = require('./Championship');
const ChampionshipTeam = require('./ChampionshipTeam');
const Match = require('./Match');
const Round = require('./Round');
const Team = require('./Team');
const User = require('./User');

const sequelize = new Sequelize(databaseConfig);

Championship.initModel(sequelize);
ChampionshipTeam.initModel(sequelize);
Match.initModel(sequelize);
Round.initModel(sequelize);
Team.initModel(sequelize);
User.initModel(sequelize);

Championship.belongsToMany(Team, {
  through: ChampionshipTeam,
  foreignKey: 'championship_id',
  otherKey: 'team_id',
});

Team.belongsToMany(Championship, {
  through: ChampionshipTeam,
  foreignKey: 'team_id',
  otherKey: 'championship_id',
});

Championship.hasMany(ChampionshipTeam, {
  foreignKey: 'championship_id',
});

ChampionshipTeam.belongsTo(Championship, {
  foreignKey: 'championship_id',
});

Team.hasMany(ChampionshipTeam, {
  foreignKey: 'team_id',
});

ChampionshipTeam.belongsTo(Team, {
  foreignKey: 'team_id',
});

Championship.hasMany(Round, {
  foreignKey: 'championship_id',
});

Round.belongsTo(Championship, {
  foreignKey: 'championship_id',
});

Championship.hasMany(Match, {
  foreignKey: 'championship_id',
});

Match.belongsTo(Championship, {
  foreignKey: 'championship_id',
});

Round.hasMany(Match, {
  foreignKey: 'round_id',
});

Match.belongsTo(Round, {
  foreignKey: 'round_id',
});

Team.hasMany(Match, {
  as: 'HomeMatches',
  foreignKey: 'home_team_id',
});

Team.hasMany(Match, {
  as: 'AwayMatches',
  foreignKey: 'away_team_id',
});

Match.belongsTo(Team, {
  as: 'HomeTeam',
  foreignKey: 'home_team_id',
});

Match.belongsTo(Team, {
  as: 'AwayTeam',
  foreignKey: 'away_team_id',
});

module.exports = {
  sequelize,
  Sequelize,
  Championship,
  ChampionshipTeam,
  Match,
  Round,
  Team,
  User,
};
