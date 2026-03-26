const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddlewares"); // auth middleware
const upload = require("../middlewares/uploadMiddlewares");   // multer instance

// POST /api/media/upload-image
router.post(
  "/upload-image",
  protect,                         // require login to upload
  upload.single("image"),          // expects form field named "image"
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // If you publicly serve the uploads folder, this URL will work:
    // app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(201).json({
      imageUrl,
      filename: req.file.filename,
      contentType: req.file.mimetype,
      size: req.file.size,
    });
  }
);

module.exports = router;
