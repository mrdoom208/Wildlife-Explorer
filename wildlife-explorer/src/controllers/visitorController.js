// controllers/visitorController.js
const Visitor = require("../models/Visitor");
const geoip = require("geoip-lite");

// visitorController.js
exports.trackVisitor = async (req, res) => {
  try {
    const ip = req.ip;
    const existing = await Visitor.findOne({
      ip,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // last 1 min
    });
    if (existing) return res.status(200).json({ success: true });

    const visitor = new Visitor({ ip });
    await visitor.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log visitor" });
  }
};

exports.getTotalVisitors = async (req, res) => {
  try {
    const total = await Visitor.countDocuments();
    res.json({ totalVisitors: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getVisitorsByCountry = async (req, res) => {
  try {
    const counts = await Visitor.aggregate([
      { $group: { _id: "$country", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
