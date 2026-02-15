const mongoose = require("mongoose");

// Define the schema for map icons
const mapIconSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Terrestrial", "Marine"
    type: {
      type: String,
      required: true,
      enum: ["terrestrial", "marine", "freshwater"], // predefined types
    },
    color: { type: String, required: true },
    iconUrl: { type: String, required: true }, // URL to the marker icon
    shadowUrl: {
      type: String,
      default:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    },
    iconSize: {
      type: [Number], // [width, height]
      default: [25, 41],
    },
    iconAnchor: {
      type: [Number], // [x, y]
      default: [12, 41],
    },
    popupAnchor: {
      type: [Number], // [x, y]
      default: [1, -34],
    },
    description: { type: String }, // optional description
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MapIcon", mapIconSchema);
