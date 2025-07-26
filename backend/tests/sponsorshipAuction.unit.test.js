const prisma = require('../prismaClient');
const { placeBid, closeAuction } = require('../services/sponsorshipAuction');

let auction, user1, user2;

beforeAll(async () => {
  user1 = await prisma.user.create({ data: { email: 'unit1@example.com', passwordHash: 'hash' } });
  user2 = await prisma.user.create({ data: { email: 'unit2@example.com', passwordHash: 'hash' } });
  const art = await prisma.galleryArtwork.create({ data: { userId: user1.id, title: 'Art', status: 'approved' } });
  auction = await prisma.sponsorshipAuction.create({ data: { artworkId: art.id, endsAt: new Date(Date.now() + 3600000) } });
});

afterAll(() => prisma.$disconnect());

test('bidding logic', async () => {
  const res = await placeBid(auction.id, user2.id, 50);
  expect(res.bidAmount).toBe(50);
  expect(res.userId).toBe(user2.id);
  await expect(placeBid(auction.id, user1.id, 40)).rejects.toThrow('Bid too low');
});

test('auction closure', async () => {
  const closed = await closeAuction(auction.id);
  expect(closed.status).toBe('winner_selected');
});
