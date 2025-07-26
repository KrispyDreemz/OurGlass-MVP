const prisma = require('../prismaClient');

async function placeBid(auctionId, userId, amount) {
  const auction = await prisma.sponsorshipAuction.findUnique({ where: { id: auctionId } });
  if (!auction) throw new Error('Auction not found');
  if (auction.status !== 'open' || new Date(auction.endsAt) <= new Date()) {
    throw new Error('Auction closed');
  }
  if (amount <= (auction.bidAmount || 0)) {
    throw new Error('Bid too low');
  }
  return prisma.sponsorshipAuction.update({
    where: { id: auctionId },
    data: { userId, bidAmount: amount }
  });
}

async function closeAuction(id) {
  const auction = await prisma.sponsorshipAuction.findUnique({ where: { id } });
  if (!auction) throw new Error('Auction not found');
  if (auction.status !== 'open') throw new Error('Not open');
  return prisma.sponsorshipAuction.update({
    where: { id },
    data: { status: 'winner_selected' }
  });
}

module.exports = { placeBid, closeAuction };
