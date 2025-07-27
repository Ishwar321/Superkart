import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (userId) => {
    const response = await api.post(`/orders/user/${userId}/place-order`);
    console.log("The response from the order slice : ", response.data);
    console.log("The response from the order slice : ", response.data.data);
    return response.data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId) => {
      const response = await api.get(`/orders/user/${userId}/orders`);
      console.log("The user orders from the slice1 : ", response);
      console.log("The user orders from the slice2 : ", response.data);
      console.log("The user orders from the slice3 : ", response.data.data);
    return response.data.data;
  }
);

const initialState = {
  orders: [],
  loading: false,
  errorMessage: null,
  successMessage: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload.order);
        state.loading = false;
        state.successMessage = action.payload.message;
      })
        .addCase(placeOrder.rejected, (state, action) => {
        state.errorMessage = action.error.message;
        state.loading = false;
      })        
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
