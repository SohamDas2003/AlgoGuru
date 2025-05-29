import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: "admin" | "user"
          avatar: string | null
          streak: number
          preferences: {
            theme: "light" | "dark" | "system"
            language: "cpp" | "python" | "java"
            notifications: boolean
          }
          stats: {
            problemsSolved: number
            totalSubmissions: number
            accuracy: number
            rank: number
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: "admin" | "user"
          avatar?: string | null
          streak?: number
          preferences?: {
            theme: "light" | "dark" | "system"
            language: "cpp" | "python" | "java"
            notifications: boolean
          }
          stats?: {
            problemsSolved: number
            totalSubmissions: number
            accuracy: number
            rank: number
          }
        }
        Update: {
          name?: string
          avatar?: string | null
          streak?: number
          preferences?: {
            theme: "light" | "dark" | "system"
            language: "cpp" | "python" | "java"
            notifications: boolean
          }
          stats?: {
            problemsSolved: number
            totalSubmissions: number
            accuracy: number
            rank: number
          }
          updated_at?: string
        }
      }
      problems: {
        Row: {
          id: string
          title: string
          difficulty: "Easy" | "Medium" | "Hard"
          category: string
          description: string
          examples: any[]
          constraints: string[]
          starter_code: Record<string, string>
          test_cases: any[]
          tags: string[]
          created_by: string | null
          created_at: string
          updated_at: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          code: string
          language: "cpp" | "python" | "java"
          status: "accepted" | "wrong_answer" | "time_limit" | "runtime_error"
          execution_time: number | null
          memory: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          problem_id: string
          code: string
          language: "cpp" | "python" | "java"
          status: "accepted" | "wrong_answer" | "time_limit" | "runtime_error"
          execution_time?: number | null
          memory?: number | null
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          status: "solved" | "attempted" | "not_attempted"
          best_submission: string | null
          attempts: number
          last_attempt_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          problem_id: string
          status: "solved" | "attempted" | "not_attempted"
          best_submission?: string | null
          attempts?: number
          last_attempt_at?: string | null
        }
        Update: {
          status?: "solved" | "attempted" | "not_attempted"
          best_submission?: string | null
          attempts?: number
          last_attempt_at?: string | null
          updated_at?: string
        }
      }
    }
  }
}
