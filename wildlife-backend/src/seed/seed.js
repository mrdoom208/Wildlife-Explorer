require("dotenv").config();
const mongoose = require("mongoose");
const WildlifeReserve = require("../models/Reserve"); // Make sure this is correct
const wildlifeReserves = require("./wildlifeReserves");

const mongoUri = process.env.MONGO_URI;

async function seed() {
  try {
    if (!mongoUri) {
      console.error("❌ MONGO_URI not set in .env");
      process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected`);

    // Check existing documents before delete
    const countBefore = await WildlifeReserve.countDocuments();
    console.log(`📂 Existing documents: ${countBefore}`);

    // Optional: clear existing data
    const deleteResult = await WildlifeReserve.deleteMany({});
    console.log(`🗑 Documents deleted: ${deleteResult.deletedCount}`);

    // Insert new data
    const insertResult = await WildlifeReserve.insertMany(wildlifeReserves, {
      ordered: true,
    });
    console.log(`🌱 Documents inserted: ${insertResult.length}`);

    // Verify insertion
    const countAfter = await WildlifeReserve.countDocuments();
    console.log(`✅ Total documents now: ${countAfter}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
