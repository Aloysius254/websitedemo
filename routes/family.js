const express = require('express');
const router  = express.Router();
const Prayer  = require('../models/Prayer');
const Message = require('../models/Message');
const { requireLogin } = require('../middleware/auth');

// GET /family — serve family page
router.get('/family', requireLogin, (req, res) => {
  res.sendFile('family.html', { root: './public' });
});

// ── Prayer Requests ──
router.get('/api/prayers', requireLogin, async (req, res) => {
  const prayers = await Prayer.find().sort({ createdAt: -1 });
  res.json(prayers);
});

router.post('/api/prayers', requireLogin, async (req, res) => {
  try {
    await Prayer.create({ author: req.session.userName, message: req.body.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save prayer request' });
  }
});

// ── Message Board ──
router.get('/api/messages', requireLogin, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
  res.json(messages);
});

router.post('/api/messages', requireLogin, async (req, res) => {
  try {
    await Message.create({ author: req.session.userName, text: req.body.text });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// ── Session user info for frontend ──
router.get('/api/me', requireLogin, (req, res) => {
  res.json({ name: req.session.userName });
});

module.exports = router;
