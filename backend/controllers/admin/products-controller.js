
// const { imageUploadUtil } = require("../../helpers/cloudinary");
// const Product = require("../../models/Product");

// // Image Upload
// const handleImageUpload = async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, message: "No file uploaded" });

//     const result = await imageUploadUtil(req.file.buffer, req.file.mimetype);

//     return res.json({ success: true, result });
//   } catch (error) {
//     console.error("Image upload error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Add Product
// const addProduct = async (req, res) => {
//   try {
//     let imageUrl = "";
//     if (req.file) {
//       const result = await imageUploadUtil(req.file.buffer, req.file.mimetype);
//       imageUrl = result.secure_url; // save correct URL
//     }

//     const { title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body;

//     const newProduct = new Product({
//       image: imageUrl,
//       title,
//       description,
//       category,
//       brand,
//       price,
//       salePrice,
//       totalStock,
//       averageReview,
//     });

//     await newProduct.save();
//     return res.status(201).json({ success: true, data: newProduct });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Error occurred" });
//   }
// };

// // Fetch all products
// const fetchAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     return res.status(200).json({ success: true, data: products });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Error occurred" });
//   }
// };

// module.exports = { handleImageUpload, addProduct, fetchAllProducts };
const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// Image upload handler
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const result = await imageUploadUtil(req.file.buffer, req.file.mimetype);

    res.json({ success: true, result }); // send secure_url
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ success: false, message: "Cloudinary upload failed" });
  }
};

// Add product
const addProduct = async (req, res) => {
  try {
    let imageUrl = req.file ? (await imageUploadUtil(req.file.buffer, req.file.mimetype)).secure_url : "";

    const { title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body;

    const newProduct = new Product({
      image: imageUrl,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

// Edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.totalStock = totalStock || product.totalStock;
    product.averageReview = averageReview || product.averageReview;
    if (req.file) product.image = (await imageUploadUtil(req.file.buffer, req.file.mimetype)).secure_url;

    await product.save();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error editing product" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct };
