const prisma = require('./prismaClient');
const { closeAuction } = require('./services/sponsorshipAuction');

async function check() {
  const now = new Date();
  const auctions = await prisma.sponsorshipAuction.findMany({
    where: {
      status: 'open',
      endsAt: { lte: now }
    }
  });
  for (const auction of auctions) {
    try {
      await closeAuction(auction.id);
      console.log(`Closed auction ${auction.id}`);
    } catch (e) {
      console.error(e);
    }
  }
}

setInterval(check, 60 * 1000);
check();
