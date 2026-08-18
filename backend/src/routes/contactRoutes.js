const express = require("express");

const {
  createContact,
  getContacts,
} = require("../controllers/contactController");

const router = express.Router();

// Submit contact form
router.post("/", createContact);

// Get all contact messages
router.get("/", getContacts);

module.exports = router;
