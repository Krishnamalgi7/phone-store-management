const express = require("express");

const {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
} = require("../controllers/phoneController");

const router = express.Router();

// Get all phones
router.get("/", getPhones);

// Create a phone
router.post("/", createPhone);

// Get one phone
router.get("/:id", getPhoneById);

// Update a phone
router.put("/:id", updatePhone);

// Delete a phone
router.delete("/:id", deletePhone);

module.exports = router;