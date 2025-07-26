const request = require('supertest');
const prisma = require('../prismaClient');
let app, server, adminAgent, userA, userB;

beforeAll(async () => {
  app = require('../server');
  server = app.listen(0);
  adminAgent = request.agent(server);
  userA = request.agent(server);
  userB = request.agent(server);

  await adminAgent.post('/api/register').send({ email: 'admin2@example.com', password: 'password123' });
  await prisma.user.update({ where: { email: 'admin2@example.com' }, data: { role: 'admin' } });
  await adminAgent.post('/api/login').send({ email: 'admin2@example.com', password: 'password123' });

  await userA.post('/api/register').send({ email: 'a@example.com', password: 'password123' });
  await userA.post('/api/login').send({ email: 'a@example.com', password: 'password123' });

  await userB.post('/api/register').send({ email: 'b@example.com', password: 'password123' });
  await userB.post('/api/login').send({ email: 'b@example.com', password: 'password123' });
});

afterAll(async () => {
  server.close();
  await prisma.$disconnect();
});

test('bidding flow and closure', async () => {
  const art = await prisma.galleryArtwork.create({ data: { userId: (await prisma.user.findFirst({ where: { email: 'a@example.com' } })).id, title: 'Pic', status: 'approved' } });
  const resCreate = await adminAgent
    .post('/api/auctions/sponsorship')
    .send({ artwork_id: art.id, ends_at: new Date(Date.now() + 3600000).toISOString() });
  expect(resCreate.statusCode).toBe(200);
  const auctionId = resCreate.body.id;

  let bidRes = await userA.post(`/api/auctions/sponsorship/${auctionId}/bid`).send({ amount: 10 });
  expect(bidRes.statusCode).toBe(200);

  bidRes = await userB.post(`/api/auctions/sponsorship/${auctionId}/bid`).send({ amount: 5 });
  expect(bidRes.statusCode).toBe(400);

  bidRes = await userB.post(`/api/auctions/sponsorship/${auctionId}/bid`).send({ amount: 20 });
  expect(bidRes.statusCode).toBe(200);

  const closeRes = await adminAgent.post(`/api/auctions/sponsorship/${auctionId}/close`);
  expect(closeRes.statusCode).toBe(200);
  expect(closeRes.body.status).toBe('winner_selected');
  expect(closeRes.body.userId).toBe((await prisma.user.findUnique({ where: { email: 'b@example.com' } })).id);
});
