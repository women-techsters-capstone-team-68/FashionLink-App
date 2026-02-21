const { ArtisanProfile } = require('../../models');

exports.createArtisanProfile = async (req, res) => {
  const profile = await ArtisanProfile.create({ ...req.body, UserId: req.user.id });
  res.status(201).json(profile);
};

exports.getAllArtisans = async (req, res) => {
  const artisans = await ArtisanProfile.findAll();
  res.json(artisans);
};

exports.getArtisanById = async (req, res) => {
  const artisan = await ArtisanProfile.findByPk(req.params.id);
  if (!artisan) return res.status(404).json({ message: 'Artisan not found' });
  res.json(artisan);
};

exports.updateArtisanProfile = async (req, res) => {
  await ArtisanProfile.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Artisan updated successfully' });
};

exports.deleteArtisanProfile = async (req, res) => {
  await ArtisanProfile.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Artisan deleted successfully' });
};