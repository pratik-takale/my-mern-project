import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
};

// ➕ Add Product
export const addNewProduct = createAsyncThunk(
  "products/addNewProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("price", formData.price);
      data.append("salePrice", formData.salePrice);
      data.append("totalStock", formData.totalStock);
      data.append("averageReview", formData.averageReview);

      if (formData.image) {
        data.append("my_file", formData.image); // ✅ multer config सोबत match
      }

      const result = await axios.post(
        "http://localhost:5000/api/admin/products/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Add failed");
    }
  }
);

// 📥 Fetch All Products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        "http://localhost:5000/api/admin/products/get"
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// ✏️ Edit Product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        `http://localhost:5000/api/admin/products/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Edit failed");
    }
  }
);

// 🗑 Delete Product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/api/admin/products/delete/${id}`
      );
      return { id, ...result?.data }; // ✅ id परत पाठवलं state मधून काढायला
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// 🟢 Slice
const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload;
      })

      // delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productList = state.productList.filter(
          (product) => product._id !== action.payload.id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default AdminProductsSlice.reducer;
