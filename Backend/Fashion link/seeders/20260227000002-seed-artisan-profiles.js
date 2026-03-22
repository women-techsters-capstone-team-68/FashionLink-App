'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [artisans] = await queryInterface.sequelize.query(
      "SELECT id, name FROM users WHERE role = 'artisan' ORDER BY id"
    );

    const avatarUrls = {
      'Maria Adeife': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&q=80',
      'Chima Ndukwe': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
      'Shirley Duru': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&q=80',
      'Alice Andrew': 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&q=80',
      'Grace Adebayo': 'https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image1.png'
    };

    const profiles = [
      { UserId: artisans[0].id, name: 'Maria Adeife', role: 'Aso-oke Weaver', location: 'Lagos, Nigeria', rating: 4.9, experience: 10, experienceLevel: 'expert', category: 'Textile & Fabric Creation', collabTypes: JSON.stringify(['project', 'longterm']), skills: JSON.stringify(['Hand-weave Aso-Oke fabric', 'Produce intricate patterns and colors']), bio: 'Specialize in creating high-quality, hand woven ceremonial fabrics with strong cultural meaning and detailed craftsmanship.', avatarUrl: avatarUrls['Maria Adeife'] || null, portfolio: JSON.stringify([{ img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80', caption: 'Handwoven Aso-Oke ceremonial fabric' }, { img: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=300&fit=crop&q=80', caption: 'Traditional wedding fabric set' }]) },
      { UserId: artisans[1].id, name: 'Chima Ndukwe', role: 'Shoemaker', location: 'Aba Abia, Nigeria', rating: 4.6, experience: 12, experienceLevel: 'expert', category: 'Accessories & Leather Goods', collabTypes: JSON.stringify(['project', 'longterm']), skills: JSON.stringify(['Making and repairing Shoes', 'Custom & Specialized Work with leather']), bio: 'Specialize artisans who create and repair shoes to ensure they fit well, look good, and last long.', avatarUrl: avatarUrls['Chima Ndukwe'] || null, portfolio: JSON.stringify([{ img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80', caption: 'Handmade brown leather personalized shoes' }, { img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop&q=80', caption: 'Men\'s Leather business, briefcase, laptop bag' }]) },
      { UserId: artisans[2].id, name: 'Shirley Duru', role: 'Couture Seamstress', location: 'Abuja, Nigeria', rating: 4.9, experience: 6, experienceLevel: 'advance', category: 'Garment Construction & Sewing', collabTypes: JSON.stringify(['project', 'contract']), skills: JSON.stringify(['Custom bridal and evening wear', 'Beading, embroidery, and embellishments']), bio: 'Specializes on luxury, custom-made clothing.', avatarUrl: avatarUrls['Shirley Duru'] || null, portfolio: JSON.stringify([{ img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&q=80', caption: 'Custom bridal gown with hand beading' }, { img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=300&fit=crop&q=80', caption: 'Evening wear with embellishments' }]) },
      { UserId: artisans[3].id, name: 'Alice Andrew', role: 'Corsetry Specialist', location: 'Lagos, Nigeria', rating: 4.5, experience: 8, experienceLevel: 'advance', category: 'Equipment & Structural Artisans', collabTypes: JSON.stringify(['project', 'onetime']), skills: JSON.stringify(['Waist training and body contouring pieces', 'Boning and structural support techniques']), bio: 'A corsetry specialist focuses on structured garments that shape and support the body.', avatarUrl: avatarUrls['Alice Andrew'] || null, portfolio: JSON.stringify([{ img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop&q=80', caption: 'Custom structured corset' }, { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&q=80', caption: 'Body contouring waist piece' }]) },
      { UserId: artisans[4].id, name: 'Grace Adebayo', role: 'Designer', location: 'Lagos, Nigeria', rating: 4.7, experience: 5, experienceLevel: 'advance', category: 'Garment Construction & Sewing', collabTypes: JSON.stringify(['project', 'longterm']), skills: JSON.stringify(['Custom tailoring', 'Traditional and modern wear']), bio: 'Designer with focus on bespoke and ready-to-wear.', avatarUrl: avatarUrls['Grace Adebayo'] || null, portfolio: JSON.stringify([{ img: 'https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image2-1.png', caption: 'Bespoke suit' }]) }
    ];

    const now = new Date();
    for (let i = 0; i < profiles.length; i++) {
      profiles[i].createdAt = now;
      profiles[i].updatedAt = now;
    }

    await queryInterface.bulkInsert('ArtisanProfiles', profiles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ArtisanProfiles', null, {});
  }
};
