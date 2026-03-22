const searchService = require('../services/search.service');
const { Product } = require('../../models');
const { Op } = require('sequelize');

exports.searchArtisans = async (req, res) => {
  try {
    const { specialty, location } = req.query;
    const artisans = await searchService.searchArtisans({ specialty, location });
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    // For now, simple search via Product model
    const { name, category } = req.query;
    const products = await Product.findAll({
      where: {
        productName: { [Op.like]: `%${name || ''}%` },
        category: { [Op.like]: `%${category || ''}%` }
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
