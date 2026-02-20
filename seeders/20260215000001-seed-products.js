'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    const now = new Date();
    
    await queryInterface.bulkInsert('Products', [
      // Dress products
      {
        productName: 'Dress',
        brand: 'Zara',
        category: 'Women\'s fashion',
        price: 52.00,
        colour: 'Black',
        size: 'M',
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
        createdAt: now,
        updatedAt: now
      },
      // T-shirt products
      {
        productName: 'T-shirt',
        brand: 'H&M',
        category: 'Men\'s fashion',
        price: 33.00,
        colour: 'Green',
        size: 'L',
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
        createdAt: now,
        updatedAt: now
      },
      // Jeans products
      {
        productName: 'Jeans',
        brand: 'Zara',
        category: 'Men\'s fashion',
        price: 70.00,
        colour: 'Black',
        size: 'L',
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
        createdAt: now,
        updatedAt: now
      },
      // Sweater products
      {
        productName: 'Sweater',
        brand: 'Gucci',
        category: 'Kid\'s fashion',
        price: 82.00,
        colour: 'White',
        size: 'XL',
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
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('Products', null, {});
  }
};
