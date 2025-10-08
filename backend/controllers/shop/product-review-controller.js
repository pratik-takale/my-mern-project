const Order = require("../../models/Order");
const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");

const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;
    const userId = req.user.id;
    const userName = req.user.userName;

    const order = await Order.findOne({ userId, "cartItems.productId": productId });
    if (!order) return res.status(403).json({ success: false, message: "Purchase product first" });

    const existing = await ProductReview.findOne({ productId, userId });
    if (existing) return res.status(400).json({ success: false, message: "Already reviewed" });

    const review = new ProductReview({ productId, userId, userName, reviewMessage, reviewValue });
    await review.save();

    const reviews = await ProductReview.find({ productId });
    const avg = reviews.reduce((sum,r)=>sum+r.reviewValue,0)/reviews.length;
    await Product.findByIdAndUpdate(productId, { averageReview: avg });
 
    res.status(201).json({ success: true, review });
  } catch(e) { res.status(500).json({ success: false, message: "Error" }); }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ productId: req.params.productId });
    res.status(200).json({ success: true, reviews });
  } catch(e) { res.status(500).json({ success: false, message: "Error" }); }
};

module.exports = { addProductReview, getProductReviews };
