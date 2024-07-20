"use client";

import { useAuthState } from "@/store";
import { useRouter } from "next/navigation";
import type React from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  /**
   * Check if the user is authenticated by checking if the access token is present
   * in the Redux store. If the user is not authenticated, redirect them to the
   * login page.
   */
  const { accessToken } = useAuthState();
  const router = useRouter();

  if (!accessToken) {
    router.replace("/login");
  }
  return <>{children}</>;
};

export default SiteLayout;
