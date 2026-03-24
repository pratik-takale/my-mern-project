const Order = require("../../models/order");
const Product = require("../../models/product");

const getUserRecommendations = async (req, res) => {
  try {
    const userId = "demoUserId"; // replace later with real user

    const orders = await Order.find({ userId });

    // ✅ If no orders → show trending
    if (orders.length === 0) {
      const trending = await Product.find().limit(10);
      return res.json(trending);
    }

    let productIds = [];

    orders.forEach(order => {
      order.cartItems.forEach(item => {
        productIds.push(item.productId);
      });
    });

    const purchasedProducts = await Product.find({
      _id: { $in: productIds }
    });

    const categories = purchasedProducts.map(p => p.category);
    const brands = purchasedProducts.map(p => p.brand);

    // ✅ MAIN RECOMMENDATION
    let recommended = await Product.find({
      $or: [
        { category: { $in: categories } },
        { brand: { $in: brands } }
      ],
      _id: { $nin: productIds }
    }).limit(10);

    // 🔥 IMPORTANT FIX: FILL REMAINING PRODUCTS
    if (recommended.length < 10) {
      const extra = await Product.find({
        _id: { $nin: [...productIds, ...recommended.map(p => p._id)] }
      }).limit(10 - recommended.length);

      recommended = [...recommended, ...extra];
    }

    res.json(recommended);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserRecommendations };