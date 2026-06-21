const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');
const Championship = require('./Championship');
const ChampionshipTeam = require('./ChampionshipTeam');
const Team = require('./Team');
const User = require('./User');

const sequelize = new Sequelize(databaseConfig);

Championship.initModel(sequelize);
ChampionshipTeam.initModel(sequelize);
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

module.exports = {
  sequelize,
  Sequelize,
  Championship,
  ChampionshipTeam,
  Team,
  User,
};
