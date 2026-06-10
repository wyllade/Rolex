"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [recentGenerations, setRecentGenerations] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profile);

      const { data: credits } = await supabase.from("user_credits").select("*").eq("user_id", user.id).single();
      setGenerationCount(credits?.total_generations ?? 0);

      const { data: gens } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentGenerations(gens ?? []);
    };
    fetchData();
  }, []);

  const remaining = Math.max(0, 20 - generationCount);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back{profile?.name ? `, ${profile.name}` : ""}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Generations</p>
          <p className="text-2xl font-semibold">{generationCount}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Remaining (Free)</p>
          <p className="text-2xl font-semibold">{remaining}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Plan</p>
          <p className="text-2xl font-semibold capitalize">Free</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quick Generate</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {generators.map((gen) => (
            <Link
              key={gen.type}
              href={`/dashboard/assets?generate=${gen.type}`}
              className="rounded-lg border border-border p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">{gen.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{gen.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {recentGenerations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Generations</h2>
          <div className="space-y-2">
            {recentGenerations.map((gen) => (
              <div key={gen.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium capitalize">{gen.type.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground">{new Date(gen.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-muted-foreground">{(gen.input as any)?.role || ""}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const generators = [
  { type: "portfolio", title: "Portfolio Copy", description: "Hero, about, services, projects" },
  { type: "resume", title: "Resume", description: "ATS-optimized content" },
  { type: "linkedin_bio", title: "LinkedIn Bio", description: "Profile optimization" },
  { type: "social_bio", title: "Social Bios", description: "Twitter, GitHub, Instagram" },
];
