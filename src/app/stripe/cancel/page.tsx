import Link from "next/link";

export default function StripeCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Payment cancelled</h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. You're still on the Free plan. You can upgrade anytime.
        </p>
        <Link
          href="/dashboard/billing"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Back to Billing
        </Link>
      </div>
    </div>
  );
}
