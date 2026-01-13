const express = require('express');
const router = express.Router();
const { getAnimals, getAnimal, createAnimal, updateAnimal } = require('../controllers/animalsController');

router.get('/', getAnimals);
router.get('/:id', getAnimal);
router.post('/', createAnimal);
router.put('/:id', updateAnimal);

module.exports = router;
