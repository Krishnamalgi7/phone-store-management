const StoreSetting = require("../models/StoreSetting");

const getStoreSetting = async (req, res) => {
  try {
    let setting = await StoreSetting.findOne();

    if (!setting) {
      setting = await StoreSetting.create({
        brandName: "Nova",
        logo: "/logo.png",
      });
    }

    res.status(200).json(setting);
  } catch (error) {
    console.error("Get store setting error:", error);

    res.status(500).json({
      message: "Failed to fetch store settings",
    });
  }
};

const updateStoreSetting = async (req, res) => {
  try {
    const { brandName } = req.body;

    if (!brandName || !brandName.trim()) {
      return res.status(400).json({
        message: "Brand name is required",
      });
    }

    let setting = await StoreSetting.findOne();

    if (!setting) {
      setting = new StoreSetting();
    }

    setting.brandName = brandName.trim();

    if (req.file) {
      setting.logo = `/uploads/${req.file.filename}`;
    }

    await setting.save();

    res.status(200).json({
      message: "Store branding updated successfully",
      setting,
    });
  } catch (error) {
    console.error("Update store setting error:", error);

    res.status(500).json({
      message: "Failed to update store branding",
    });
  }
};

module.exports = {
  getStoreSetting,
  updateStoreSetting,
};