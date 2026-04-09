const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
  author:    { type: String, required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prayer', prayerSchema);
