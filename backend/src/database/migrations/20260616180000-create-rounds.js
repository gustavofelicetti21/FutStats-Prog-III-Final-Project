'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rounds', {
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
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('first_leg', 'second_leg'),
        allowNull: false,
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

    await queryInterface.addConstraint('rounds', {
      fields: ['championship_id', 'number'],
      type: 'unique',
      name: 'rounds_championship_id_number_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rounds');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_rounds_type;');
  },
};
