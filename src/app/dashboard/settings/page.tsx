"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const handleCopyUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings.</p>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <h2 className="font-semibold">Account</h2>
        <p className="text-sm text-muted-foreground">Your account is managed via Supabase Auth.</p>
        <button
          onClick={handleCopyUserId}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          {copied ? "Copied!" : "Copy User ID"}
        </button>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <h2 className="font-semibold">Plan</h2>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing.
        </p>
        <a
          href="/dashboard/billing"
          className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          View Billing
        </a>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <h2 className="font-semibold">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
        <button
          disabled
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-500 opacity-50 cursor-not-allowed"
        >
          Delete Account (Coming soon)
        </button>
      </div>
    </div>
  );
}
