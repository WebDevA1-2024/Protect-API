const express = require('express');
const mongoose = require('mongoose');

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

// Endpoint untuk mendapatkan semua user
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Endpoint untuk membuat user baru
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

app.listen(3000, () => console.log('API Terbuka berjalan pada port 3000'));
