const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // ensure at least one user exists
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { email: 'user@example.com', passwordHash: 'hash' } });
  }
  const entries = [
    { title: 'Sunset', description: 'Sunset description', priceEstimate: 100, imageUrl: 'https://example.com/1.jpg', status: 'approved' },
    { title: 'Portrait', description: 'Portrait description', priceEstimate: 200, imageUrl: 'https://example.com/2.jpg', status: 'pending' },
    { title: 'Landscape', description: 'Landscape description', priceEstimate: 150, imageUrl: 'https://example.com/3.jpg', status: 'rejected' },
    { title: 'Abstract', description: 'Abstract description', priceEstimate: 120, imageUrl: 'https://example.com/4.jpg', status: 'approved' },
    { title: 'Still Life', description: 'Still Life description', priceEstimate: 80, imageUrl: 'https://example.com/5.jpg', status: 'pending' },
  ];
  for (const data of entries) {
    await prisma.galleryArtwork.create({ data: { ...data, userId: user.id } });
  }

  const bidder = await prisma.user.upsert({
    where: { email: 'bidder@example.com' },
    update: {},
    create: { email: 'bidder@example.com', passwordHash: 'hash' }
  });

  const artworks = await prisma.galleryArtwork.findMany({ take: 5 });
  for (let i = 0; i < artworks.length; i++) {
    await prisma.sponsorshipAuction.create({
      data: {
        artworkId: artworks[i].id,
        userId: bidder.id,
        bidAmount: (i + 1) * 10,
        endsAt: new Date(Date.now() + (i + 1) * 3600000)
      }
    });
  }

  const finished = await prisma.sponsorshipAuction.findMany({ take: 2 });
  for (let i = 0; i < finished.length; i++) {
    await prisma.sponsorshipAuction.update({
      where: { id: finished[i].id },
      data: { status: 'winner_selected' }
    });
    await prisma.ownershipAuction.create({
      data: {
        artworkId: finished[i].artworkId,
        endsAt: new Date(Date.now() + (i + 1) * 7200000),
        status: 'active'
      }
    });
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
