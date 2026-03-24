const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    images: [String],
    title: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      required: true
    },
    brand: String,
    price: {
      type: Number,
      required: true
    },
    salePrice: Number,
    totalStock: {
      type: Number,
      default: 0
    },
    averageReview: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

// ✅ FIX (VERY IMPORTANT)
module.exports =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);