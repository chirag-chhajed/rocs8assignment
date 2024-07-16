"use client";

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  currentPage: number;
};

const initialState: AuthState = {
  currentPage: 1,
};

export const currentPageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    updateCurrentPage: (
      state,
      action: PayloadAction<{ currentPage: number }>,
    ) => {
      state.currentPage = action.payload.currentPage;
    },
  },
});

export const { updateCurrentPage } = currentPageSlice.actions;
