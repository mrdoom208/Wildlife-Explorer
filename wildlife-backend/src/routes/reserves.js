// routes/wildlifeReserves.js
const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const {
  getWildlifeReserves,
  getWildlifeReserve,
  createWildlifeReserve,
  updateWildlifeReserve,
  deleteWildlifeReserve,
} = require("../controllers/reserveController");

// Public routes (GET)
router.get("/", getWildlifeReserves);
router.get("/:id", getWildlifeReserve);

// Admin protected routes
router.post("/", adminAuth, createWildlifeReserve);
router.put("/:id", adminAuth, updateWildlifeReserve);
router.delete("/:id", adminAuth, deleteWildlifeReserve);

module.exports = router;
