const request = require('supertest');
let app;
let server;
let agent;

beforeAll(() => {
  app = require('../server');
  server = app.listen(0);
  agent = request.agent(server);
});

afterAll(() => {
  server.close();
});

describe('auth flow', () => {

  it('registers a user', async () => {
    const res = await agent
      .post('/api/register')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });

  it('logs in and sets cookie', async () => {
    const res = await agent
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('accesses /api/me', async () => {
    const res = await agent.get('/api/me');
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });

  it('logs out', async () => {
    const res = await agent.post('/api/logout');
    expect(res.statusCode).toBe(200);
  });

  it('blocks access after logout', async () => {
    const res = await agent.get('/api/me');
    expect(res.statusCode).toBe(401);
  });
});
