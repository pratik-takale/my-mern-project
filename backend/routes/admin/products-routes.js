
const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const { handleImageUpload, addProduct, fetchAllProducts ,deleteProduct } = require("../../controllers/admin/products-controller");

const router = express.Router();

// Image upload route
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

// Add product (send image as multipart/form-data)
router.post("/add", upload.single("my_file"), addProduct);

// Fetch products
router.get("/get", fetchAllProducts);
router.delete("/delete/:id", deleteProduct);
module.exports = router;
