const Database = require('better-sqlite3');
const path = require('path');

const dbFile = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(__dirname, '..', '..', 'data', 'appointments.db');

const db = new Database(dbFile);
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    slot_minutes INTEGER NOT NULL DEFAULT 30
  );
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'BOOKED',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_slot
    ON appointments(doctor_id, date, time) WHERE status = 'BOOKED';
`);

const count = db.prepare('SELECT COUNT(*) AS c FROM doctors').get().c;
if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO doctors (name, specialty, start_time, end_time, slot_minutes) VALUES (?, ?, ?, ?, ?)'
  );
  insert.run('Dr. Ananya Rao', 'General Physician', '09:00', '13:00', 30);
  insert.run('Dr. Rahul Mehta', 'Dentist', '10:00', '14:00', 30);
  insert.run('Dr. Kavya Iyer', 'Dermatologist', '14:00', '17:00', 30);
}

module.exports = db;
