const Phone = require("../models/Phone");

// Get all phones
const getPhones = async (req, res) => {
  try {
    const phones = await Phone.find().sort({
      createdAt: -1,
    });

    res.status(200).json(phones);
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
    const phone = await Phone.create(req.body);

    res.status(201).json(phone);
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
    const phone = await Phone.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    res.status(200).json(phone);
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
    const phone = await Phone.findByIdAndDelete(req.params.id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

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
};