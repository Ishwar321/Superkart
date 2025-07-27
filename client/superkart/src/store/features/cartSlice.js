import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api";



export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("quantity", quantity);
    const response = await privateApi.post("/cartItems/item/add", formData);
    return response.data;
  }
);

export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (userId) => {    
    const response = await api.get(`/carts/user/${userId}/cart`);    
    return response.data.data;
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartId, itemId, newQuantity }) => {
    await api.put(
      `/cartItems/cart/${cartId}/item/${itemId}/update?quantity=${newQuantity}`
    );
    return { itemId, newQuantity };
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ cartId, itemId }) => {
    await api.delete(`/cartItems/cart/${cartId}/item/${itemId}/remove`);
    return itemId;
  }
);

const initialState = {
  items: [],
  cartId: null,
  totalAmount: 0,
  isLoading: true,
  errorMessage: null,
  successMessage: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
        state.successMessage = action.payload.message;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.cartId = action.payload.cartId;
        state.totalAmount = action.payload.totalAmount;
        state.errorMessage = null;
        state.isLoading = false;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { itemId, newQuantity } = action.payload;
        const item = state.items.find((item) => item.product.id === itemId);
        if (item) {
          item.quantity = newQuantity;
          item.totalPrice = item.product.price * newQuantity;
        }
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.items = state.items.filter((item) => item.product.id !== itemId);
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
