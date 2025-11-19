const initDb = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const User = await initDb();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    return res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
