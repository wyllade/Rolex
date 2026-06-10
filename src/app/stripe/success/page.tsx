import Link from "next/link";

export default function StripeSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <div className="text-4xl">🎉</div>
        <h1 className="text-2xl font-semibold">Payment successful!</h1>
        <p className="text-muted-foreground">
          You're now on the Pro plan. Enjoy unlimited generations and priority processing.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
