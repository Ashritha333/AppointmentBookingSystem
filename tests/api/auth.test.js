const request = require('supertest');
const app = require('../../backend/app');

describe('Auth API', () => {
  const user = { name: 'Shreya Arun', email: 'shreya@example.com', password: 'secret123' };

  test('POST /api/auth/register creates a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(user.email);
  });

  test('POST /api/auth/register rejects a duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  test('TC-04: POST /api/auth/login returns a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login returns 401 for a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
});
