const mongoose = require('mongoose');

let User = null;
let initialized = false;

async function initDb() {
  if (initialized && User) return User;

  const uri = process.env.MONGODB_URI;
  const memoryStore = global.__MEMORY_USERS || (global.__MEMORY_USERS = { users: {} });

  if (!uri) {
    // Fallback in-memory user model (for demo/dev only)
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
    initialized = true;
    return User;
  }

  try {
    if (!global.__MONGOOSE_CONN) {
      global.__MONGOOSE_CONN = await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'test' });
    }

    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String
    });

    User = mongoose.models.User || mongoose.model('User', userSchema);
    initialized = true;
    return User;
  } catch (err) {
    // On failure, fall back to memory store
    console.error('MongoDB init error, using memory store', err);
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
    initialized = true;
    return User;
  }
}

module.exports = initDb;
