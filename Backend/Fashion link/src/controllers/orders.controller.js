const { Order, Task, Client } = require('../../models');
const { Op } = require('sequelize');

function generateOrderNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${String(n).padStart(3, '0')}`;
}

exports.createOrder = async (req, res) => {
  try {
    const {
      clientId,
      status,
      notes,
      order_number,
      total_amount,
      shipping_address,
      deliveryDate,
      delivery_date,
      description,
      chest,
      waist,
      hip,
      shoulder,
      sleeve,
      length
    } = req.body;
    // Style reference image is not persisted — no storage configured yet
    const order = await Order.create({
      ClientId: clientId,
      UserId: req.user?.id,
      status: status || 'pending',
      notes: notes || null,
      order_number: order_number || generateOrderNumber(),
      total_amount: total_amount || null,
      shipping_address: shipping_address || null,
      delivery_date: deliveryDate || delivery_date || null,
      description: description || null,
      styleReferenceImageUrl: null,
      chest: chest ?? null,
      waist: waist ?? null,
      hip: hip ?? null,
      shoulder: shoulder ?? null,
      sleeve: sleeve ?? null,
      length: length ?? null
    });
    res.status(201).json(order);
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ message: err.message || 'Failed to create order' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status: statusFilter, mine } = req.query;
    const where = {};

    if (req.user.role === 'artisan' || req.user.role === 'admin') {
      where.UserId = req.user.id;
    } else if (req.user.role === 'client' || mine === '1') {
      const clientIds = await Client.findAll({
        where: { userId: req.user.id },
        attributes: ['id']
      }).then(rows => rows.map(r => r.id));
      if (clientIds.length === 0) return res.json([]);
      where.ClientId = { [Op.in]: clientIds };
    }

    if (statusFilter) where.status = statusFilter;

    const orders = await Order.findAll({
      where,
      include: [
        { model: Task, as: 'tasks', required: false },
        { model: Client, as: 'client', attributes: ['id', 'fullName', 'email', 'phone'], required: false }
      ],
      order: [['delivery_date', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error('getAllOrders error:', err);
    res.status(500).json({ message: err.message || 'Failed to list orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid order id' });
    const order = await Order.findByPk(id, {
      include: [
        { model: Task, as: 'tasks', required: false },
        { model: Client, as: 'client', attributes: ['id', 'fullName', 'email', 'phone'], required: false }
      ]
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role === 'artisan' || req.user.role === 'admin') {
      if (order.UserId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    } else if (req.user.role === 'client') {
      const client = await Client.findByPk(order.ClientId);
      if (!client || client.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    console.error('getOrderById error:', err);
    res.status(500).json({ message: err.message || 'Failed to get order' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid order id' });
    const { styleReferenceImageUrl, ...rest } = req.body;
    const [affectedCount] = await Order.update(rest, { where: { id } });
    if (affectedCount === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error('updateOrder error:', err);
    res.status(500).json({ message: err.message || 'Failed to update order' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid order id' });
    const deleted = await Order.destroy({ where: { id } });
    if (deleted === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('deleteOrder error:', err);
    res.status(500).json({ message: err.message || 'Failed to delete order' });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (Number.isNaN(orderId)) return res.status(400).json({ message: 'Invalid order id' });
    const task = await Task.create({ ...req.body, OrderId: orderId });
    res.status(201).json(task);
  } catch (err) {
    console.error('assignTask error:', err);
    res.status(500).json({ message: err.message || 'Failed to assign task' });
  }
};
