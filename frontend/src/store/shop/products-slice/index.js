import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  similarProducts: [],
  error: null,
};

// ✅ SIMILAR PRODUCTS
export const getSimilarProducts = createAsyncThunk(
  "products/getSimilarProducts",
  async ({ category, productId }) => {
    const res = await axios.get(
      `http://localhost:5000/api/shop/products/similar?category=${category}&productId=${productId}`
    );
    return res.data.data;
  }
);

// ALL PRODUCTS
export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );

    return result?.data;
  }
);

// PRODUCT DETAILS
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ALL PRODUCTS
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.error?.message;
      })

      // PRODUCT DETAILS
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload?.data || null;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })

      // ✅ SIMILAR PRODUCTS
      .addCase(getSimilarProducts.pending, (state) => {
        state.similarProducts = [];
      })
      .addCase(getSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = action.payload || [];
      })
      .addCase(getSimilarProducts.rejected, (state) => {
        state.similarProducts = [];
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;