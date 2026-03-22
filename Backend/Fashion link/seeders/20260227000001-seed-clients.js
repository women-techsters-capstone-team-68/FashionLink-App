'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'artisan' ORDER BY id LIMIT 1"
    );
    const designerId = users[0]?.id || 1;

    const [clientUsers] = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE role = 'client' ORDER BY id"
    );
    const clientUserIdByEmail = {};
    for (const u of clientUsers) {
      clientUserIdByEmail[u.email] = u.id;
    }

    const now = new Date();
    const clients = [
      { fullName: 'Amara Okonkwo', email: 'amara@email.com', phone: '+234 808 333 4567', designerId, userId: clientUserIdByEmail['client1@demo.com'] || null, createdAt: now, updatedAt: now },
      { fullName: 'David Mensah', email: 'david@email.com', phone: '+233 8083 3345 67', designerId, userId: clientUserIdByEmail['client2@demo.com'] || null, createdAt: now, updatedAt: now },
      { fullName: 'Fatimah Audu', email: 'fatimaa@email.com', phone: '+971 50 8333 4567', designerId, userId: clientUserIdByEmail['client3@demo.com'] || null, createdAt: now, updatedAt: now },
      { fullName: 'Chioma Eze', email: 'chiomaeze@email.com', phone: '+234 704 333 4567', designerId, userId: clientUserIdByEmail['client4@demo.com'] || null, createdAt: now, updatedAt: now },
      { fullName: 'Kwame Asante', email: 'kwame@email.com', phone: '+233 808 7654 567', designerId, userId: clientUserIdByEmail['client5@demo.com'] || null, createdAt: now, updatedAt: now },
      { fullName: 'Ngozi Adichie', email: 'ngozi@email.com', phone: '+234 784 3354 413', designerId, userId: null, createdAt: now, updatedAt: now }
    ];

    await queryInterface.bulkInsert('Clients', clients, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Clients', null, {});
  }
};
