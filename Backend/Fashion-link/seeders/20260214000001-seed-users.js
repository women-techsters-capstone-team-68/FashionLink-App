'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const seedEmails = [
      'artisan1@demo.com', 'artisan2@demo.com', 'artisan3@demo.com', 'artisan4@demo.com', 'artisan5@demo.com',
      'client1@demo.com', 'client2@demo.com', 'client3@demo.com', 'client4@demo.com', 'client5@demo.com',
      'admin1@demo.com', 'admin2@demo.com'
    ];
    await queryInterface.bulkDelete('users', { email: { [Sequelize.Op.in]: seedEmails } });

    const now = new Date();
    const hashed = await bcrypt.hash('password', 10);

    await queryInterface.bulkInsert('users', [
      // 5 artisan users (Maria, Chima, Shirley, Alice + one more)
      { name: 'Maria Adeife', email: 'artisan1@demo.com', password: hashed, role: 'artisan', createdAt: now, updatedAt: now },
      { name: 'Chima Ndukwe', email: 'artisan2@demo.com', password: hashed, role: 'artisan', createdAt: now, updatedAt: now },
      { name: 'Shirley Duru', email: 'artisan3@demo.com', password: hashed, role: 'artisan', createdAt: now, updatedAt: now },
      { name: 'Alice Andrew', email: 'artisan4@demo.com', password: hashed, role: 'artisan', createdAt: now, updatedAt: now },
      { name: 'Grace Adebayo', email: 'artisan5@demo.com', password: hashed, role: 'artisan', createdAt: now, updatedAt: now },
      // 5 client users
      { name: 'Amara Okonkwo', email: 'client1@demo.com', password: hashed, role: 'client', createdAt: now, updatedAt: now },
      { name: 'David Mensah', email: 'client2@demo.com', password: hashed, role: 'client', createdAt: now, updatedAt: now },
      { name: 'Fatimah Audu', email: 'client3@demo.com', password: hashed, role: 'client', createdAt: now, updatedAt: now },
      { name: 'Chioma Eze', email: 'client4@demo.com', password: hashed, role: 'client', createdAt: now, updatedAt: now },
      { name: 'Kwame Asante', email: 'client5@demo.com', password: hashed, role: 'client', createdAt: now, updatedAt: now },
      // 2 admin users
      { name: 'Admin One', email: 'admin1@demo.com', password: hashed, role: 'admin', createdAt: now, updatedAt: now },
      { name: 'Admin Two', email: 'admin2@demo.com', password: hashed, role: 'admin', createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
