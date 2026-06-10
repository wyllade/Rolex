"use client";

import { Suspense } from "react";
import PostHogProvider from "./posthog-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <PostHogProvider>{children}</PostHogProvider>
    </Suspense>
  );
}
