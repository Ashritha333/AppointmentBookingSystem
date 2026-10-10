const db = require('../config/db');

const AppointmentModel = {
  create({ userId, doctorId, date, time, reason }) {
    const info = db
      .prepare(
        'INSERT INTO appointments (user_id, doctor_id, date, time, reason) VALUES (?, ?, ?, ?, ?)'
      )
      .run(userId, doctorId, date, time, reason || '');
    return this.findById(info.lastInsertRowid);
  },
  findById(id) {
    return db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
  },
  findByUser(userId) {
    return db
      .prepare(
        `SELECT a.*, d.name AS doctor_name, d.specialty
         FROM appointments a JOIN doctors d ON d.id = a.doctor_id
         WHERE a.user_id = ? ORDER BY a.date, a.time`
      )
      .all(userId);
  },
  bookedTimes(doctorId, date) {
    return db
      .prepare(
        "SELECT time FROM appointments WHERE doctor_id = ? AND date = ? AND status = 'BOOKED'"
      )
      .all(doctorId, date)
      .map((row) => row.time);
  },
  cancel(id) {
    db.prepare("UPDATE appointments SET status = 'CANCELLED' WHERE id = ?").run(id);
    return this.findById(id);
  },
};

module.exports = AppointmentModel;
