import { supabase } from "./supabase"

export interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  starterCode: Record<string, string>
  testCases: Array<{
    input: string
    expectedOutput: string
    isHidden?: boolean
  }>
  tags: string[]
}

export interface Submission {
  id: string
  userId: string
  problemId: string
  code: string
  language: "cpp" | "python" | "java"
  status: "accepted" | "wrong_answer" | "time_limit" | "runtime_error"
  executionTime?: number
  memory?: number
  createdAt: string
}

export interface UserProgress {
  problemId: string
  status: "solved" | "attempted" | "not_attempted"
  attempts: number
  lastAttemptAt?: string
  bestSubmission?: string
}

export interface UserStats {
  totalProblems: number
  solvedProblems: number
  attemptedProblems: number
  totalSubmissions: number
  acceptedSubmissions: number
}

class Database {
  async getProblems(): Promise<Problem[]> {
    try {
      const { data, error } = await supabase.from("problems").select("*").order("created_at", { ascending: true })

      if (error) throw error

      return data.map((problem) => ({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints,
        starterCode: problem.starter_code,
        testCases: problem.test_cases,
        tags: problem.tags,
      }))
    } catch (error) {
      console.error("Error fetching problems:", error)
      return []
    }
  }

  async getProblem(id: string): Promise<Problem | null> {
    try {
      const { data, error } = await supabase.from("problems").select("*").eq("id", id).single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        difficulty: data.difficulty,
        category: data.category,
        description: data.description,
        examples: data.examples,
        constraints: data.constraints,
        starterCode: data.starter_code,
        testCases: data.test_cases,
        tags: data.tags,
      }
    } catch (error) {
      console.error("Error fetching problem:", error)
      return null
    }
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId)

      if (error) throw error

      return data.map((progress) => ({
        problemId: progress.problem_id,
        status: progress.status,
        attempts: progress.attempts,
        lastAttemptAt: progress.last_attempt_at,
        bestSubmission: progress.best_submission,
      }))
    } catch (error) {
      console.error("Error fetching user progress:", error)
      return []
    }
  }

  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get total problems count
      const { count: totalProblems } = await supabase.from("problems").select("*", { count: "exact", head: true })

      // Get user progress
      const { data: progressData } = await supabase.from("user_progress").select("status").eq("user_id", userId)

      // Get user submissions
      const { data: submissionsData } = await supabase.from("submissions").select("status").eq("user_id", userId)

      const solvedProblems = progressData?.filter((p) => p.status === "solved").length || 0
      const attemptedProblems = progressData?.filter((p) => p.status === "attempted").length || 0
      const totalSubmissions = submissionsData?.length || 0
      const acceptedSubmissions = submissionsData?.filter((s) => s.status === "accepted").length || 0

      return {
        totalProblems: totalProblems || 0,
        solvedProblems,
        attemptedProblems,
        totalSubmissions,
        acceptedSubmissions,
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
      return {
        totalProblems: 0,
        solvedProblems: 0,
        attemptedProblems: 0,
        totalSubmissions: 0,
        acceptedSubmissions: 0,
      }
    }
  }

  async submitCode(
    userId: string,
    problemId: string,
    code: string,
    language: "cpp" | "python" | "java",
  ): Promise<{ success: boolean; submissionId?: string; status?: string }> {
    try {
      // Simulate code execution (in a real app, this would run the code against test cases)
      const status = Math.random() > 0.3 ? "accepted" : "wrong_answer"
      const executionTime = Math.floor(Math.random() * 1000) + 50
      const memory = Math.floor(Math.random() * 50) + 10

      // Insert submission
      const { data: submission, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          user_id: userId,
          problem_id: problemId,
          code,
          language,
          status,
          execution_time: executionTime,
          memory,
        })
        .select()
        .single()

      if (submissionError) throw submissionError

      // Update user progress
      const progressStatus = status === "accepted" ? "solved" : "attempted"

      const { error: progressError } = await supabase.from("user_progress").upsert({
        user_id: userId,
        problem_id: problemId,
        status: progressStatus,
        attempts: 1, // This should increment existing attempts
        last_attempt_at: new Date().toISOString(),
        best_submission: status === "accepted" ? submission.id : undefined,
      })

      if (progressError) throw progressError

      // Update user stats if solved
      if (status === "accepted") {
        const { data: userData } = await supabase.from("users").select("stats").eq("id", userId).single()

        if (userData) {
          const newStats = {
            ...userData.stats,
            problemsSolved: userData.stats.problemsSolved + 1,
            totalSubmissions: userData.stats.totalSubmissions + 1,
          }

          await supabase.from("users").update({ stats: newStats }).eq("id", userId)
        }
      }

      return {
        success: true,
        submissionId: submission.id,
        status,
      }
    } catch (error) {
      console.error("Error submitting code:", error)
      return { success: false }
    }
  }

  async getSubmissions(userId: string, problemId?: string): Promise<Submission[]> {
    try {
      let query = supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (problemId) {
        query = query.eq("problem_id", problemId)
      }

      const { data, error } = await query

      if (error) throw error

      return data.map((submission) => ({
        id: submission.id,
        userId: submission.user_id,
        problemId: submission.problem_id,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        executionTime: submission.execution_time,
        memory: submission.memory,
        createdAt: submission.created_at,
      }))
    } catch (error) {
      console.error("Error fetching submissions:", error)
      return []
    }
  }
}

export const db = new Database()
