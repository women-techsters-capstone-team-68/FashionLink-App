const { Client, Measurement } = require('../../models');
const avatarService = require('../services/avatar.service');
const recommendationService = require('../services/recommendation.service');

exports.createClient = async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, designerId: req.user.id });
    
    // Optional: generate default avatar for the client
    const avatarUrl = await avatarService.generateAvatar(req.body.measurements || {});
    
    // Optional: get style recommendations
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
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
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
    await client.destroy();
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.create({ ...req.body, ClientId: req.params.id });

    // Generate avatar after adding measurement
    const avatarUrl = await avatarService.generateAvatar(req.body);

    // Get style recommendations
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
