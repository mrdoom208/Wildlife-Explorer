const Animal = require('../models/Animal');
const { adminAuth } = require('../middleware/auth'); // ✅ Added

// DELETE - ✅ Already good
exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json({ message: 'Animal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL - ✅ Already good  
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
      pagination: { current: page, pages: Math.ceil(total / limit), total }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE - ✅ Already good
exports.getAnimal = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id).lean();
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 CREATE - Updated for Cloudinary URL
exports.createAnimal = async (req, res) => {
  try {
    const { image, ...animalData } = req.body; // 👈 JSON from frontend
    
    // ✅ Validate Cloudinary URL
    if (!image || !image.includes('cloudinary.com')) {
      return res.status(400).json({ error: 'Valid Cloudinary image URL required' });
    }

    const animal = new Animal({
      ...animalData,
      image // 👈 Direct Cloudinary URL
    });
    
    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🚀 UPDATE - Updated for Cloudinary URL  
exports.updateAnimal = async (req, res) => {
  try {
    const { image, ...animalData } = req.body; // 👈 JSON from frontend
    
    // Only update image if new one provided
    const updateData = { ...animalData };
    if (image && image.includes('cloudinary.com')) {
      updateData.image = image; // 👈 New Cloudinary URL
    }

    const animal = await Animal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
