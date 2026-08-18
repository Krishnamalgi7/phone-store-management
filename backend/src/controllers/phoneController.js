const Phone = require("../models/Phone");
const mongoose = require("mongoose");

const { getGridFSBucket } = require("../config/gridfs");
const { Readable } = require("stream");

// Get all phones
const getPhones = async (req, res) => {
  try {
    const phones = await Phone.find().sort({
      createdAt: -1,
    });

    const phonesWithImages = phones.map((phone) => {
      const phoneData = phone.toObject();

      if (phoneData.imageFileId) {
        phoneData.image = `http://localhost:5000/api/phones/image/${phoneData.imageFileId}`;
      } else if (phoneData.imageUrl) {
        phoneData.image = phoneData.imageUrl;
      } else if (phoneData.image) {
        // Support old phone documents
        // that still have the old "image" field.
        phoneData.image = phoneData.image;
      }

      return phoneData;
    });

    res.status(200).json(phonesWithImages);
  } catch (error) {
    console.error("Failed to fetch phones:", error);

    res.status(500).json({
      message: "Failed to fetch phones",
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

    res.status(200).json(phone);
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
    const { name, brand, price, description, isNewPhone, imageUrl } = req.body;

    let imageFileId = null;

    // If user uploaded an image from their computer
    if (req.file) {
      const bucket = getGridFSBucket();

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });

      await new Promise((resolve, reject) => {
        Readable.from(req.file.buffer)
          .pipe(uploadStream)
          .on("finish", resolve)
          .on("error", reject);
      });

      imageFileId = uploadStream.id;
    }

    const phone = await Phone.create({
      name,
      brand,
      price,
      description,
      isNewPhone,
      imageUrl: imageUrl || null,
      imageFileId,
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

    const { name, brand, price, description, isNewPhone, imageUrl } = req.body;

    phone.name = name;
    phone.brand = brand;
    phone.price = price;
    phone.description = description;
    phone.isNewPhone = isNewPhone;

    // If a new image was uploaded
    if (req.file) {
      const bucket = getGridFSBucket();

      // Delete the old image from GridFS
      if (phone.imageFileId) {
        try {
          await bucket.delete(new mongoose.Types.ObjectId(phone.imageFileId));
        } catch (error) {
          console.log("Old image could not be deleted:", error.message);
        }
      }

      // Upload the new image
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });

      await new Promise((resolve, reject) => {
        Readable.from(req.file.buffer)
          .pipe(uploadStream)
          .on("finish", resolve)
          .on("error", reject);
      });

      // Store the new image ID
      phone.imageFileId = uploadStream.id;

      // We are using the uploaded image now
      phone.imageUrl = null;
    }
    // If user selected URL instead
    else if (imageUrl) {
      phone.imageUrl = imageUrl;
      phone.imageFileId = null;
    }

    await phone.save();

    res.status(200).json({
      message: "Phone updated successfully",
      phone,
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

    // Delete uploaded image from GridFS
    if (phone.imageFileId) {
      try {
        const bucket = getGridFSBucket();

        await bucket.delete(
          new mongoose.Types.ObjectId(
            phone.imageFileId
          )
        );
      } catch (error) {
        console.log(
          "Image could not be deleted from GridFS:",
          error.message
        );
      }
    }

    // Delete phone document
    await Phone.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Phone and image deleted successfully",
      phone,
    });
  } catch (error) {
    console.error(
      "Failed to delete phone:",
      error
    );

    res.status(500).json({
      message: "Failed to delete phone",
    });
  }
};

const getPhoneImage = async (req, res) => {
  try {
    const bucket = getGridFSBucket();

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket
      .find({
        _id: fileId,
      })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const file = files[0];

    res.set("Content-Type", file.contentType);

    bucket.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    console.error("Failed to fetch image:", error);

    res.status(500).json({
      message: "Failed to fetch image",
    });
  }
};

module.exports = {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  getPhoneImage,
};
