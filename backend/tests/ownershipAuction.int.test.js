const request = require('supertest');
const prisma = require('../prismaClient');
let app, server, adminAgent, userAgent;

beforeAll(async () => {
  app = require('../server');
  server = app.listen(0);
  adminAgent = request.agent(server);
  userAgent = request.agent(server);

  await adminAgent.post('/api/register').send({ email: 'admin3@example.com', password: 'password123' });
  await prisma.user.update({ where: { email: 'admin3@example.com' }, data: { role: 'admin' } });
  await adminAgent.post('/api/login').send({ email: 'admin3@example.com', password: 'password123' });

  await userAgent.post('/api/register').send({ email: 'collector@example.com', password: 'password123' });
  await userAgent.post('/api/login').send({ email: 'collector@example.com', password: 'password123' });
});

afterAll(async () => {
  server.close();
  await prisma.$disconnect();
});

test('api security and flow', async () => {
  const art = await prisma.galleryArtwork.create({ data: { userId: (await prisma.user.findFirst()).id, title: 'Piece', status: 'approved' } });
  await prisma.sponsorshipAuction.create({ data: { artworkId: art.id, status: 'winner_selected', endsAt: new Date() } });
  const createRes = await adminAgent.post('/api/auctions/ownership').send({ artwork_id: art.id, ends_at: new Date(Date.now()+3600000).toISOString() });
  expect(createRes.statusCode).toBe(200);
  const id = createRes.body.id;

  // unauthenticated bid blocked
  let res = await request(app).post(`/api/auctions/ownership/${id}/bid`).send({ amount: 10 });
  expect(res.statusCode).toBe(401);

  // valid bid
  res = await userAgent.post(`/api/auctions/ownership/${id}/bid`).send({ amount: 10 });
  expect(res.statusCode).toBe(200);

  // admin close
  res = await adminAgent.post(`/api/auctions/ownership/${id}/close`);
  expect(res.statusCode).toBe(200);
  const sale = await prisma.sale.findFirst({ where: { auctionId: id } });
  expect(sale).toBeTruthy();
});
