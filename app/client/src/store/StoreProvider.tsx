"use client";

import { store } from "@/store";
import React, { type ReactNode } from "react";
import { Provider } from "react-redux";

export const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
