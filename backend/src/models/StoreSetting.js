const mongoose = require("mongoose");

const storeSettingSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "/logo.png",
    },
  },
  {
    timestamps: true,
  },
);

const StoreSetting = mongoose.model(
  "StoreSetting",
  storeSettingSchema,
);

module.exports = StoreSetting;