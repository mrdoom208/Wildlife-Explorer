const express = require("express");
const router = express.Router();
const animalController = require("../controllers/animalsController");
const { adminAuth, auth } = require("../middleware/auth");

router.post("/", adminAuth, auth, animalController.createAnimal);
router.put("/:id", adminAuth, auth, animalController.updateAnimal);
router.delete("/:id", adminAuth, auth, animalController.deleteAnimal);
module.exports = router;
