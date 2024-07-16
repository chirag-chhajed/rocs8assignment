"use client";

import { useRefreshTokenQuery } from "@/store/api/authApi";
import { updateAccessToken } from "@/store/authSlice";
import { useDispatch } from "react-redux";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useRefreshTokenQuery();
  const dispatch = useDispatch();

  if (data?.accessToken) {
    dispatch(updateAccessToken({ accessToken: data.accessToken }));
  }

  return <>{children}</>;
};

export default AuthProvider;
