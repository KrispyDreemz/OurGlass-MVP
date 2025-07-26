const express = require('express');
const prisma = require('../prismaClient');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const { placeBid, closeAuction } = require('../services/sponsorshipAuction');

const router = express.Router();

// Create new sponsorship auction
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { artwork_id, ends_at } = req.body;
  if (!artwork_id || !ends_at) {
    return res.status(400).json({ error: 'artwork_id and ends_at required' });
  }
  const existing = await prisma.sponsorshipAuction.findFirst({
    where: { artworkId: parseInt(artwork_id, 10), status: 'open' }
  });
  if (existing) return res.status(400).json({ error: 'Auction already exists' });
  try {
    const auction = await prisma.sponsorshipAuction.create({
      data: {
        artworkId: parseInt(artwork_id, 10),
        endsAt: new Date(ends_at)
      }
    });
    res.json(auction);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed' });
  }
});

// Place bid
router.post('/:id/bid', requireAuth, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'amount required' });
  try {
    const auction = await placeBid(req.params.id, req.user.id, parseFloat(amount));
    res.json(auction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get auction details
router.get('/:id', async (req, res) => {
  const auction = await prisma.sponsorshipAuction.findUnique({
    where: { id: req.params.id },
    include: { artwork: true, user: true }
  });
  if (!auction) return res.status(404).json({ error: 'Not found' });
  res.json(auction);
});

// Close auction
router.post('/:id/close', requireAuth, requireAdmin, async (req, res) => {
  try {
    const auction = await closeAuction(req.params.id);
    res.json(auction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// list mine
router.get('/', async (req, res) => {
  const auctions = await prisma.sponsorshipAuction.findMany({ include: { artwork: true } });
  res.json(auctions);
});

router.get('/mine', requireAuth, async (req, res) => {
  const auctions = await prisma.sponsorshipAuction.findMany({
    where: { userId: req.user.id },
    include: { artwork: true }
  });
  res.json(auctions);
});

module.exports = router;
