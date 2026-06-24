const { DataTypes, Model } = require('sequelize');

class Championship extends Model {
  static initModel(sequelize) {
    Championship.init(
      {
        name: DataTypes.STRING,
        season: DataTypes.STRING,
        status: DataTypes.ENUM('draft', 'active', 'finished', 'deactivated'),
      },
      {
        sequelize,
        tableName: 'championships',
      },
    );

    return Championship;
  }
}

module.exports = Championship;
