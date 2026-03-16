const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: String,
  category: { type: String, enum: ['mammals', 'birds', 'reptiles', 'amphibians', 'fish','invertebrates'], required: true },
  image: { type: String, required: true },
  facts: String,
  habitat: { type: String, required: true },
  diet: { type: String, enum: ['carnivore', 'herbivore', 'omnivore','insectivore','filter feeder'], required: true },
  description: { type: String, required: true },
  conservationStatus: { type: String, enum: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'], default: 'LC' },
  population: Number,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
