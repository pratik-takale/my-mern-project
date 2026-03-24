const Order = require("../../models/Order");
const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");

const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;

    const review = new ProductReview({
      productId,
      userId: "testUser", // TEMP FIX
      userName: "Test User",
      reviewMessage,
      reviewValue,
    });

    await review.save();

    res.status(201).json({ success: true, data: review });

  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ productId: req.params.productId });
    res.status(200).json({ success: true, data: reviews });
  } catch(e) { res.status(500).json({ success: false, message: "Error" }); }
};

module.exports = { addProductReview, getProductReviews };
