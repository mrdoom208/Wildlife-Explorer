const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  ip: String,
  country: String, // New field
  userAgent: String,
  page: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visitor", visitorSchema);
