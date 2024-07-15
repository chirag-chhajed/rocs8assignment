"use client";

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  accessToken: string | null;
};

const initialState: AuthState = {
  accessToken: null,
};

export const authSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    updateAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>,
    ) => {
      console.log("Updating access token");
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { updateAccessToken, logout } = authSlice.actions;
