"use client";

import React, { type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from ".";

export const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
