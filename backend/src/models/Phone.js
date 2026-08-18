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

    image: {
      type: String,
      required: true,
    },

    isNewPhone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Phone = mongoose.model("Phone", phoneSchema);

module.exports = Phone;