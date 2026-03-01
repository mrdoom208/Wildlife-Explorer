const mongoose = require("mongoose");

const newsUpdateSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    fullContent: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

module.exports = mongoose.model("NewsUpdate", newsUpdateSchema);
