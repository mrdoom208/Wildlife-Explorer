// routes/auth.js (or add to your existing auth routes file)
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust path to your User model
const { auth, adminAuth } = require("../middleware/auth");
const {
  register,
  getAdminUsers,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/usersController");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public

router.post("/register", register);

// GET ADMIN USERS (Admin only - more details)
router.get("/", auth, adminAuth, getAdminUsers);

router.delete("/:id", auth, adminAuth, deleteUser);
router.post("/add", auth, adminAuth, createUser);
router.put("/:id", auth, adminAuth, updateUser);

module.exports = router;
