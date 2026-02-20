const { Product } = require('../../models');

exports.createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body, userId: req.user.id });
  res.status(201).json(product);
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll({ include: 'user' });
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: 'user' });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  await Product.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Product updated successfully' });
};

exports.deleteProduct = async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Product deleted successfully' });
};
