const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

    isNewPhone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Phone = mongoose.model("Phone", phoneSchema);

module.exports = Phone;
