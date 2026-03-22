const { User } = require('../../models');

const ROLES = ['artisan', 'client', 'admin'];
const ALLOWED_UPDATE_FIELDS = ['name', 'email', 'role'];

function toSafeUser(user) {
  if (!user) return user;
  const u = user.get ? user.get({ plain: true }) : user;
  const { password, ...rest } = u;
  return rest;
}

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid user id' });
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(toSafeUser(user));
};

exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid user id' });
  const updates = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (updates.role !== undefined && !ROLES.includes(updates.role)) {
    return res.status(400).json({ message: 'Role must be "artisan", "client", or "admin"' });
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }
  const [affectedCount] = await User.update(updates, { where: { id } });
  if (affectedCount === 0) return res.status(404).json({ message: 'User not found' });
  const user = await User.findByPk(id);
  res.json({ message: 'User updated successfully', user: toSafeUser(user) });
};

exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid user id' });
  const deleted = await User.destroy({ where: { id } });
  if (deleted === 0) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted successfully' });
};
