function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toTime(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/** Split a doctor's working hours into equal time slots. */
function generateSlots(startTime, endTime, slotMinutes) {
  if (slotMinutes <= 0) {
    throw new Error('Slot length must be greater than zero');
  }
  const slots = [];
  const end = toMinutes(endTime);
  for (let t = toMinutes(startTime); t + slotMinutes <= end; t += slotMinutes) {
    slots.push(toTime(t));
  }
  return slots;
}

/** Return the slots that are not already booked. */
function getAvailableSlots(allSlots, bookedTimes) {
  const booked = new Set(bookedTimes);
  return allSlots.filter((slot) => !booked.has(slot));
}

module.exports = { toMinutes, toTime, generateSlots, getAvailableSlots };
