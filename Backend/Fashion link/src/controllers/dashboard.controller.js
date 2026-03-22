const { Order } = require('../../models');
const { Op } = require('sequelize');

function toDateOnly(d) {
  return d.toISOString().slice(0, 10);
}

module.exports.getStats = async (req, res) => {
  try {
    if (req.user.role !== 'artisan' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Dashboard stats are for artisans only' });
    }

    const now = new Date();
    const today = toDateOnly(now);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startWeek = toDateOnly(startOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endWeek = toDateOnly(endOfWeek);

    const completedStatuses = ['Completed', 'completed'];

    const [activeOrders, dueThisWeek, completedCount, delayed] = await Promise.all([
      Order.count({
        where: {
          UserId: req.user.id,
          status: { [Op.in]: ['pending', 'Assigned', 'In Progress'] }
        }
      }),
      Order.count({
        where: {
          UserId: req.user.id,
          delivery_date: { [Op.between]: [startWeek, endWeek] },
          status: { [Op.notIn]: completedStatuses }
        }
      }),
      Order.count({
        where: { UserId: req.user.id, status: { [Op.in]: completedStatuses } }
      }),
      Order.count({
        where: {
          UserId: req.user.id,
          delivery_date: { [Op.lt]: today },
          status: { [Op.notIn]: completedStatuses }
        }
      })
    ]);

    res.json({
      activeOrders,
      dueThisWeek,
      completed: completedCount,
      urgentDelayed: delayed
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get dashboard stats' });
  }
};
