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
  const profile = await ArtisanProfile.findByPk(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Artisan not found' });
  if (req.user.role !== 'admin' && profile.UserId !== req.user.id) {
    return res.status(403).json({ message: 'You can only update your own profile' });
  }
  await profile.update(req.body);
  res.json(profile);
};

exports.deleteArtisanProfile = async (req, res) => {
  const profile = await ArtisanProfile.findByPk(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Artisan not found' });
  if (req.user.role !== 'admin' && profile.UserId !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own profile' });
  }
  await profile.destroy();
  res.json({ message: 'Artisan deleted successfully' });
};