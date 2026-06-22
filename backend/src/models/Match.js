const { DataTypes, Model } = require('sequelize');

class Match extends Model {
  static initModel(sequelize) {
    Match.init(
      {
        championship_id: DataTypes.INTEGER,
        round_id: DataTypes.INTEGER,
        home_team_id: DataTypes.INTEGER,
        away_team_id: DataTypes.INTEGER,
        home_goals: DataTypes.INTEGER,
        away_goals: DataTypes.INTEGER,
        status: DataTypes.ENUM('scheduled', 'finished'),
        match_date: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'matches',
      },
    );

    return Match;
  }
}

module.exports = Match;
