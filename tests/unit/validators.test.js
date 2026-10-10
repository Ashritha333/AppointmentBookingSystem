const {
  isValidEmail, isValidPassword, isValidDate, isValidTime, isPastDate,
} = require('../../backend/utils/validators');

describe('Input validation functions', () => {
  test('TC-01: rejects an invalid email format', () => {
    expect(isValidEmail('shreya.gmail.com')).toBe(false);
    expect(isValidEmail('vedika@')).toBe(false);
    expect(isValidEmail('shreya@example.com')).toBe(true);
  });

  test('rejects passwords shorter than 6 characters', () => {
    expect(isValidPassword('123')).toBe(false);
    expect(isValidPassword('secret12')).toBe(true);
  });

  test('accepts only real calendar dates in YYYY-MM-DD format', () => {
    expect(isValidDate('2026-11-20')).toBe(true);
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('20-11-2026')).toBe(false);
  });

  test('accepts only 24-hour HH:MM time values', () => {
    expect(isValidTime('09:30')).toBe(true);
    expect(isValidTime('25:00')).toBe(false);
  });

  test('detects a date in the past', () => {
    const today = new Date('2026-10-11T10:00:00Z');
    expect(isPastDate('2026-10-10', today)).toBe(true);
    expect(isPastDate('2026-10-11', today)).toBe(false);
  });
});
