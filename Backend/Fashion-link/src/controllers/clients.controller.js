const { Client, Measurement } = require('../../models');
const avatarService = require('../services/avatar.service');
const recommendationService = require('../services/recommendation.service');

exports.createClient = async (req, res) => {
  try {
    const { fullName, email, phone, userId } = req.body;
    const client = await Client.create({
      fullName: fullName || req.body.name,
      email,
      phone,
      userId: userId || null,
      designerId: req.user.id
    });

    const avatarUrl = await avatarService.generateAvatar(req.body.measurements || {});
    const recommendations = await recommendationService.getStyleRecommendations(req.body);

    res.status(201).json({
      client,
      avatarUrl,
      recommendations
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: { designerId: req.user.id }
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (client.designerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (client.designerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await client.update(req.body);
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (client.designerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await client.destroy();
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMeasurement = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (client.designerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const measurement = await Measurement.create({ ...req.body, ClientId: req.params.id });
    const avatarUrl = await avatarService.generateAvatar(req.body);
    const recommendations = await recommendationService.getStyleRecommendations(req.body);

    res.status(201).json({
      measurement,
      avatarUrl,
      recommendations
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
