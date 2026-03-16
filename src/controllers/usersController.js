// routes/auth.js (or add to your existing auth routes file)
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust path to your User model
const { auth, adminAuth } = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
exports.register = async (req, res) => {
  const { email, password, name, role, status } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user (password auto-hashed by pre-save middleware)
    const user = new User({
      email,
      password,
      name: name || "",
      role: role || "user",
      status: status || "pending", // Default status
    });

    await user.save();

    // Generate token
    const token = user.generateToken();

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ADMIN USERS (Admin only - more details)
exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
exports.createUser = async (req, res) => {
  const { email, password, name, role, status } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Create new user (password auto-hashed by pre-save middleware)
    const user = new User({
      email,
      password,
      name: name || "",
      role: role || "user", // Default to 'user' role
      status: status || "pending", // Default status
    });
    await user.save();
    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { email, name, password, role, status } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields ONLY if they are provided and NOT empty
    if (email && email.trim() !== "") user.email = email;
    if (name && name.trim() !== "") user.name = name;
    if (role && role.trim() !== "") user.role = role;
    if (status && status.trim() !== "") user.status = status;

    // **PASSWORD LOGIC: Only update if password is provided AND not empty**
    if (password && password.trim() !== "") {
      user.password = password; // Hash it in your User model pre-save middleware
    }
    // If password is empty/blank/undefined → KEEP EXISTING PASSWORD ✅

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      status: user.status,
      // Don't return password for security
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
