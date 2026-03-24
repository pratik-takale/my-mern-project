import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

// =======================
// ADD REVIEW
// =======================
export const addReview = createAsyncThunk(
  "shopReview/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/shop/review/${formdata.productId}/reviews`,
        formdata
      );

      return res.data; // { success: true, data: review }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add review"
      );
    }
  }
);

// =======================
// GET REVIEWS
// =======================
export const getReviews = createAsyncThunk(
  "shopReview/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/shop/review/${productId}/reviews`
      );

      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// =======================
// SLICE
// =======================
const reviewSlice = createSlice({
  name: "shopReview",
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET REVIEWS
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload;
      })

      // ADD REVIEW
      .addCase(addReview.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.reviews.push(action.payload.data);
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;