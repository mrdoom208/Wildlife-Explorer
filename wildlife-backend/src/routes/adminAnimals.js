const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Animal = require('../models/Animal');

// All admin routes protected
router.use(auth, adminAuth);

router.get('/', async (req, res) => {
  const animals = await Animal.find().sort({ createdAt: -1 });
  res.json(animals);
});

router.post('/', async (req, res) => {
  try {
    const animal = new Animal(req.body);
    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(animal);
});

router.delete('/:id', async (req, res) => {
  await Animal.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
