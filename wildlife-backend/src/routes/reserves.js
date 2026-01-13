const express = require('express');
const router = express.Router();

// Reserves Controller (create this file next)
const {
  getReserves,
  getReserve,
  createReserve,
  updateReserve,
  deleteReserve,
  getNearbyReserves
} = require('../controllers/reservesController');

// GET /api/reserves - Get all reserves with filters
router.get('/', getReserves);

// GET /api/reserves/:id - Get single reserve
router.get('/:id', getReserve);

// GET /api/reserves/nearby?lat=20&lng=0&radius=1000 - Get nearby reserves
router.get('/nearby', getNearbyReserves);

// POST /api/reserves - Create new reserve (admin)
router.post('/', createReserve);

// PUT /api/reserves/:id - Update reserve (admin)
router.put('/:id', updateReserve);

// DELETE /api/reserves/:id - Delete reserve (admin)
router.delete('/:id', deleteReserve);

module.exports = router;
