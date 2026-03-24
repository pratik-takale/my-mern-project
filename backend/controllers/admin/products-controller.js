const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");


// ✅ MULTIPLE IMAGE UPLOAD HANDLER
const handleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // ✅ parallel upload (FAST)
    const uploadPromises = req.files.map((file) =>
      imageUploadUtil(file.buffer, file.mimetype)
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map((r) => r.secure_url);

    res.json({
      success: true,
      images: uploadedImages,
    });

  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Cloudinary upload failed",
    });
  }
};


// ✅ ADD PRODUCT (NO CLOUDINARY HERE)
const addProduct = async (req, res) => {
  try {
    const {
      images, // ✅ frontend send URLs
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const newProduct = new Product({
      images: images || [],
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

    res.status(201).json({
      success: true,
      data: newProduct,
    });

  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
    });
  }
};


// ✅ FETCH ALL PRODUCTS
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};


// ✅ EDIT PRODUCT (NO CLOUDINARY HERE)
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      images, // ✅ updated images array
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.totalStock = totalStock || product.totalStock;
    product.averageReview = averageReview || product.averageReview;

    // ✅ update images directly
    if (images && images.length > 0) {
      product.images = images;
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error("EDIT PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error editing product",
    });
  }
};


// ✅ DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error,
    });
  }
};


module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};