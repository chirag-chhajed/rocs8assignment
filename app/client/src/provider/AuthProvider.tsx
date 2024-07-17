"use client";

import { useRefreshTokenQuery } from "@/store/api/authApi";
import { updateAccessToken } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useRefreshTokenQuery();
  const dispatch = useAppDispatch();

  if (data?.accessToken) {
    dispatch(updateAccessToken({ accessToken: data.accessToken }));
  }

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
