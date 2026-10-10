const { generateSlots, getAvailableSlots } = require('../../backend/utils/slotUtils');

describe('Slot calculation (core business logic)', () => {
  test('TC-02: splits working hours into 30-minute slots', () => {
    expect(generateSlots('09:00', '11:00', 30)).toEqual(['09:00', '09:30', '10:00', '10:30']);
  });

  test('does not create a slot that runs past closing time', () => {
    expect(generateSlots('09:00', '10:15', 30)).toEqual(['09:00', '09:30']);
  });

  test('throws an error for a zero-minute slot length', () => {
    expect(() => generateSlots('09:00', '10:00', 0)).toThrow('Slot length must be greater than zero');
  });

  test('TC-03: removes booked times from the available list', () => {
    const all = ['09:00', '09:30', '10:00', '10:30'];
    expect(getAvailableSlots(all, ['09:30', '10:30'])).toEqual(['09:00', '10:00']);
  });
});
