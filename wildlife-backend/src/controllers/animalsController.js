const Animal = require('../models/Animal');
// Add at top of file
const { adminAuth } = require('../middleware/auth');

// Update createAnimal and add to routes later
exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json({ message: 'Animal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all animals with filters
exports.getAnimals = async (req, res) => {
    
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    const query = {};
    
    if (category && category !== 'all') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const animals = await Animal.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Animal.countDocuments(query);

    res.json({
      animals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single animal
exports.getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).lean();
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create animal (admin)
exports.createAnimal = async (req, res) => {
  try {
    const animal = new Animal(req.body);
    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update animal (admin)
exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
