"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import CodeInput from "@/components/auth/code-input";

type Step = "info" | "code";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: { full_name: name },
      },
    });

    if (error) setError(error.message);
    else setStep("code");
    setLoading(false);
  };

  const handleVerifyCode = async (token: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) setError(error.message);
    else window.location.href = "/dashboard/profile";
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start building your personal brand</p>
        </div>

        {step === "info" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending code..." : "Send code"}
            </button>
          </form>
        )}

        {step === "code" && (
          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Enter the code sent to <strong>{email}</strong>
            </p>
            <CodeInput onComplete={handleVerifyCode} />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {loading && <p className="text-sm text-muted-foreground text-center">Verifying...</p>}
            <div className="flex justify-center gap-4 text-sm">
              <button
                onClick={() => setStep("info")}
                className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Change email
              </button>
              <button
                onClick={() => { handleSendCode({ preventDefault: () => {} } as any); }}
                className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Resend code
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium underline underline-offset-4 hover:text-foreground">Sign in</a>
        </p>
      </div>
    </div>
  );
}
