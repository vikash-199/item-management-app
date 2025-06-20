const nodemailer = require("nodemailer");
const Item = require("../models/Item");

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("❌ Failed to fetch items:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { name, type, description } = req.body;

    // Ensure files exist
    if (!req.files || !req.files.coverImage) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const coverImage = req.files.coverImage[0].filename;
    const additionalImages = req.files.additionalImages
      ? req.files.additionalImages.map((f) => f.filename)
      : [];

    const item = new Item({
      name,
      type,
      description,
      coverImage,
      additionalImages,
    });

    await item.save();
    console.log("✅ Item added:", name);
    res.json({ message: "Item successfully added" });
  } catch (err) {
    console.error("❌ Error saving item:", err);
    res.status(500).json({ message: "Failed to add item" });
  }
};

exports.enquireItem = async (req, res) => {
  const { itemName, userEmail } = req.body;

  if (!itemName || !userEmail) {
    return res
      .status(400)
      .json({ message: "Item name and user email are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // Your Gmail
      pass: process.env.MAIL_PASS, // App password from Gmail
    },
  });

  const mailOptions = {
    from: userEmail,
    to: process.env.ADMIN_EMAIL, // Static email to receive enquiries
    subject: `Enquiry for item: ${itemName}`,
    text: `Someone enquired about "${itemName}". Contact them at: ${userEmail}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Enquiry email sent for "${itemName}"`);
    res.json({ message: "Enquiry sent successfully" });
  } catch (err) {
    console.error("❌ Failed to send enquiry email:", err);
    res.status(500).json({ message: "Failed to send enquiry" });
  }
};
