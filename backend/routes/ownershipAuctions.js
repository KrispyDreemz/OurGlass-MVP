const express = require('express');
const prisma = require('../prismaClient');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const { placeBid, closeAuction } = require('../services/ownershipAuction');

const router = express.Router();

// Create new ownership auction
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { artwork_id, ends_at } = req.body;
  if (!artwork_id || !ends_at) {
    return res.status(400).json({ error: 'artwork_id and ends_at required' });
  }
  const artId = parseInt(artwork_id, 10);
  const sponsorship = await prisma.sponsorshipAuction.findFirst({
    where: { artworkId: artId, status: 'winner_selected' }
  });
  if (!sponsorship) return res.status(400).json({ error: 'Artwork not eligible' });
  try {
    const auction = await prisma.ownershipAuction.create({
      data: {
        artworkId: artId,
        endsAt: new Date(ends_at),
        status: 'active'
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

// Close auction
router.post('/:id/close', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await closeAuction(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// list all
router.get('/', async (req, res) => {
  const auctions = await prisma.ownershipAuction.findMany({ include: { artwork: true } });
  res.json(auctions);
});

router.get('/mine', requireAuth, async (req, res) => {
  const auctions = await prisma.ownershipAuction.findMany({
    where: { bidderId: req.user.id },
    include: { artwork: true }
  });
  res.json(auctions);
});

module.exports = router;
