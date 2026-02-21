const express = require("express");
const router = express.Router();
const {
  createMapIcon,
  getMapIcon,
  getMapIcons,
  updateMapIcon,
  deleteMapIcon,
} = require("../controllers/MapIconController");
const { adminAuth, auth } = require("../middleware/auth");

// GET all MapIcons (public)
router.get("/", getMapIcons);

// GET a single MapIcon by ID (public)
router.get("/:id", getMapIcon);

// CREATE a new MapIcon (protected)
router.post("/", auth, adminAuth, createMapIcon);

// UPDATE a MapIcon by ID (protected)
router.put("/:id", auth, adminAuth, updateMapIcon);

// DELETE a MapIcon by ID (protected)
router.delete("/:id", auth, adminAuth, deleteMapIcon);

module.exports = router;
