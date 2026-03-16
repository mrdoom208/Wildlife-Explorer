// routes/wildlifeReserves.js
const express = require("express");
const router = express.Router();
const { adminAuth, auth } = require("../middleware/auth");
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
router.post("/", auth, adminAuth, createWildlifeReserve);
router.put("/:id", auth, adminAuth, updateWildlifeReserve);
router.delete("/:id", auth, adminAuth, deleteWildlifeReserve);

module.exports = router;
