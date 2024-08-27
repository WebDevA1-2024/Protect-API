const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/API-Protect').then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Model User
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  role: String
}));

// Middleware otentikasi
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Not authorized');
  }
};

// Endpoint untuk login dan mendapatkan token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
  res.send({ token });
});

// Endpoint yang dilindungi oleh otentikasi
app.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  const users = await User.find();
  res.send(users);
});

app.listen(3001, () => console.log('API Terlindungi berjalan pada port 3001'));
