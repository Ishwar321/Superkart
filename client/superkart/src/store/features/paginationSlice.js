import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemsPerPage: 18,
  totalItems: 0,
  currentPage: 1,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,

  reducers: {
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
  },
});

export const { setItemsPerPage, setCurrentPage, setTotalItems } =
  paginationSlice.actions;

export default paginationSlice.reducer;
