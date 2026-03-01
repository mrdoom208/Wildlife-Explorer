const NewsUpdate = require("../models/newsUpdate");

// @desc    Create a new update
// @route   POST /api/news
// @access  Public (or Private if you add auth)
exports.createNewsUpdate = async (req, res) => {
  try {
    const newsUpdate = await NewsUpdate.create(req.body);
    res.status(201).json({
      success: true,
      data: newsUpdate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all updates
// @route   GET /api/news
// @access  Public
exports.getNewsUpdates = async (req, res) => {
  try {
    const newsUpdates = await NewsUpdate.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: newsUpdates.length,
      data: newsUpdates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single update by ID
// @route   GET /api/news/:id
// @access  Public
exports.getNewsUpdateById = async (req, res) => {
  try {
    const newsUpdate = await NewsUpdate.findById(req.params.id);

    if (!newsUpdate) {
      return res.status(404).json({
        success: false,
        message: "News update not found",
      });
    }

    res.status(200).json({
      success: true,
      data: newsUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid ID",
    });
  }
};

// @desc    Update news by ID
// @route   PUT /api/news/:id
// @access  Public (or Private)
exports.updateNewsUpdate = async (req, res) => {
  try {
    const newsUpdate = await NewsUpdate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!newsUpdate) {
      return res.status(404).json({
        success: false,
        message: "News update not found",
      });
    }

    res.status(200).json({
      success: true,
      data: newsUpdate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNewsUpdate = async (req, res) => {
  try {
    const newsUpdate = await NewsUpdate.findByIdAndDelete(req.params.id);

    if (!newsUpdate) {
      return res.status(404).json({
        success: false,
        message: "News update not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News update deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid ID",
    });
  }
};
