require("dotenv").config();
const mongoose = require("mongoose");
const MapIcon = require("../models/MapIcon"); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI;

const seedMapIcons = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await MapIcon.deleteMany({});
    console.log("Existing MapIcons cleared");

    const icons = [
      {
        name: "Terrestrial",
        type: "terrestrial",
        color: "orange",
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        description: "🏞️ Terrestrial areas",
      },
      {
        name: "Marine",
        type: "marine",
        color: "blue",
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        description: "🌊 Marine areas",
      },
      {
        name: "Freshwater",
        type: "freshwater",
        color: "violet",
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
        description: "🏞️ Freshwater areas",
      },
    ];

    await MapIcon.insertMany(icons);
    console.log("MapIcons seeded successfully!");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding MapIcons:", error);
    await mongoose.disconnect();
  }
};

seedMapIcons();
