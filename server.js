require('dotenv').config();
const express      = require('express');
const mongoose     = require('mongoose');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const path         = require('path');

const app = express();

// ── Connect to MongoDB ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ── Middleware ──
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// ── Static files (images, css) ──
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ──
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/family'));

// ── Home ──
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
