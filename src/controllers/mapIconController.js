const MapIcon = require("../models/MapIcon");
const { adminAuth } = require("../middleware/auth");

// CREATE a new MapIcon
exports.createMapIcon = async (req, res) => {
  try {
    const mapIcon = new MapIcon(req.body);
    await mapIcon.save();
    res.status(201).json(mapIcon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL MapIcons (with optional type/search/pagination)
exports.getMapIcons = async (req, res) => {
  try {
    const { type, search, limit = 20, page = 1 } = req.query;
    const query = {};

    if (type && type !== "all") query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const mapIcons = await MapIcon.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MapIcon.countDocuments(query);

    res.json({
      mapIcons,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE MapIcon by ID
exports.getMapIcon = async (req, res) => {
  try {
    const mapIcon = await MapIcon.findById(req.params.id).lean();
    if (!mapIcon) return res.status(404).json({ error: "Map icon not found" });
    res.json(mapIcon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE MapIcon
exports.updateMapIcon = async (req, res) => {
  try {
    const mapIcon = await MapIcon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mapIcon) return res.status(404).json({ error: "Map icon not found" });
    res.json(mapIcon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE MapIcon
exports.deleteMapIcon = async (req, res) => {
  try {
    const mapIcon = await MapIcon.findByIdAndDelete(req.params.id);
    if (!mapIcon) return res.status(404).json({ error: "Map icon not found" });
    res.json({ message: "Map icon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
