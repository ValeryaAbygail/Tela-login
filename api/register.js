const initDb = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const User = await initDb();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const created = await User.create({ name, email: email.toLowerCase(), password });
    return res.status(201).json({ message: 'User created', user: { name: created.name, email: created.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
