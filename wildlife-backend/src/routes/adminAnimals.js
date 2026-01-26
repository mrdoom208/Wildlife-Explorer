const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalsController');
const { adminAuth } = require('../middleware/auth');

router.post('/', animalController.createAnimal);
router.put('/:id', animalController.updateAnimal);
router.delete('/:id', animalController.deleteAnimal);

module.exports = router;
