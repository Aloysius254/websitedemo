const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// GET /login
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public' });
});

// GET /register
router.get('/register', (req, res) => {
  res.sendFile('register.html', { root: './public' });
});

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.redirect('/register?error=Email+already+registered');
    await User.create({ name, email, password });
    res.redirect('/login?success=Account+created!+Please+login');
  } catch (err) {
    console.error(err);
    res.redirect('/register?error=Something+went+wrong');
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.redirect('/login?error=Invalid+credentials');
    const match = await user.comparePassword(password);
    if (!match) return res.redirect('/login?error=Invalid+credentials');
    req.session.userId = user._id;
    req.session.userName = user.name;
    res.redirect('/family');
  } catch (err) {
    console.error(err);
    res.redirect('/login?error=Something+went+wrong');
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
