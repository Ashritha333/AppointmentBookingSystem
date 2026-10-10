const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { JWT_SECRET } = require('../middleware/auth');
const { isValidEmail, isValidPassword } = require('../utils/validators');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !isValidEmail(email) || !isValidPassword(password)) {
      return res
        .status(400)
        .json({ error: 'Name, a valid email and a password of at least 6 characters are required' });
    }
    if (UserModel.findByEmail(email)) {
      return res.status(409).json({ error: 'Email is already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = UserModel.create(name.trim(), email.trim(), hash);
    return res.status(201).json({ message: 'Registered successfully', user });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ error: 'Valid email and password are required' });
    }
    const user = UserModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '2h' });
    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };
