const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    cartId: String,

    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, // ✅ FIX
          ref: "Product",
          required: true,
        },
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },

    paymentMethod: String,
    paymentStatus: String,

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentId: String,
    payerId: String,
  },
  {
    timestamps: true, // ✅ VERY IMPORTANT
  }
);

module.exports =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);