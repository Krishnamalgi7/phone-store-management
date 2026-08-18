const express = require("express");
const cors = require("cors");
const path = require("path");
const { initializeGridFS } = require("./config/gridfs");
require("dotenv").config();

const connectDB = require("./config/db");
const phoneRoutes = require("./routes/phoneRoutes");
const contactRoutes = require("./routes/contactRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/phones", phoneRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Nothing Backend API is running",
  });
});

connectDB().then(() => {
  initializeGridFS();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
