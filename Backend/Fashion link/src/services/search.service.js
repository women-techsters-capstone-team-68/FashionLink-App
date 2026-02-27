// src/services/search.service.js
const { ArtisanProfile } = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  searchArtisans: async ({ specialty, location }) => {
    const where = {};
    if (specialty) {
      where[Op.or] = [
        { role: { [Op.like]: `%${specialty}%` } },
        { category: { [Op.like]: `%${specialty}%` } }
      ];
    }
    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }

    const artisans = await ArtisanProfile.findAll({
      where: Object.keys(where).length ? where : undefined,
      order: [['rating', 'DESC']]
    });

    return artisans;
  }
};
