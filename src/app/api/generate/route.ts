import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateWithPrompt, getPrompt } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, profile } = await request.json();

    if (!type || !profile) {
      return NextResponse.json({ error: "Missing type or profile" }, { status: 400 });
    }

    const validTypes = ["portfolio", "resume", "linkedin_bio", "social_bio"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
    }

    const { data: credits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const isPro = credits?.plan === "pro";
    const limit = isPro ? Infinity : 20;

    if ((credits?.total_generations ?? 0) >= limit) {
      return NextResponse.json(
        { error: "Generation limit reached. Upgrade to Pro for unlimited generations." },
        { status: 403 }
      );
    }

    const promptTemplate = getPrompt(type);
    const output = await generateWithPrompt(promptTemplate, {
      name: profile.name || "User",
      role: profile.role || "",
      experience: profile.experience || "",
      skills: (profile.skills || []).join(", "),
      projects: profile.projects || "",
      goals: profile.goals || "",
      target_audience: profile.target_audience || "",
    });

    const { error: insertError } = await supabase.from("generations").insert({
      user_id: user.id,
      type,
      input: { role: profile.role, skills: profile.skills },
      output,
    });

    if (insertError) throw insertError;

    if (credits) {
      await supabase
        .from("user_credits")
        .update({ total_generations: credits.total_generations + 1, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
