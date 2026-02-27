'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users ORDER BY id LIMIT 1"
    );
    const userId = users[0]?.id ?? 1;

    const now = new Date();

    await queryInterface.bulkInsert('products', [
      // Dress products
      {
        productName: 'Dress',
        brand: 'Zara',
        category: 'Women\'s fashion',
        price: 52.00,
        colour: 'Black',
        size: 'M',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'Dress',
        brand: 'Gucci',
        category: 'Women\'s fashion',
        price: 130.00,
        colour: 'Red',
        size: 'S',
        userId,
        createdAt: now,
        updatedAt: now
      },
      // Shoes products
      {
        productName: 'Shoes',
        brand: 'Nike',
        category: 'Men\'s fashion',
        price: 82.00,
        colour: 'White',
        size: 'L',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'Shoes',
        brand: 'Adidas',
        category: 'Kid\'s fashion',
        price: 40.00,
        colour: 'Blue',
        size: 'XL',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'T-shirt',
        brand: 'H&M',
        category: 'Men\'s fashion',
        price: 33.00,
        colour: 'Green',
        size: 'L',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'T-shirt',
        brand: 'Nike',
        category: 'Women\'s fashion',
        price: 40.00,
        colour: 'Yellow',
        size: 'M',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'Jeans',
        brand: 'Zara',
        category: 'Men\'s fashion',
        price: 70.00,
        colour: 'Black',
        size: 'L',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'Jeans',
        brand: 'H&M',
        category: 'Women\'s fashion',
        price: 52.00,
        colour: 'Blue',
        size: 'S',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'Sweater',
        brand: 'Gucci',
        category: 'Kid\'s fashion',
        price: 82.00,
        colour: 'White',
        size: 'XL',
        userId,
        createdAt: now,
        updatedAt: now
      },
      {
        productName: 'Sweater',
        brand: 'Adidas',
        category: 'Men\'s fashion',
        price: 70.00,
        colour: 'Red',
        size: 'L',
        userId,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('products', null, {});
  }
};
