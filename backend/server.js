const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// ✅ Load .env from correct location
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Create Express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// ✅ Connect to MongoDB
console.log("MONGO_URI:", process.env.MONGO_URI); // Debug log
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // ✅ Start server after DB connects
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ Routes
const itemRoutes = require("./routes/itemRoutes");
app.use("/api/items", itemRoutes);
