const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function isValidDate(date) {
  if (typeof date !== 'string' || !DATE_REGEX.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
}

function isValidTime(time) {
  return typeof time === 'string' && TIME_REGEX.test(time);
}

function isPastDate(date, today = new Date()) {
  const todayStr = today.toISOString().slice(0, 10);
  return date < todayStr;
}

module.exports = { isValidEmail, isValidPassword, isValidDate, isValidTime, isPastDate };
