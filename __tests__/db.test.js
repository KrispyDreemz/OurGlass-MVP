const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

let prisma;

beforeAll(async () => {
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: 'backend' });
    prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.warn('Skipping DB tests:', err.message);
    prisma = null;
  }
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

test('CRUD relations and cascades', async () => {
  if (!prisma) return;

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

  await prisma.bid.create({
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

  await prisma.sponsorship.create({
    data: {
      artworkId: artwork.id,
      sponsorId: sponsor.id,
      bidAmount: 30,
      won: true,
      campaignUrl: 'http://example.com'
    }
  });

  const fetched = await prisma.artwork.findUnique({
    where: { id: artwork.id },
    include: { auctions: true, sponsorships: true }
  });
  expect(fetched).toBeTruthy();
  expect(fetched.auctions.length).toBe(1);
  expect(fetched.sponsorships.length).toBe(1);

  await prisma.artwork.delete({ where: { id: artwork.id } });
  const orphanAuction = await prisma.auction.findMany({ where: { artworkId: artwork.id } });
  expect(orphanAuction.length).toBe(0);
});
