const Order = require("../../models/order");
const Product = require("../../models/product");
const mongoose = require("mongoose");

const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.query.userId;

    console.log("USER:", userId);

    // ✅ If no user → trending
    if (!userId) {
      const trending = await Product.find().limit(10);
      return res.json(trending);
    }

    const orders = await Order.find({ userId });

    console.log("ORDERS:", orders.length);

    // ✅ No orders → trending
    if (!orders.length) {
      const trending = await Product.find().limit(10);
      return res.json(trending);
    }

    // ✅ Extract purchased product IDs
    let productIds = [];

    orders.forEach(order => {
      order.cartItems.forEach(item => {
        if (item.productId) {
          productIds.push(item.productId.toString());
        }
      });
    });

    const productObjectIds = productIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // ✅ FIX: get purchased products
    const purchasedProducts = await Product.find({
      _id: { $in: productObjectIds }
    });

    const categories = [
      ...new Set(purchasedProducts.map(p => p.category))
    ];

    const brands = [
      ...new Set(purchasedProducts.map(p => p.brand))
    ];

    console.log("CATEGORIES:", categories);
    console.log("BRANDS:", brands);

    // ✅ Recommendation logic
    let recommended = await Product.find({
      $or: [
        { category: { $in: categories } },
        { brand: { $in: brands } }
      ],
      _id: { $nin: productObjectIds }
    }).limit(10);

    // ✅ fallback
    if (recommended.length === 0) {
      recommended = await Product.find({
        _id: { $nin: productObjectIds }
      }).limit(10);
    }

    res.json(recommended);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserRecommendations };