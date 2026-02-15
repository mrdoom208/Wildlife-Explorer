const express = require("express");
const router = express.Router();
const {
  createMapIcon,
  getMapIcon,
  getMapIcons,
  updateMapIcon,
  deleteMapIcon,
} = require("../controllers/mapIconController");
const { adminAuth } = require("../middleware/auth");

// CREATE a new MapIcon (protected)
router.post("/", adminAuth, createMapIcon);

// GET all MapIcons (public)
router.get("/", getMapIcons);

// GET a single MapIcon by ID (public)
router.get("/:id", getMapIcon);

// UPDATE a MapIcon by ID (protected)
router.put("/:id", adminAuth, updateMapIcon);

// DELETE a MapIcon by ID (protected)
router.delete("/:id", adminAuth, deleteMapIcon);

module.exports = router;
