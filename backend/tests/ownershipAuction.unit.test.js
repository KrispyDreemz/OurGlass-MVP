const prisma = require('../prismaClient');
const { placeBid, closeAuction } = require('../services/ownershipAuction');

let auction, bidder;

beforeAll(async () => {
  const artist = await prisma.user.create({ data: { email: 'ownerunit@example.com', passwordHash: 'hash' } });
  const art = await prisma.galleryArtwork.create({ data: { userId: artist.id, title: 'Art', status: 'approved' } });
  await prisma.sponsorshipAuction.create({ data: { artworkId: art.id, status: 'winner_selected', endsAt: new Date() } });
  auction = await prisma.ownershipAuction.create({ data: { artworkId: art.id, endsAt: new Date(Date.now() + 3600000), status: 'active' } });
  bidder = await prisma.user.create({ data: { email: 'bidderunit@example.com', passwordHash: 'hash' } });
});

afterAll(() => prisma.$disconnect());

test('bidding increment validation', async () => {
  const res = await placeBid(auction.id, bidder.id, 10);
  expect(res.currentBid).toBe(10);
  await expect(placeBid(auction.id, bidder.id, 12)).rejects.toThrow('Bid too low');
});

test('closing auction creates sale', async () => {
  await placeBid(auction.id, bidder.id, 20);
  const closed = await closeAuction(auction.id);
  expect(closed.status).toBe('ended');
  const sale = await prisma.sale.findFirst({ where: { auctionId: auction.id } });
  expect(sale.finalPrice).toBe(20);
});
