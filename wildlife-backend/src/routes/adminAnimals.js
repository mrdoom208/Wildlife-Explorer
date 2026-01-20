const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalsController');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
console.log(fs.existsSync('../controllers/animalsController.js'));
// Set up storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // save images in backend/public/images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/animals', adminAuth, upload.single('image'), animalController.createAnimal);
router.put('/animals/:id', adminAuth, upload.single('image'), animalController.updateAnimal);
router.get('/animals', adminAuth, animalController.getAnimals);
router.get('/animals/:id', adminAuth, animalController.getAnimal);
router.delete('/animals/:id', adminAuth, animalController.deleteAnimal);

module.exports = router;
