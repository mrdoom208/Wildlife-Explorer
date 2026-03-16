const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  subscribedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "unsubscribed"], default: "active" },
});

module.exports = mongoose.model("Subscriber", newsletterSchema);
