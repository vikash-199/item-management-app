const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getItems,
  addItem,
  enquireItem,
} = require("../controllers/itemController");

const router = express.Router();

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Multer middleware
const upload = multer({ storage });

// Routes
router.get("/", getItems);

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  addItem
);

router.post("/enquire", enquireItem);

module.exports = router;
