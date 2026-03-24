const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getSimilarProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

// routes
router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/similar", getSimilarProducts);

module.exports = router;