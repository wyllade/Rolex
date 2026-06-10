"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import GeneratorPanel from "@/components/generator/generator-panel";

export default function AssetsClient() {
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGen, setSelectedGen] = useState<any>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const generateType = searchParams.get("generate");

  const fetchGenerations = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setGenerations(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchGenerations(); }, [fetchGenerations]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Assets</h1>
        <p className="text-sm text-muted-foreground">Generate and manage your brand assets.</p>
      </div>

      {generateType && (
        <GeneratorPanel type={generateType} onComplete={fetchGenerations} />
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">History</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : generations.length === 0 ? (
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">No generations yet. Select an asset type above to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {generations.map((gen) => (
              <button
                key={gen.id}
                onClick={() => setSelectedGen(selectedGen?.id === gen.id ? null : gen)}
                className="w-full text-left rounded-lg border border-border p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{gen.type.replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground">{new Date(gen.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {gen.feedback === true && <span className="text-xs">👍</span>}
                    {gen.feedback === false && <span className="text-xs">👎</span>}
                  </div>
                </div>
                {selectedGen?.id === gen.id && (
                  <div className="mt-4 rounded-lg bg-muted p-4">
                    <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-96">{JSON.stringify(gen.output, null, 2)}</pre>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(JSON.stringify(gen.output, null, 2)); }}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        Copy
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadTxt(gen.output, gen.type); }}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        TXT
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFeedback(gen.id, true); }}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        👍
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFeedback(gen.id, false); }}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        👎
                      </button>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function handleFeedback(id: string, feedback: boolean) {
  await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ generationId: id, feedback }),
  });
}

function downloadTxt(data: any, type: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
