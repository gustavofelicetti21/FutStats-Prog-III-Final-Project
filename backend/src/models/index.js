const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');
const Championship = require('./Championship');
const Team = require('./Team');
const User = require('./User');

const sequelize = new Sequelize(databaseConfig);

Championship.initModel(sequelize);
Team.initModel(sequelize);
User.initModel(sequelize);

module.exports = {
  sequelize,
  Sequelize,
  Championship,
  Team,
  User,
};
