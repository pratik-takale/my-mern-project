import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

// Add a new review
export const addReview = createAsyncThunk(
  "shopReview/addReview",
  async (formdata, { getState, rejectWithValue }) => {
    try {
      const user = getState().auth.user;
      const token = user?.token;
      if (!token) return rejectWithValue("Please login to add a review");

      // const res = await axios.post(
      //   "http://localhost:5000/api/shop/review/add",
      //   formdata,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      const res = await axios.post(
  `http://localhost:5000/api/shop/review/${formdata.productId}/reviews`,
  formdata,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

      return res.data; // should contain { success: true, data: newReview }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add review");
    }
  }
);

// Fetch reviews for a product
export const getReviews = createAsyncThunk(
  "shopReview/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/shop/review/${productId}`
      );
      return res.data.data || []; // make sure it matches backend response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

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
      .addCase(addReview.fulfilled, (state, action) => {
        if (action.payload?.success) {
          state.reviews.push(action.payload.data); // push the new review
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
