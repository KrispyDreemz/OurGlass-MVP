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
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
