import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ FIX: pass userId
export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/recommendations?userId=${userId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchRecommendations.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default recommendationSlice.reducer;