const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');
const Team = require('./Team');
const User = require('./User');

const sequelize = new Sequelize(databaseConfig);

Team.initModel(sequelize);
User.initModel(sequelize);

module.exports = {
  sequelize,
  Sequelize,
  Team,
  User,
};
