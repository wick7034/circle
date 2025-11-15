import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  x_username: string;
  privacy_answer: string;
  created_at: string;
  position_angle: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  order: number;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  answers: number[];
  created_at: string;
};
