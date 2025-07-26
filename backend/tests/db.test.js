const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`; // connection test
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    throw err;
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('migrations apply and CRUD works', async () => {
  // create records
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'hash',
      role: 'artist'
    }
  });

  const artwork = await prisma.artwork.create({
    data: {
      artistId: user.id,
      title: 'Art',
      description: 'Desc',
      imageUrl: 'url',
      status: 'active'
    }
  });

  const auction = await prisma.auction.create({
    data: {
      artworkId: artwork.id,
      type: 'ownership',
      startTime: new Date(Date.now() - 1000),
      endTime: new Date(Date.now() + 1000),
      reservePrice: 10
    }
  });

  const bidder = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: 'hash',
      role: 'collector'
    }
  });

  const bid = await prisma.bid.create({
    data: {
      auctionId: auction.id,
      userId: bidder.id,
      amount: 20
    }
  });

  const sponsor = await prisma.user.create({
    data: {
      name: 'Sponsor',
      email: 'sponsor@example.com',
      passwordHash: 'hash',
      role: 'sponsor'
    }
  });

  const sponsorship = await prisma.sponsorship.create({
    data: {
      artworkId: artwork.id,
      sponsorId: sponsor.id,
      bidAmount: 30,
      won: true,
      campaignUrl: 'http://example.com'
    }
  });

  // verify queries
  const fetched = await prisma.artwork.findUnique({ where: { id: artwork.id }, include: { auctions: true, sponsorships: true } });
  expect(fetched).toBeTruthy();
  expect(fetched.auctions.length).toBe(1);
  expect(fetched.sponsorships.length).toBe(1);

  // cascade delete
  await prisma.artwork.delete({ where: { id: artwork.id } });
  const orphanAuction = await prisma.auction.findMany({ where: { artworkId: artwork.id } });
  expect(orphanAuction.length).toBe(0);
});
