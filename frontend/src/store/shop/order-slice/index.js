// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   approvalURL: null,
//   isLoading: false,
//   orderId: null,
//   orderList: [],
//   orderDetails: null,
// };

// export const createNewOrder = createAsyncThunk(
//   "/order/createNewOrder",
//   async (orderData) => {
//     const response = await axios.post(
//       "http://localhost:5000/api/shop/order/create",
//       orderData
//     );

//     return response.data;
//   }
// );

// export const capturePayment = createAsyncThunk(
//   "/order/capturePayment",
//   async ({ paymentId, payerId, orderId }) => {
//     const response = await axios.post(
//       "http://localhost:5000/api/shop/order/capture",
//       {
//         paymentId,
//         payerId,
//         orderId,
//       }
//     );

//     return response.data;
//   }
// );

// export const getAllOrdersByUserId = createAsyncThunk(
//   "/order/getAllOrdersByUserId",
//   async (userId) => {
//     const response = await axios.get(
//       `http://localhost:5000/api/shop/order/list/${userId}`
//     );

//     return response.data;
//   }
// );

// export const getOrderDetails = createAsyncThunk(
//   "/order/getOrderDetails",
//   async (id) => {
//     const response = await axios.get(
//       `http://localhost:5000/api/shop/order/details/${id}`
//     );

//     return response.data;
//   }
// );

// const shoppingOrderSlice = createSlice({
//   name: "shoppingOrderSlice",
//   initialState,
//   reducers: {
//     resetOrderDetails: (state) => {
//       state.orderDetails = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createNewOrder.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createNewOrder.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.approvalURL = action.payload.approvalURL;
//         state.orderId = action.payload.orderId;
//         sessionStorage.setItem(
//           "currentOrderId",
//           JSON.stringify(action.payload.orderId)
//         );
//       })
//       .addCase(createNewOrder.rejected, (state) => {
//         state.isLoading = false;
//         state.approvalURL = null;
//         state.orderId = null;
//       })
//       .addCase(getAllOrdersByUserId.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderList = action.payload.data;
//       })
//       .addCase(getAllOrdersByUserId.rejected, (state) => {
//         state.isLoading = false;
//         state.orderList = [];
//       })
//       .addCase(getOrderDetails.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getOrderDetails.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderDetails = action.payload.data;
//       })
//       .addCase(getOrderDetails.rejected, (state) => {
//         state.isLoading = false;
//         state.orderDetails = null;
//       });
//   },
// });

// export const { resetOrderDetails } = shoppingOrderSlice.actions;

// export default shoppingOrderSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

/* ================================
   CREATE ORDER (RAZORPAY)
================================ */
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/order/create",
        orderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Order creation failed");
    }
  }
);

/* ================================
   GET ALL ORDERS BY USER
================================ */
export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/list/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

/* ================================
   GET SINGLE ORDER DETAILS
================================ */
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/details/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch order");
    }
  }
);

/* ================================
   SLICE
================================ */
const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE ORDER */
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.orderId;

        // store orderId for later verification if needed
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
      })

      /* GET ALL ORDERS */
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })

      /* GET ORDER DETAILS */
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
