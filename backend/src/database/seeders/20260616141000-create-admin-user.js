'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('admin123', 8);
    const now = new Date();

    await queryInterface.sequelize.query(
      `
        INSERT INTO users (name, email, password_hash, created_at, updated_at)
        VALUES (:name, :email, :passwordHash, :createdAt, :updatedAt)
        ON CONFLICT (email) DO NOTHING
      `,
      {
        replacements: {
          name: 'FutStats Admin',
          email: 'admin@futstats.com',
          passwordHash,
          createdAt: now,
          updatedAt: now,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: 'admin@futstats.com',
    });
  },
};
