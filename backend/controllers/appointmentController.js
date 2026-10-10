const AppointmentModel = require('../models/appointmentModel');
const DoctorModel = require('../models/doctorModel');
const { generateSlots, getAvailableSlots } = require('../utils/slotUtils');
const { isValidDate, isValidTime, isPastDate } = require('../utils/validators');

function bookAppointment(req, res, next) {
  try {
    const { doctorId, date, time, reason } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'doctorId, date and time are required' });
    }
    if (!isValidDate(date) || !isValidTime(time)) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }
    if (isPastDate(date)) {
      return res.status(400).json({ error: 'Cannot book an appointment in the past' });
    }
    const doctor = DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    const all = generateSlots(doctor.start_time, doctor.end_time, doctor.slot_minutes);
    if (!all.includes(time)) {
      return res.status(400).json({ error: 'Selected time is outside working hours' });
    }
    const free = getAvailableSlots(all, AppointmentModel.bookedTimes(doctor.id, date));
    if (!free.includes(time)) {
      return res.status(409).json({ error: 'This slot is already booked' });
    }
    const appointment = AppointmentModel.create({
      userId: req.user.id, doctorId: doctor.id, date, time, reason,
    });
    return res.status(201).json(appointment);
  } catch (err) {
    return next(err);
  }
}

function myAppointments(req, res, next) {
  try {
    return res.status(200).json(AppointmentModel.findByUser(req.user.id));
  } catch (err) {
    return next(err);
  }
}

function cancelAppointment(req, res, next) {
  try {
    const appointment = AppointmentModel.findById(req.params.id);
    if (!appointment || appointment.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (appointment.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Appointment is already cancelled' });
    }
    return res.status(200).json(AppointmentModel.cancel(appointment.id));
  } catch (err) {
    return next(err);
  }
}

module.exports = { bookAppointment, myAppointments, cancelAppointment };
