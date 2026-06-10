export type GenerationType = "portfolio" | "resume" | "linkedin_bio" | "social_bio";

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  experience: string;
  skills: string[];
  projects: string;
  goals: string;
  target_audience: string;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  type: GenerationType;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  feedback: boolean | null;
  credits_used: number;
  created_at: string;
}

export interface UserCredits {
  user_id: string;
  total_generations: number;
  plan: "free" | "pro";
  created_at: string;
  updated_at: string;
}
