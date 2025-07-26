const request = require('supertest');
let app;

beforeAll(() => {
  app = require('../server');
});

describe('auth flow', () => {
  let token;

  it('registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'pass', role: 'artist' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Registered');
  });

  it('logs in and returns JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'pass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    token = res.body.token;
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    expect(payload.email).toBe('test@example.com');
    expect(payload.role).toBe('artist');
  });

  it('denies dashboard without token', async () => {
    const res = await request(app).get('/dashboard/artist');
    expect(res.statusCode).toBe(401);
  });

  it('allows dashboard with valid token', async () => {
    const res = await request(app)
      .get('/dashboard/artist')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Welcome');
  });
});
