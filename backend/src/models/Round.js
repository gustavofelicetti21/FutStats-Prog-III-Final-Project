const { DataTypes, Model } = require('sequelize');

class Round extends Model {
  static initModel(sequelize) {
    Round.init(
      {
        championship_id: DataTypes.INTEGER,
        number: DataTypes.INTEGER,
        type: DataTypes.ENUM('first_leg', 'second_leg'),
      },
      {
        sequelize,
        tableName: 'rounds',
      },
    );

    return Round;
  }
}

module.exports = Round;
