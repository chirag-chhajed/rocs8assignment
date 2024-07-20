"use client";

import { useAuthState } from "@/store";
import { useRouter } from "next/navigation";
import type React from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuthState();
  const router = useRouter();

  if (!accessToken) {
    router.replace("/login");
  }
  return <>{children}</>;
};

export default SiteLayout;
