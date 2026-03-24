const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const razorpay = require("../../helpers/razorpay");
const crypto = require("crypto");

// ===============================
// CREATE ORDER (RAZORPAY)
// ===============================
const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, addressInfo, totalAmount, cartId } = req.body;

    // ✅ CHECK KEYS
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys missing in .env",
      });
    }

    // ✅ VALIDATE AMOUNT
    if (!totalAmount || isNaN(totalAmount) || Number(totalAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // ✅ CREATE ORDER
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(totalAmount) * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // ✅ SAVE DB
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount,
      orderDate: new Date(),
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (error) {
    console.error("🔥 RAZORPAY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error?.error?.description || error.message || "Razorpay order failed",
    });
  }
};

// ===============================
// VERIFY PAYMENT (RAZORPAY)
// ===============================
const capturePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret missing",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ VERIFY SIGNATURE
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ UPDATE ORDER
    order.paymentStatus = "paid";
    order.orderStatus = "pending";
    order.razorpayPaymentId = razorpay_payment_id;

    // ✅ UPDATE STOCK (SAFE)
    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      product.totalStock = Math.max(0, product.totalStock - item.quantity);
      await product.save();
    }

    // ✅ DELETE CART
    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful & order confirmed",
      data: order,
    });

  } catch (error) {
    console.error("🔥 VERIFY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

// ===============================
// GET USER ORDERS
// ===============================
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};
// ===============================
// GET ORDER DETAILS
// ===============================
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};
const getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Group by date
    const salesData = {};

    orders.forEach((order) => {
      const date = order.orderDate.toISOString().split("T")[0];

      if (!salesData[date]) {
        salesData[date] = 0;
      }

      salesData[date] += order.totalAmount;
    });

    res.status(200).json({
      success: true,
      totalOrders,
      totalRevenue,
      salesData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Dashboard error",
    });
  }
};
module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
   getAdminDashboard,
};