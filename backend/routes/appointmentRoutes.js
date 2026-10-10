const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  bookAppointment, myAppointments, cancelAppointment,
} = require('../controllers/appointmentController');

const router = express.Router();
router.use(requireAuth);
router.post('/', bookAppointment);
router.get('/', myAppointments);
router.patch('/:id/cancel', cancelAppointment);

module.exports = router;
