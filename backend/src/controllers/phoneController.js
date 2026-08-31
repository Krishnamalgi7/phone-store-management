const Phone = require("../models/Phone");
const Brand = require("../models/Brand");
const Variant = require("../models/Variant");
const Ram = require("../models/Ram");
const Rom = require("../models/Rom");

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
    // Search by phone name or brand
    if (search.trim()) {
      const searchValue = search.trim();

      const [matchingBrands] = await Promise.all([
        Brand.find({
          name: {
            $regex: searchValue,
            $options: "i",
          },
          isActive: true,
        }).select("_id"),
      ]);

      const brandIds = matchingBrands.map((brand) => brand._id);

      filter.$or = [
        {
          name: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          brandId: {
            $in: brandIds,
          },
        },
      ];
    }

    // Exact filters
    if (brand.trim()) {
      filter.brandId = brand.trim();
    }

    if (variant.trim()) {
      filter.variantId = variant.trim();
    }

    if (ram.trim()) {
      filter.ramId = ram.trim();
    }

    if (rom.trim()) {
      filter.romId = rom.trim();
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
      .populate("brandId", "name")
      .populate("variantId", "name")
      .populate("ramId", "value")
      .populate("romId", "value")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(pageSize);

    // Calculate total pages
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

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

// Filter logic for brand with variant
const getVariantsByBrand = async (req, res) => {
  try {
    const { brandId } = req.query;

    if (!brandId) {
      return res.status(400).json({
        message: "Brand ID is required",
      });
    }

    // Find phones belonging to the selected brand
    const phones = await Phone.find({
      brandId,
    }).select("variantId");

    // Get unique variant IDs
    const variantIds = [
      ...new Set(
        phones.map((phone) => phone.variantId?.toString()).filter(Boolean),
      ),
    ];

    // Find active variants
    const variants = await Variant.find({
      _id: { $in: variantIds },
      isActive: true,
    }).select("_id name");

    res.status(200).json(variants);
  } catch (error) {
    console.error("Failed to fetch variants by brand:", error);

    res.status(500).json({
      message: "Failed to fetch variants",
    });
  }
};

const getPhoneFilters = async (req, res) => {
  try {
    const { brandId, variantId} = req.query;

    const [brands, variants, rams, roms, priceStats] = await Promise.all([
      Brand.find({
        isActive: true,
      })
        .select("_id name")
        .sort({ name: 1 }),

      Variant.find({
        isActive: true,
      })
        .select("_id name")
        .sort({ name: 1 }),

variantId
  ? (async () => {
      const ramIds = await Phone.distinct("ramId", {
        brandId,
        variantId,
      });

      return Ram.find({
        _id: { $in: ramIds },
        isActive: true,
      })
        .select("_id value")
        .sort({ value: 1 });
    })()
  : brandId
    ? (async () => {
        const ramIds = await Phone.distinct("ramId", {
          brandId,
        });

        return Ram.find({
          _id: { $in: ramIds },
          isActive: true,
        })
          .select("_id value")
          .sort({ value: 1 });
      })()
    : Ram.find({
        isActive: true,
      })
        .select("_id value")
        .sort({ value: 1 }),

variantId
  ? (async () => {
      const romIds = await Phone.distinct("romId", {
        brandId,
        variantId,
      });

      return Rom.find({
        _id: { $in: romIds },
        isActive: true,
      })
        .select("_id value")
        .sort({ value: 1 });
    })()
  : brandId
    ? (async () => {
        const romIds = await Phone.distinct("romId", {
          brandId,
        });

        return Rom.find({
          _id: { $in: romIds },
          isActive: true,
        })
          .select("_id value")
          .sort({ value: 1 });
      })()
    : Rom.find({
        isActive: true,
      })
        .select("_id value")
        .sort({ value: 1 }),

      Phone.aggregate([
        {
          $group: {
            _id: null,
            minPrice: {
              $min: "$price",
            },
            maxPrice: {
              $max: "$price",
            },
          },
        },
      ]),
    ]);

    const priceRange = priceStats[0] || {
      minPrice: 0,
      maxPrice: 0,
    };

    res.status(200).json({
      brands,
      variants,
      rams,
      roms,

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
      brandId,
      variantId,
      ramId,
      romId,
      price,
      description,
      isNewPhone,
      imageUrl,
    } = req.body;

    const [brand, variant, ram, rom] = await Promise.all([
      Brand.findOne({ _id: brandId, isActive: true }),
      Variant.findOne({ _id: variantId, isActive: true }),
      Ram.findOne({ _id: ramId, isActive: true }),
      Rom.findOne({ _id: romId, isActive: true }),
    ]);

    if (!brand) {
      return res.status(400).json({
        message: "Selected brand is inactive or invalid",
      });
    }

    if (!variant) {
      return res.status(400).json({
        message: "Selected variant is inactive or invalid",
      });
    }

    if (!ram) {
      return res.status(400).json({
        message: "Selected RAM is inactive or invalid",
      });
    }

    if (!rom) {
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

      // Keep these temporarily for compatibility
      brand: brand.name,
      variant: variant.name,
      ram: ram.value,
      rom: rom.value,

      // New normalized references
      brandId: brand._id,
      variantId: variant._id,
      ramId: ram._id,
      romId: rom._id,

      price,
      description,
      isNewPhone,
      imageUrl: imageUrl || null,
      image,
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
  //temp debug logs
  // console.log("========== UPDATE PHONE ==========");
  // console.log("PHONE ID:", req.params.id);
  // console.log("BODY:", req.body);

  try {
    const phone = await Phone.findById(req.params.id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    const {
      name,
      brandId,
      variantId,
      ramId,
      romId,
      price,
      description,
      isNewPhone,
      imageUrl,
      imageRemoved,
    } = req.body;

    /*
     * -----------------------------------------
     * VALIDATE MASTER DATA
     * -----------------------------------------
     */

    const [brand, variant, ram, rom] = await Promise.all([
      Brand.findOne({
        _id: brandId,
        isActive: true,
      }),

      Variant.findOne({
        _id: variantId,
        isActive: true,
      }),

      Ram.findOne({
        _id: ramId,
        isActive: true,
      }),

      Rom.findOne({
        _id: romId,
        isActive: true,
      }),
    ]);

    if (!brand) {
      return res.status(400).json({
        message: "Selected brand is inactive or invalid",
      });
    }

    if (!variant) {
      return res.status(400).json({
        message: "Selected variant is inactive or invalid",
      });
    }

    if (!ram) {
      return res.status(400).json({
        message: "Selected RAM is inactive or invalid",
      });
    }

    if (!rom) {
      return res.status(400).json({
        message: "Selected ROM is inactive or invalid",
      });
    }

    const updateData = {
      name,

      // Actual values
      brand: brand.name,
      variant: variant.name,
      ram: ram.value,
      rom: rom.value,

      // Reference IDs
      brandId: brand._id,
      variantId: variant._id,
      ramId: ram._id,
      romId: rom._id,

      price,
      description,
      isNewPhone,
    };

    /*
     * -----------------------------------------
     * IMAGE UPLOAD
     * -----------------------------------------
     */

    if (req.file) {
      /*
       * Delete old local image
       */
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

      /*
       * Save new image
       */
      updateData.image = `/uploads/${req.file.filename}`;

      updateData.imageUrl = null;
    } else if (imageRemoved === "true") {
      // REMOVE IMAGE
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

      updateData.image = null;
      updateData.imageUrl = null;
    } else if (imageUrl) {
      //IMAGE URL
      updateData.imageUrl = imageUrl;
    }

    //UPDATE PHONE
    const updatedPhone = await Phone.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    res.status(200).json({
      message: "Phone updated successfully",
      phone: updatedPhone,
    });
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

// Toggle phone active / inactive status
const togglePhoneStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const phone = await Phone.findById(id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    phone.isActive = !phone.isActive;

    await phone.save();

    return res.status(200).json({
      message: `Phone ${
        phone.isActive ? "activated" : "deactivated"
      } successfully`,
      phone,
    });
  } catch (error) {
    console.error("Toggle phone status error:", error);

    return res.status(500).json({
      message: "Failed to update phone status",
    });
  }
};

module.exports = {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  getPhoneFilters,
  togglePhoneStatus,
  getVariantsByBrand,
};
