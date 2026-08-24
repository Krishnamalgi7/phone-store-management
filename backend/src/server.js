const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const phoneRoutes = require("./routes/phoneRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const phoneSettingRoutes = require("./routes/phoneSettingRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/phones", phoneRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/admin", adminRoutes);
app.use("/api/settings", phoneSettingRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Node Backend API is running",
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
