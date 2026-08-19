const express = require("express");
const upload = require("../config/upload");
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
router.post("/", upload.single("image"), createPhone);

// Get one phone
router.get("/:id", getPhoneById);

// Update a phone
router.put("/:id", upload.single("image"), updatePhone);

// Delete a phone
router.delete("/:id", deletePhone);

module.exports = router;