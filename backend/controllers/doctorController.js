const DoctorModel = require('../models/doctorModel');
const AppointmentModel = require('../models/appointmentModel');
const { generateSlots, getAvailableSlots } = require('../utils/slotUtils');
const { isValidDate } = require('../utils/validators');

function listDoctors(req, res, next) {
  try {
    return res.status(200).json(DoctorModel.findAll());
  } catch (err) {
    return next(err);
  }
}

function getSlots(req, res, next) {
  try {
    const doctor = DoctorModel.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    const { date } = req.query;
    if (!isValidDate(date)) {
      return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format' });
    }
    const all = generateSlots(doctor.start_time, doctor.end_time, doctor.slot_minutes);
    const booked = AppointmentModel.bookedTimes(doctor.id, date);
    return res.status(200).json({ doctorId: doctor.id, date, available: getAvailableSlots(all, booked) });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listDoctors, getSlots };
