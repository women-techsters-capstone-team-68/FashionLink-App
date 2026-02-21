const { Order, Task } = require('../../models');

exports.createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.findAll({ include: Task });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: Task });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.updateOrder = async (req, res) => {
  await Order.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Order updated successfully' });
};

exports.deleteOrder = async (req, res) => {
  await Order.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Order deleted successfully' });
};

exports.assignTask = async (req, res) => {
  const task = await Task.create({ ...req.body, OrderId: req.params.id });
  res.status(201).json(task);
};
