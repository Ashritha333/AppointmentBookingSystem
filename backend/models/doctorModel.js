const db = require('../config/db');

const DoctorModel = {
  findAll() {
    return db.prepare('SELECT * FROM doctors ORDER BY name').all();
  },
  findById(id) {
    return db.prepare('SELECT * FROM doctors WHERE id = ?').get(id);
  },
};

module.exports = DoctorModel;
