const express = require("express");

const verifyToken = require("../middleware/authMiddleware");

const {
  getSettings,
  createSetting,
  updateSettingStatus,
  deleteSetting,
} = require("../controllers/phoneSettingController");

const router = express.Router();

router.get("/", verifyToken, getSettings);
router.post("/", verifyToken, createSetting);
router.patch("/:id/status", verifyToken, updateSettingStatus);
router.delete("/:id", verifyToken, deleteSetting);

module.exports = router;