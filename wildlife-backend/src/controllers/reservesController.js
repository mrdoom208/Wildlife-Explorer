const Reserve = require('../models/Reserve');
const mongoose = require('mongoose');

// Get all reserves with filters
exports.getReserves = async (req, res) => {
  try {
    const { category, country, featured, limit = 20, page = 1 } = req.query;
    const query = {};

    if (category && category !== 'all') query.category = category;
    if (country) query.country = { $regex: country, $options: 'i' };
    if (featured === 'true') query.featured = true;

    const reserves = await Reserve.find(query)
      .populate('animals', 'name image category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ featured: -1, createdAt: -1 });

    const total = await Reserve.countDocuments(query);

    res.json({
      reserves,
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

// Get single reserve by ID
exports.getReserve = async (req, res) => {
  try {
    const reserve = await Reserve.findById(req.params.id)
      .populate('animals', 'name image category facts')
      .lean();
    
    if (!reserve) {
      return res.status(404).json({ error: 'Reserve not found' });
    }
    
    // Convert coords for frontend
    const reserveData = {
      ...reserve,
      lat: reserve.coords.coordinates[1],
      lng: reserve.coords.coordinates[0]
    };
    
    res.json(reserveData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get nearby reserves (geo query)
exports.getNearbyReserves = async (req, res) => {
  try {
    const { lat, lng, radius = 1000 } = req.query; // radius in km
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng parameters required' });
    }

    const reserves = await Reserve.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'dist.calculated',
          maxDistance: parseInt(radius) * 1000,
          spherical: true
        }
      },
      { $limit: 10 },
      {
        $lookup: {
          from: 'animals',
          localField: 'animals',
          foreignField: '_id',
          as: 'animals'
        }
      },
      {
        $project: {
          'dist.calculated': 0
        }
      }
    ]);

    res.json({ reserves, count: reserves.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new reserve (admin)
exports.createReserve = async (req, res) => {
  try {
    const reserve = new Reserve({
      name: req.body.name,
      coords: {
        type: 'Point',
        coordinates: [req.body.lng, req.body.lat]
      },
      category: req.body.category,
      animals: req.body.animals || [],
      description: req.body.description,
      country: req.body.country,
      area: req.body.area,
      visitors: req.body.visitors || 0,
      featured: req.body.featured || false
    });
    
    await reserve.save();
    const populatedReserve = await Reserve.findById(reserve._id).populate('animals');
    
    res.status(201).json(populatedReserve);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update reserve (admin)
exports.updateReserve = async (req, res) => {
  try {
    const reserve = await Reserve.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        coords: {
          type: 'Point',
          coordinates: [req.body.lng, req.body.lat]
        },
        category: req.body.category,
        animals: req.body.animals || [],
        description: req.body.description,
        country: req.body.country,
        area: req.body.area,
        visitors: req.body.visitors,
        featured: req.body.featured
      },
      { new: true, runValidators: true }
    ).populate('animals');

    if (!reserve) {
      return res.status(404).json({ error: 'Reserve not found' });
    }
    res.json(reserve);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete reserve (admin)
exports.deleteReserve = async (req, res) => {
  try {
    const reserve = await Reserve.findByIdAndDelete(req.params.id);
    if (!reserve) {
      return res.status(404).json({ error: 'Reserve not found' });
    }
    res.json({ message: 'Reserve deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
