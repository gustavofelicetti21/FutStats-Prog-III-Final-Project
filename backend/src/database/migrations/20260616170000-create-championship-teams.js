'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('championship_teams', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      championship_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'championships',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('championship_teams', {
      fields: ['championship_id', 'team_id'],
      type: 'unique',
      name: 'championship_teams_championship_id_team_id_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('championship_teams');
  },
};
