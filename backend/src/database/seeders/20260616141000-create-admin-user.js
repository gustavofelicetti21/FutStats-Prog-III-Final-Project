'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('admin123', 8);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'FutStats Admin',
        email: 'admin@futstats.com',
        password_hash: passwordHash,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: 'admin@futstats.com',
    });
  },
};
