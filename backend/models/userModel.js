const db = require('../config/db');

const UserModel = {
  create(name, email, passwordHash) {
    const info = db
      .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
      .run(name, email, passwordHash);
    return { id: info.lastInsertRowid, name, email };
  },
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
};

module.exports = UserModel;
