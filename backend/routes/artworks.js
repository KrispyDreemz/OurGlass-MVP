const express = require('express');
const prisma = require('../prismaClient');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// Submit new artwork
router.post('/', requireAuth, async (req, res) => {
  const { title, description, price_estimate, image_url } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  try {
    const artwork = await prisma.galleryArtwork.create({
      data: {
        title,
        description,
        priceEstimate: price_estimate,
        imageUrl: image_url,
        userId: req.user.id,
      },
    });
    res.json(artwork);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed' });
  }
});

// Public gallery - approved only
router.get('/', async (req, res) => {
  const artworks = await prisma.galleryArtwork.findMany({
    where: { status: 'approved' },
  });
  res.json(artworks);
});

// Current user's artworks
router.get('/mine', requireAuth, async (req, res) => {
  const artworks = await prisma.galleryArtwork.findMany({
    where: { userId: req.user.id },
  });
  res.json(artworks);
});

// Pending artworks for admin
router.get('/pending', requireAuth, requireAdmin, async (req, res) => {
  const artworks = await prisma.galleryArtwork.findMany({
    where: { status: 'pending' },
  });
  res.json(artworks);
});

// Admin status update
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const artwork = await prisma.galleryArtwork.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status },
    });
    res.json(artwork);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
