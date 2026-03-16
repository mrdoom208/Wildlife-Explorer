const express = require("express");
const router = express.Router();
const animalController = require("../controllers/animalsController");
const { adminAuth, auth } = require("../middleware/auth");

router.post("/", auth, adminAuth, animalController.createAnimal);
router.put("/:id", auth, adminAuth, animalController.updateAnimal);
router.delete("/:id", auth, adminAuth, animalController.deleteAnimal);
module.exports = router;
