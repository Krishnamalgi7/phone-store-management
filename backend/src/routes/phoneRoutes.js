const express = require("express");
const upload = require("../config/upload");
const verifyToken = require("../middleware/authMiddleware");

const {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  getPhoneFilters,
} = require("../controllers/phoneController");

const router = express.Router();

// Get all phones
router.get("/", getPhones);

// Create a phone with Admin JWT required
router.post("/", verifyToken, upload.single("image"), createPhone);

// Filter phone route
router.get("/filters", getPhoneFilters);

// Get one phone
router.get("/:id", getPhoneById);

// Update a phone with Admin JWT required
router.put("/:id", verifyToken, upload.single("image"), updatePhone);

// Delete a phone with Admin JWT required
router.delete("/:id", verifyToken, deletePhone);

module.exports = router;