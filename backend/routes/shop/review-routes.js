
const express = require("express");
const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Add Review for a product
// router.post("/:productId/reviews", authMiddleware, addProductReview);
router.post("/:productId/reviews", addProductReview);

// Get Reviews of a product
router.get("/:productId/reviews", getProductReviews);

module.exports = router;
