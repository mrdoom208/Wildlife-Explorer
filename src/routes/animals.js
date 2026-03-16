const express = require('express');
const router = express.Router();
const { getAnimals, getAnimal, createAnimal, updateAnimal,deleteAnimal } = require('../controllers/animalsController');
const {auth,adminAuth} = require('../middleware/auth')
router.get('/', getAnimals);
router.get('/:id', getAnimal);
router.post('/',auth, adminAuth, createAnimal);
router.put('/:id',auth, adminAuth, updateAnimal);
router.delete("/:id", auth, adminAuth, deleteAnimal);

module.exports = router;
