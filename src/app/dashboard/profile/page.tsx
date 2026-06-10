"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    experience: "",
    skills: "",
    projects: "",
    goals: "",
    target_audience: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setForm({
          name: data.name || "",
          role: data.role || "",
          experience: data.experience || "",
          skills: data.skills?.join(", ") || "",
          projects: data.projects || "",
          goals: data.goals || "",
          target_audience: data.target_audience || "",
        });
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      name: form.name,
      role: form.role,
      experience: form.experience,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      projects: form.projects,
      goals: form.goals,
      target_audience: form.target_audience,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Tell us about yourself so AI can generate better content.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Frontend Developer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Experience</label>
          <textarea
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
            placeholder="Briefly describe your professional experience..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="React, TypeScript, Node.js, UI/UX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Projects</label>
          <textarea
            value={form.projects}
            onChange={(e) => setForm({ ...form, projects: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
            placeholder="List your notable projects..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Goals</label>
          <textarea
            value={form.goals}
            onChange={(e) => setForm({ ...form, goals: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            rows={2}
            placeholder="What are your personal branding goals?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Target Audience</label>
          <input
            value={form.target_audience}
            onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Startups, tech companies, freelance clients..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
