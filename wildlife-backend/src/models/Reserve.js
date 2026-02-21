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
      required: true,
      validate: {
        validator: async function (value) {
          const MapIcon = mongoose.model("MapIcon");
          const exists = await MapIcon.exists({ type: value });
          return !!exists;
        },
        message: (props) => `'${props.value}' is not a valid MapIcon type!`,
      },
    },
    animalId: { type: Number },

    animals: [{ type: String }],

    description: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reserve", wildlifeReserveSchema);
