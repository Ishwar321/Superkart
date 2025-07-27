import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../store/features/searchSlice";
import categoryReducer from "../store/features/categorySlice";
import productReducer from "../store/features/productSlice";
import paginationReducer from "../store/features/paginationSlice";
import cartReducer from "../store/features/cartSlice";
import orderReducer from "../store/features/orderSlice";
import imageReducer from "../store/features/imageSlice";
import userReducer from "../store/features/userSlice";
import authReducer from "../store/features/authSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    category: categoryReducer,
    product: productReducer,
    pagination: paginationReducer,
    cart: cartReducer,
    order: orderReducer,
    image: imageReducer,
    user: userReducer,
    auth : authReducer
  },
});
