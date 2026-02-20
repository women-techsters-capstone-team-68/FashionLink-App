// src/services/search.service.js
const { ArtisanProfile } = require('../../models');
const { Op } = require('sequelize');

module.exports = {
  searchArtisans: async ({ specialty, location }) => {
    /**
     * Example of advanced search logic:
     *  - Specialty matching
     *  - Location proximity (optional)
     *  - Rating prioritization
     */

    const artisans = await ArtisanProfile.findAll({
      where: {
        specialties: { [Op.like]: `%${specialty || ''}%` },
        location: { [Op.like]: `%${location || ''}%` }
      },
      order: [['rating', 'DESC']] // highest rated first
    });

    return artisans;
  }
};
