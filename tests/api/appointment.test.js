const request = require('supertest');
const app = require('../../backend/app');

function futureDate(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

describe('Appointment API', () => {
  let token;
  const date = futureDate();

  beforeAll(async () => {
    const user = { name: 'Vedika Pande', email: 'vedika@example.com', password: 'secret123' };
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send(user);
    token = res.body.token;
  });

  test('TC-05: GET /api/doctors returns the list of doctors', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('TC-06: POST /api/appointments books a free slot', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: 1, date, time: '09:00', reason: 'Check-up' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('BOOKED');
  });

  test('TC-07: POST /api/appointments blocks double booking of the same slot', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: 1, date, time: '09:00' });
    expect(res.status).toBe(409);
  });

  test('TC-08: POST /api/appointments returns 400 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: 1 });
    expect(res.status).toBe(400);
  });

  test('TC-09: GET /api/appointments without a token returns 401', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(401);
  });

  test('GET /api/doctors/:id/slots hides the booked slot', async () => {
    const res = await request(app).get(`/api/doctors/1/slots?date=${date}`);
    expect(res.status).toBe(200);
    expect(res.body.available).not.toContain('09:00');
  });

  test('TC-10: PATCH /api/appointments/:id/cancel frees the slot again', async () => {
    const list = await request(app).get('/api/appointments').set('Authorization', `Bearer ${token}`);
    const id = list.body[0].id;
    const res = await request(app)
      .patch(`/api/appointments/${id}/cancel`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELLED');
    const slots = await request(app).get(`/api/doctors/1/slots?date=${date}`);
    expect(slots.body.available).toContain('09:00');
  });
});
