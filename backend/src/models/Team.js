const { DataTypes, Model } = require('sequelize');

class Team extends Model {
  static initModel(sequelize) {
    Team.init(
      {
        name: DataTypes.STRING,
        city: DataTypes.STRING,
        acronym: DataTypes.STRING,
        status: DataTypes.ENUM('active', 'deactivated'),
      },
      {
        sequelize,
        tableName: 'teams',
      },
    );

    return Team;
  }
}

module.exports = Team;
