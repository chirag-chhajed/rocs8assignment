"use client";

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type currentPageState = {
  currentPage: number;
};

const initialState: currentPageState = {
  currentPage: 1,
};

export const currentPageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    updateCurrentPage: (
      state,
      action: PayloadAction<{ currentPage: number }>
    ) => {
      state.currentPage = action.payload.currentPage;
    },
  },
});

export const { updateCurrentPage } = currentPageSlice.actions;
