const { DataTypes, Model } = require('sequelize');

class ChampionshipTeam extends Model {
  static initModel(sequelize) {
    ChampionshipTeam.init(
      {
        championship_id: DataTypes.INTEGER,
        team_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'championship_teams',
      },
    );

    return ChampionshipTeam;
  }
}

module.exports = ChampionshipTeam;
