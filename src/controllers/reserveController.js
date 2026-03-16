const WildlifeReserve = require("../models/Reserve");
const { adminAuth } = require("../middleware/auth");

// DELETE
exports.deleteWildlifeReserve = async (req, res) => {
  try {
    const reserve = await WildlifeReserve.findByIdAndDelete(req.params.id);
    if (!reserve)
      return res.status(404).json({ error: "Wildlife reserve not found" });
    res.json({ message: "Wildlife reserve deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
exports.getWildlifeReserves = async (req, res) => {
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

    const reserves = await WildlifeReserve.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await WildlifeReserve.countDocuments(query);

    res.json({
      reserves,
      pagination: { current: page, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE
exports.getWildlifeReserve = async (req, res) => {
  try {
    const reserve = await WildlifeReserve.findById(req.params.id).lean();
    if (!reserve)
      return res.status(404).json({ error: "Wildlife reserve not found" });
    res.json(reserve);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE
exports.createWildlifeReserve = async (req, res) => {
  try {
    const reserve = new WildlifeReserve(req.body);
    await reserve.save();
    res.status(201).json(reserve);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE
exports.updateWildlifeReserve = async (req, res) => {
  try {
    const reserve = await WildlifeReserve.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!reserve)
      return res.status(404).json({ error: "Wildlife reserve not found" });
    res.json(reserve);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
