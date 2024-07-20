"use client";

import { useAuthState } from "@/store";
import { useRouter } from "next/navigation";
import type React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  /**
   * Check if the user is authenticated by checking if the access token is present
   * in the Redux store. If the user is authenticated, redirect them to the
   * protected page.
   */
  const { accessToken } = useAuthState();
  const router = useRouter();

  if (accessToken) {
    router.replace("/");
  }

  return <>{children}</>;
};

export default AuthLayout;
