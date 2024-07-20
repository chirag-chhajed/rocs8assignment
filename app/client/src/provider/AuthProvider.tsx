"use client";

import { useRefreshTokenQuery } from "@/store/api/authApi";
import { updateAccessToken } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * On page load, do a GET request to /auth/refresh to get a new access token
  if the refresh token is still valid. If the refresh token is invalid, the
  server will respond with a 401 Unauthorized status code and the user will
  be redirected to the login page.
   */
  const { data, isLoading, isFetching } = useRefreshTokenQuery();
  const dispatch = useAppDispatch();

  if (data?.accessToken) {
    dispatch(updateAccessToken({ accessToken: data.accessToken }));
  }

  if (isLoading || isFetching) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
