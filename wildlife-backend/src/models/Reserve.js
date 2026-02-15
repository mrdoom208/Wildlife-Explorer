const mongoose = require("mongoose");

const wildlifeReserveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    type: {
      type: String,
      enum: ["terrestrial", "marine", "freshwater"],
      required: true,
    },

    animalId: { type: Number },

    animals: [{ type: String }],

    description: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reserve", wildlifeReserveSchema);
