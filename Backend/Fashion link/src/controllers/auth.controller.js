const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

// SECRET used for signing JWTs is loaded from environment variables.
const JWT_SECRET = process.env.JWT_SECRET;

const ROLES = ['artisan', 'client', 'admin'];

function toSafeUser(user) {
  if (!user) return null;
  const u = user.get ? user.get({ plain: true }) : user;
  const { password, ...rest } = u;
  return rest;
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!role || !ROLES.includes(role)) {
      return res.status(400).json({ message: 'Role must be "artisan", "client", or "admin"' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
