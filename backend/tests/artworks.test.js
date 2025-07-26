const request = require('supertest');
const prisma = require('../prismaClient');
let app;
let server;
let agent;
let adminAgent;

beforeAll(async () => {
  app = require('../server');
  server = app.listen(0);
  agent = request.agent(server);
  adminAgent = request.agent(server);

  await agent.post('/api/register').send({ email: 'user1@example.com', password: 'password123' });
  await agent.post('/api/login').send({ email: 'user1@example.com', password: 'password123' });

  await adminAgent.post('/api/register').send({ email: 'admin@example.com', password: 'password123' });
  await prisma.user.update({ where: { email: 'admin@example.com' }, data: { role: 'admin' } });
  await adminAgent.post('/api/login').send({ email: 'admin@example.com', password: 'password123' });
});

afterAll(async () => {
  server.close();
  await prisma.$disconnect();
});

describe('artwork submission flow', () => {
  let artworkId;

  it('blocks unauthenticated submission', async () => {
    const res = await request(app).post('/api/artworks').send({ title: 'NoAuth' });
    expect(res.statusCode).toBe(401);
  });

  it('requires title', async () => {
    const res = await agent.post('/api/artworks').send({});
    expect(res.statusCode).toBe(400);
  });

  it('submits artwork', async () => {
    const res = await agent.post('/api/artworks').send({ title: 'My Art', description: 'desc' });
    expect(res.statusCode).toBe(200);
    artworkId = res.body.id;
    expect(res.body.status).toBe('pending');
  });

  it('non-admin cannot approve', async () => {
    const res = await agent.patch(`/api/artworks/${artworkId}/status`).send({ status: 'approved' });
    expect(res.statusCode).toBe(403);
  });

  it('admin approves artwork', async () => {
    const res = await adminAgent.patch(`/api/artworks/${artworkId}/status`).send({ status: 'approved' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('approved');
  });

  it('gallery shows approved only', async () => {
    await agent.post('/api/artworks').send({ title: 'Another', description: '' });
    const res = await request(app).get('/api/artworks');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1); // only the approved one
  });

  it('user can see their artworks', async () => {
    const res = await agent.get('/api/artworks/mine');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
