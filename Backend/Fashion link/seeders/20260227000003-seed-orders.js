'use strict';import React from 'react'
import PropTypes from 'prop-types'

export default (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />

  hocComponent.propTypes = {}

  return hocComponent
}


const ORDER_IMAGES = {
  fabric: 'https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/fabric.png',
  suit: 'https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/suit.png',
  green: 'https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/green.png',
  gown: 'https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/gown.png',
  kente: 'https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/kente.png',
  whiteShirt: 'https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/white%20shirt.png',
  weddingGown: 'https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/wedding%20gown.png'
};

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [artisans] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'artisan' ORDER BY id LIMIT 1"
    );
    const [clients] = await queryInterface.sequelize.query(
      'SELECT id FROM Clients ORDER BY id'
    );
    const userId = artisans[0]?.id || 1;

    const now = new Date();
    const orders = [
      { UserId: userId, ClientId: clients[0].id, order_number: 'ORD-001', status: 'In Progress', delivery_date: '2026-02-25', description: 'Custom Aso-Oke Agbada with intricate embroidery for a traditional wedding ceremony', notes: 'Client prefers gold thread embroidery', styleReferenceImageUrl: ORDER_IMAGES.fabric, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[1].id, order_number: 'ORD-002', status: 'Assigned', delivery_date: '2026-02-22', description: '2 piece suit in navy blue Italian wool', notes: 'Slim fit preferred, peak lapel', styleReferenceImageUrl: ORDER_IMAGES.suit, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[2].id, order_number: 'ORD-003', status: 'Delayed', delivery_date: '2026-02-20', description: 'Elegant evening gown with Emerald silk', notes: 'Halter neck, no sleeves, floor length', styleReferenceImageUrl: ORDER_IMAGES.green, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[3].id, order_number: 'ORD-004', status: 'In Progress', delivery_date: '2026-03-01', description: 'Contemporary Ankara jumpsuit with cape details', notes: 'Bold print, wide leg, cape attached at shoulders', styleReferenceImageUrl: ORDER_IMAGES.gown, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[4].id, order_number: 'ORD-005', status: 'Completed', delivery_date: '2026-02-18', description: 'Traditional Kente cloth with modern fit', notes: 'Kente strip pattern, fitted through chest', styleReferenceImageUrl: ORDER_IMAGES.kente, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[0].id, order_number: 'ORD-006', status: 'Assigned', delivery_date: '2026-02-28', description: 'Casual linen shirt in off-white with mandarin collar', notes: 'Breathable fabric, relaxed fit', styleReferenceImageUrl: ORDER_IMAGES.whiteShirt, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[5].id, order_number: 'ORD-007', status: 'In Progress', delivery_date: '2026-03-08', description: 'Bridal train dress in ivory satin with lace overlay', notes: 'Cathedral train, lace bodice, A-line skirt', styleReferenceImageUrl: ORDER_IMAGES.weddingGown, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[1].id, order_number: 'ORD-008', status: 'pending', delivery_date: '2026-03-15', description: 'Blazer and trousers set', notes: null, styleReferenceImageUrl: null, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[2].id, order_number: 'ORD-009', status: 'pending', delivery_date: '2026-03-20', description: 'Cocktail dress', notes: null, styleReferenceImageUrl: null, createdAt: now, updatedAt: now },
      { UserId: userId, ClientId: clients[4].id, order_number: 'ORD-010', status: 'Completed', delivery_date: '2026-02-10', description: 'Casual wear set', notes: null, styleReferenceImageUrl: null, createdAt: now, updatedAt: now }
    ];

    await queryInterface.bulkInsert('Orders', orders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
