require("dotenv").config();

const mongoose = require("mongoose");

const Phone = require("../models/Phone");
const Brand = require("../models/Brand");
const Variant = require("../models/Variant");
const Ram = require("../models/Ram");
const Rom = require("../models/Rom");

const migratePhoneReferences = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");
    console.log("Starting phone reference migration...");

    const phones = await Phone.find().lean();

    console.log(`Found ${phones.length} phones`);

    for (const phone of phones) {
      const brand = await Brand.findOneAndUpdate(
        { name: phone.brand.trim() },
        {
          $setOnInsert: {
            name: phone.brand.trim(),
            isActive: true,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );

      const variant = await Variant.findOneAndUpdate(
        { name: phone.variant.trim() },
        {
          $setOnInsert: {
            name: phone.variant.trim(),
            isActive: true,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );

      const ram = await Ram.findOneAndUpdate(
        { value: phone.ram.trim() },
        {
          $setOnInsert: {
            value: phone.ram.trim(),
            isActive: true,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );

      const rom = await Rom.findOneAndUpdate(
        { value: phone.rom.trim() },
        {
          $setOnInsert: {
            value: phone.rom.trim(),
            isActive: true,
          },
        },
        {
          upsert: true,
          new: true,
        },
      );

      await Phone.collection.updateOne(
        { _id: phone._id },
        {
          $set: {
            brandId: brand._id,
            variantId: variant._id,
            ramId: ram._id,
            romId: rom._id,
          },
        },
      );

      console.log(`Migrated: ${phone.name}`);
    }

    console.log("");
    console.log("Migration completed successfully.");
    console.log("Old brand/variant/ram/rom fields were NOT removed.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
};

migratePhoneReferences();