"use client";

import { useAuthState } from "@/store";
import { useRouter } from "next/navigation";
import type React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuthState();
  const router = useRouter();

  if (accessToken) {
    router.replace("/");
  }

  return <>{children}</>;
};

export default AuthLayout;
