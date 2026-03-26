// const multer = require('multer');

// // Configure multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); 
//   },
//   filename: (req, file, cb) => {
//    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
//   }
// });

// //File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error(' Only JPEG, and PNG are allowed.'), false); // Reject the file
//   }
// };

// const upload  = multer({ storage, fileFilter });

// module.exports = upload;




const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Resolve and create the uploads directory
const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Normalize the original name to avoid spaces and special chars
    const safeOriginal = (file.originalname || "file").replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeOriginal}`);
  },
});

// Keep types aligned with the frontend and avatar validator
const allowedTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp", // include if frontend accepts WEBP; remove if not supported
]);

const fileFilter = (req, file, cb) => {
  if (file.mimetype && allowedTypes.has(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error("Only JPG, PNG, or WEBP images are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
