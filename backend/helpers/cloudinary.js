
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function imageUploadUtil(fileBuffer, mimetype) {
  if (!fileBuffer || !mimetype) throw new Error("No file buffer or mimetype provided");

  try {
    const base64String = Buffer.from(fileBuffer).toString("base64");
    const dataURI = `data:${mimetype};base64,${base64String}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "mern-project",
      timeout: 60000, // 60 sec
    });

    return result; // contains secure_url
  } catch (error) {
    console.error("Cloudinary full error:", error);
    throw new Error("Cloudinary upload failed: " + (error.message || JSON.stringify(error)));
  }
}

module.exports = { upload, imageUploadUtil };
