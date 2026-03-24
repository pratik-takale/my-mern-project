const express = require("express");
const { upload } = require("../../helpers/cloudinary");
const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const router = express.Router();

// ✅ IMAGE UPLOAD ONLY
router.post(
  "/upload-image",
  upload.array("my_file", 5),
  handleImageUpload
);

// ✅ ADD PRODUCT (NO MULTER)
router.post("/add", addProduct);

// ✅ EDIT PRODUCT (NO MULTER)
router.put("/edit/:id", editProduct);

// ✅ FETCH PRODUCTS
router.get("/get", fetchAllProducts);

// ✅ DELETE PRODUCT
router.delete("/delete/:id", deleteProduct);

module.exports = router;