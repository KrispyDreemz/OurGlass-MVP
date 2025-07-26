const prisma = require('../prismaClient');

const MIN_INCREMENT = 5;

async function placeBid(auctionId, userId, amount) {
  const auction = await prisma.ownershipAuction.findUnique({ where: { id: auctionId } });
  if (!auction) throw new Error('Auction not found');
  if (auction.status !== 'active' || new Date(auction.endsAt) <= new Date()) {
    throw new Error('Auction closed');
  }
  const minBid = (auction.currentBid || 0) + MIN_INCREMENT;
  if (amount < minBid) {
    throw new Error('Bid too low');
  }
  return prisma.ownershipAuction.update({
    where: { id: auctionId },
    data: { bidderId: userId, currentBid: amount }
  });
}

async function closeAuction(id) {
  const auction = await prisma.ownershipAuction.findUnique({ where: { id } });
  if (!auction) throw new Error('Auction not found');
  if (auction.status !== 'active') throw new Error('Not active');
  const updated = await prisma.ownershipAuction.update({
    where: { id },
    data: { status: 'ended' }
  });
  if (!auction.bidderId) return updated;
  await prisma.sale.create({
    data: {
      auctionId: id,
      buyerId: auction.bidderId,
      finalPrice: auction.currentBid
    }
  });
  const platformFee = auction.currentBid * 0.0628;
  const artistRoyalty = auction.currentBid * 0.0314;
  return { ...updated, platformFee, artistRoyalty };
}

module.exports = { placeBid, closeAuction };
