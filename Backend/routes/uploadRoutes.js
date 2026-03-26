// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();

// // Save uploads inside /uploads folder
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({ storage });

// router.post("/", upload.single("image"), (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
//   res.json({ imageUrl });
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadAvatar } = require("../controllers/userController");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.single("avatar"),uploadAvatar);

module.exports = router;

// const express = require("express");
// const { uploadAvatar } = require("../controllers/userController");
// const upload = require("../middlewares/uploadMiddlewares"); // ✅ use centralized middleware

// const router = express.Router();

// // Route for avatar upload
// router.post("/", upload.single("avatar"), uploadAvatar);

// module.exports = router;

