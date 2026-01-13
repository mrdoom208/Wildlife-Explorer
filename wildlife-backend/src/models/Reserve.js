const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  category: { type: String, enum: ['mammals', 'birds', 'reptiles'], required: true },
  animals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }],
  description: { type: String, required: true },
  country: String,
  area: Number, // sq km
  visitors: Number,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reserve', reserveSchema);
// Geo index for nearby queries
reserveSchema.index({ coords: '2dsphere' });

