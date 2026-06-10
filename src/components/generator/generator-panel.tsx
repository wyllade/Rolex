"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

const generatorLabels: Record<string, string> = {
  portfolio: "Portfolio Copy",
  resume: "Resume",
  linkedin_bio: "LinkedIn Bio",
  social_bio: "Social Media Bios",
};

export default function GeneratorPanel({
  type,
  onComplete,
}: {
  type: string;
  onComplete: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const supabase = createClient();

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("Please complete your profile first");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, profile }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data.output);
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generate {generatorLabels[type] || type}</h2>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="rounded-lg bg-muted p-4">
          <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-96">{JSON.stringify(result, null, 2)}</pre>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
            >
              Copy
            </button>
            <button
              onClick={() => downloadAsFile(result, type)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
            >
              Download TXT
            </button>
            <button
              onClick={() => downloadAsPDF(result, type)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function downloadAsFile(data: any, type: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAsPDF(data: any, type: string) {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
