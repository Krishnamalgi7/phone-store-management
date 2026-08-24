const Phone = require("../models/Phone");
const PhoneSetting = require("../models/PhoneSetting");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

// Get phones with filtering and pagination
const getPhones = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = "",
      brand = "",
      variant = "",
      ram = "",
      rom = "",
      minPrice,
      maxPrice,
    } = req.query;

    // Convert and validate pagination values
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);

    const requestedLimit = parseInt(limit, 10) || 9;

    // Prevent very large requests
    const pageSize = Math.min(Math.max(requestedLimit, 1), 50);

    const skip = (currentPage - 1) * pageSize;

    // Build MongoDB filter
    const filter = {};

    // Search by phone name or brand
    if (search.trim()) {
      const searchValue = search.trim();

      filter.$or = [
        {
          name: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    // Exact filters
    if (brand.trim()) {
      filter.brand = brand.trim();
    }

    if (variant.trim()) {
      filter.variant = variant.trim();
    }

    if (ram.trim()) {
      filter.ram = ram.trim();
    }

    if (rom.trim()) {
      filter.rom = rom.trim();
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        const minimumPrice = Number(minPrice);

        if (!Number.isNaN(minimumPrice) && minimumPrice >= 0) {
          filter.price.$gte = minimumPrice;
        }
      }

      if (maxPrice !== undefined) {
        const maximumPrice = Number(maxPrice);

        if (!Number.isNaN(maximumPrice) && maximumPrice >= 0) {
          filter.price.$lte = maximumPrice;
        }
      }

      // Remove empty price object
      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    // Get total number of matching phones
    const totalItems = await Phone.countDocuments(filter);

    // Get only the phones needed for this page
    const phones = await Phone.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize);

    // Calculate total pages
    const totalPages =
      totalItems === 0
        ? 0
        : Math.ceil(totalItems / pageSize);

    // Convert image paths
    const phonesWithImages = phones.map((phone) => {
      const phoneData = phone.toObject();

      // Uploaded image stored in backend/uploads
      if (phoneData.image) {
        if (phoneData.image.startsWith("/uploads/")) {
          phoneData.image = `http://localhost:5000${phoneData.image}`;
        }
      } else if (phoneData.imageUrl) {
        phoneData.image = phoneData.imageUrl;
      }

      return phoneData;
    });

    res.status(200).json({
      phones: phonesWithImages,

      pagination: {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch phones:", error);

    res.status(500).json({
      message: "Failed to fetch phones",
    });
  }
};

// Get available phone filter options
const getPhoneFilters = async (req, res) => {
  try {
    const [brands, variants, rams, roms, priceStats] =
      await Promise.all([
        Phone.distinct("brand"),
        Phone.distinct("variant"),
        Phone.distinct("ram"),
        Phone.distinct("rom"),

        Phone.aggregate([
          {
            $group: {
              _id: null,
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" },
            },
          },
        ]),
      ]);

    const priceRange = priceStats[0] || {
      minPrice: 0,
      maxPrice: 0,
    };

    res.status(200).json({
      brands: brands.filter(Boolean).sort(),
      variants: variants.filter(Boolean).sort(),
      rams: rams.filter(Boolean).sort(),
      roms: roms.filter(Boolean).sort(),

      price: {
        min: priceRange.minPrice,
        max: priceRange.maxPrice,
      },
    });
  } catch (error) {
    console.error("Failed to fetch phone filters:", error);

    res.status(500).json({
      message: "Failed to fetch phone filters",
    });
  }
};

// Get one phone
const getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    const phoneData = phone.toObject();

    if (phoneData.image) {
      if (phoneData.image.startsWith("/uploads/")) {
        phoneData.image = `http://localhost:5000${phoneData.image}`;
      }
    } else if (phoneData.imageUrl) {
      phoneData.image = phoneData.imageUrl;
    }

    res.status(200).json(phoneData);
  } catch (error) {
    console.error("Failed to fetch phone:", error);

    res.status(500).json({
      message: "Failed to fetch phone",
    });
  }
};

// Create a phone
const createPhone = async (req, res) => {
  try {
    const {
      name,
      brand,
      variant,
      ram,
      rom,
      price,
      description,
      isNewPhone,
      imageUrl,
    } = req.body;

    const settings = await PhoneSetting.find({
      type: { $in: ["brand", "variant", "ram", "rom"] },
      isActive: true,
    });

    const activeValues = {
      brand: settings
        .filter((setting) => setting.type === "brand")
        .map((setting) => setting.value),

      variant: settings
        .filter((setting) => setting.type === "variant")
        .map((setting) => setting.value),

      ram: settings
        .filter((setting) => setting.type === "ram")
        .map((setting) => setting.value),

      rom: settings
        .filter((setting) => setting.type === "rom")
        .map((setting) => setting.value),
    };

    if (!activeValues.brand.includes(brand)) {
      return res.status(400).json({
        message: "Selected brand is inactive or invalid",
      });
    }

    if (!activeValues.variant.includes(variant)) {
      return res.status(400).json({
        message: "Selected variant is inactive or invalid",
      });
    }

    if (!activeValues.ram.includes(ram)) {
      return res.status(400).json({
        message: "Selected RAM is inactive or invalid",
      });
    }

    if (!activeValues.rom.includes(rom)) {
      return res.status(400).json({
        message: "Selected ROM is inactive or invalid",
      });
    }

    let image = null;

    // If user uploaded an image from their computer
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const phone = await Phone.create({
      name,
      brand,
      variant,
      ram,
      rom,
      price,
      description,
      isNewPhone,
      imageUrl: imageUrl || null,
      image: image,
    });

    res.status(201).json({
      message: "Phone added successfully",
      phone,
    });
  } catch (error) {
    console.error("Failed to create phone:", error);

    res.status(500).json({
      message: "Failed to create phone",
    });
  }
};

// Update a phone
const updatePhone = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    const {
      name,
      brand,
      variant,
      ram,
      rom,
      price,
      description,
      isNewPhone,
      imageUrl,
      imageRemoved,
    } = req.body;

    const settings = await PhoneSetting.find({
      type: { $in: ["brand", "variant", "ram", "rom"] },
      isActive: true,
    });

    const activeValues = {
      brand: settings
        .filter((setting) => setting.type === "brand")
        .map((setting) => setting.value),

      variant: settings
        .filter((setting) => setting.type === "variant")
        .map((setting) => setting.value),

      ram: settings
        .filter((setting) => setting.type === "ram")
        .map((setting) => setting.value),

      rom: settings
        .filter((setting) => setting.type === "rom")
        .map((setting) => setting.value),
    };

    if (!activeValues.brand.includes(brand)) {
      return res.status(400).json({
        message: "Selected brand is inactive or invalid",
      });
    }

    if (!activeValues.variant.includes(variant)) {
      return res.status(400).json({
        message: "Selected variant is inactive or invalid",
      });
    }

    if (!activeValues.ram.includes(ram)) {
      return res.status(400).json({
        message: "Selected RAM is inactive or invalid",
      });
    }

    if (!activeValues.rom.includes(rom)) {
      return res.status(400).json({
        message: "Selected ROM is inactive or invalid",
      });
    }

    const updateData = {
      name,
      brand,
      variant,
      ram,
      rom,
      price,
      description,
      isNewPhone,
    };

    // If a new image was uploaded
    if (req.file) {
      // Delete the old local image
      if (phone.image && phone.image.startsWith("/uploads/")) {
        const oldImageName = path.basename(phone.image);

        const oldImagePath = path.join(
          __dirname,
          "../../uploads",
          oldImageName,
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save the new image path
      updateData.image = `/uploads/${req.file.filename}`;
      updateData.imageUrl = null;
    } else if (imageRemoved === "true") {
      // Delete the existing local image
      if (phone.image && phone.image.startsWith("/uploads/")) {
        const oldImageName = path.basename(phone.image);

        const oldImagePath = path.join(
          __dirname,
          "../../uploads",
          oldImageName,
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Remove image path from MongoDB
      updateData.image = null;
      updateData.imageUrl = null;
    }

    const updatedPhone = await Phone.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json(updatedPhone);
  } catch (error) {
    console.error("Failed to update phone:", error);

    res.status(500).json({
      message: "Failed to update phone",
    });
  }
};

// Delete a phone
const deletePhone = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    // Delete the local image if it exists
    if (phone.image && phone.image.startsWith("/uploads/")) {
      const imageName = path.basename(phone.image);

      const imagePath = path.join(__dirname, "../../uploads", imageName);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the phone from MongoDB
    await Phone.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Phone deleted successfully",
      phone,
    });
  } catch (error) {
    console.error("Failed to delete phone:", error);

    res.status(500).json({
      message: "Failed to delete phone",
    });
  }
};

module.exports = {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  getPhoneFilters
};
