"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";

export default function BillingPage() {
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("user_credits").select("plan").eq("user_id", user.id).single();
      if (data) { setPlan(data.plan); if (data.plan === "pro") trackEvent("viewed_billing", { plan: "pro" }); }
    });
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/create-checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your plan and subscription.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
        <div className={`rounded-lg border-2 p-6 space-y-4 ${plan === "free" ? "border-primary" : "border-border"}`}>
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="text-3xl font-bold">$0</p>
          <p className="text-sm text-muted-foreground">per month</p>
          <ul className="space-y-2 text-sm">
            <li>✓ 20 generations per month</li>
            <li>✓ Portfolio, resume, LinkedIn, social bios</li>
            <li>✓ Export to PDF & TXT</li>
          </ul>
          {plan === "free" && (
            <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium">Current plan</span>
          )}
        </div>

        <div className={`rounded-lg border-2 p-6 space-y-4 ${plan === "pro" ? "border-primary" : "border-border"}`}>
          <h2 className="text-lg font-semibold">Pro</h2>
          <p className="text-3xl font-bold">$12</p>
          <p className="text-sm text-muted-foreground">per month</p>
          <ul className="space-y-2 text-sm">
            <li>✓ Unlimited generations</li>
            <li>✓ Priority processing</li>
            <li>✓ All generator types</li>
            <li>✓ Early access to new features</li>
          </ul>
          {plan === "pro" ? (
            <button
              onClick={handleManageSubscription}
              disabled={loading}
              className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Manage subscription
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Loading..." : "Upgrade to Pro"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
