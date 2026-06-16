const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');
const User = require('./User');

const sequelize = new Sequelize(databaseConfig);

User.initModel(sequelize);

module.exports = {
  sequelize,
  Sequelize,
  User,
};
