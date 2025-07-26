const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const roles = ['artist', 'collector', 'sponsor'];

roles.forEach((role) => {
  router.get(`/${role}`, authMiddleware(role), (req, res) => {
    res.json({ message: `Welcome, ${req.user.name} (${req.user.role})` });
  });
});

module.exports = router;
