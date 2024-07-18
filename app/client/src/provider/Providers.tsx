"use client";

import { env } from "@/env.mjs";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import type React from "react";

if (typeof window !== "undefined" && location.hostname !== "localhost") {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: `${location.origin}/ingest`,
    person_profiles: "always",
    ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
