// controllers/authController.js
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = user.generateToken();
  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role }
  });
};

exports.createAdmin = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = new User({ email, password, name, role: 'admin' });
  await user.save();

  const token = user.generateToken();
  res.status(201).json({
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role }
  });
};
