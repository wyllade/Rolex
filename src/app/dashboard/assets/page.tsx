import { Suspense } from "react";
import AssetsClient from "./assets-client";

export const dynamic = "force-dynamic";

export default function AssetsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
      <AssetsClient />
    </Suspense>
  );
}
