const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Simple User model fallback: if MONGODB_URI set, use mongoose, else use in-memory store
let User;
const memoryStore = { users: {} };

async function initDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('MONGODB_URI not set — using in-memory user store (not for production)');
    // lightweight model interface backed by memoryStore
    User = {
      async findOne(query) {
        const email = query.email && query.email.toLowerCase();
        return memoryStore.users[email] || null;
      },
      async create(obj) {
        const email = obj.email.toLowerCase();
        memoryStore.users[email] = obj;
        return memoryStore.users[email];
      }
    };
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'test' });
    console.log('Connected to MongoDB');
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String
    });
    User = mongoose.model('User', userSchema);
  } catch (err) {
    console.error('MongoDB connection error, falling back to memory store', err);
    User = {
      async findOne(query) {
        const email = query.email && query.email.toLowerCase();
        return memoryStore.users[email] || null;
      },
      async create(obj) {
        const email = obj.email.toLowerCase();
        memoryStore.users[email] = obj;
        return memoryStore.users[email];
      }
    };
  }
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    // NOTE: passwords stored in plain text in this demo — for production, hash with bcrypt
    const created = await User.create({ name, email: email.toLowerCase(), password });
    return res.status(201).json({ message: 'User created', user: { name: created.name, email: created.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    return res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
