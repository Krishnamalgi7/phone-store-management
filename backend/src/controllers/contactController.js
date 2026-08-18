const Contact = require("../models/Contact");

// Create a contact message
const createContact = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    const contact = await Contact.create({
      name,
      phone,
      message,
    });

    res.status(201).json({
      message: "Message submitted successfully",
      contact,
    });
  } catch (error) {
    console.error("Failed to submit contact:", error);

    res.status(500).json({
      message: "Failed to submit contact",
    });
  }
};

// Get all contact messages
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json(contacts);
  } catch (error) {
    console.error("Failed to fetch contacts:", error);

    res.status(500).json({
      message: "Failed to fetch contacts",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};