export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          role: string | null;
          experience: string | null;
          skills: string[] | null;
          projects: string | null;
          goals: string | null;
          target_audience: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          role?: string;
          experience?: string;
          skills?: string[];
          projects?: string;
          goals?: string;
          target_audience?: string;
        };
        Update: {
          name?: string;
          role?: string;
          experience?: string;
          skills?: string[];
          projects?: string;
          goals?: string;
          target_audience?: string;
          updated_at?: string;
        };
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          input: Json;
          output: Json;
          feedback: boolean | null;
          credits_used: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          input: Json;
          output: Json;
          feedback?: boolean | null;
          credits_used?: number;
        };
        Update: {
          feedback?: boolean | null;
        };
      };
      user_credits: {
        Row: {
          user_id: string;
          total_generations: number;
          plan: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_generations?: number;
          plan?: string;
        };
        Update: {
          total_generations?: number;
          plan?: string;
          updated_at?: string;
        };
      };
    };
  };
}
