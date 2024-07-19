"use client";

import { useAuthState } from "@/store";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const { accessToken } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (accessToken && mounted) {
    router.replace("/");
  }

  return <>{children}</>;
};

export default AuthLayout;
