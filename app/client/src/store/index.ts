import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { api } from "./api";
import { authSlice } from "./authSlice";
import { currentPageSlice } from "./currentPageSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    page: currentPageSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: true,
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function useAuthState() {
  return useSelector((state: RootState) => state.auth);
}
