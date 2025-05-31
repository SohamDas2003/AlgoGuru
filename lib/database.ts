"use client"

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
  starterCode: {
    cpp: string
    python: string
    java: string
  }
  testCases: Array<{
    input: string
    expectedOutput: string
    isHidden?: boolean
  }>
  createdAt: string
  createdBy: string
  tags: string[]
}

export interface Submission {
  id: string
  userId: string
  problemId: string
  code: string
  language: "cpp" | "python" | "java"
  status: "accepted" | "wrong_answer" | "time_limit" | "runtime_error"
  submittedAt: string
  executionTime?: number
  memory?: number
}

export interface UserProgress {
  userId: string
  problemId: string
  status: "solved" | "attempted" | "not_attempted"
  bestSubmission?: string
  attempts: number
  lastAttemptAt?: string
}

// Database operations
export const db = {
  // Problems
  async getProblems(): Promise<Problem[]> {
    try {
      const { data, error } = await supabase.from("problems").select("*").order("created_at", { ascending: false })

      if (error) throw error

      return data.map((problem) => ({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        description: problem.description,
        examples: problem.examples || [],
        constraints: problem.constraints || [],
        starterCode: problem.starter_code || { cpp: "", python: "", java: "" },
        testCases: problem.test_cases || [],
        createdAt: problem.created_at,
        createdBy: problem.created_by,
        tags: problem.tags || [],
      }))
    } catch (error) {
      console.error("Error fetching problems:", error)
      return []
    }
  },

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
        examples: data.examples || [],
        constraints: data.constraints || [],
        starterCode: data.starter_code || { cpp: "", python: "", java: "" },
        testCases: data.test_cases || [],
        createdAt: data.created_at,
        createdBy: data.created_by,
        tags: data.tags || [],
      }
    } catch (error) {
      console.error("Error fetching problem:", error)
      return null
    }
  },

  async createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<Problem> {
    try {
      const { data, error } = await supabase
        .from("problems")
        .insert({
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          description: problem.description,
          examples: problem.examples,
          constraints: problem.constraints,
          starter_code: problem.starterCode,
          test_cases: problem.testCases,
          tags: problem.tags,
          created_by: problem.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        difficulty: data.difficulty,
        category: data.category,
        description: data.description,
        examples: data.examples || [],
        constraints: data.constraints || [],
        starterCode: data.starter_code || { cpp: "", python: "", java: "" },
        testCases: data.test_cases || [],
        createdAt: data.created_at,
        createdBy: data.created_by,
        tags: data.tags || [],
      }
    } catch (error) {
      console.error("Error creating problem:", error)
      throw error
    }
  },

  async updateProblem(id: string, updates: Partial<Problem>): Promise<Problem | null> {
    try {
      const { data, error } = await supabase
        .from("problems")
        .update({
          title: updates.title,
          difficulty: updates.difficulty,
          category: updates.category,
          description: updates.description,
          examples: updates.examples,
          constraints: updates.constraints,
          starter_code: updates.starterCode,
          test_cases: updates.testCases,
          tags: updates.tags,
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        difficulty: data.difficulty,
        category: data.category,
        description: data.description,
        examples: data.examples || [],
        constraints: data.constraints || [],
        starterCode: data.starter_code || { cpp: "", python: "", java: "" },
        testCases: data.test_cases || [],
        createdAt: data.created_at,
        createdBy: data.created_by,
        tags: data.tags || [],
      }
    } catch (error) {
      console.error("Error updating problem:", error)
      return null
    }
  },

  async deleteProblem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("problems").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting problem:", error)
      return false
    }
  },

  // Submissions
  async createSubmission(submission: Omit<Submission, "id" | "submittedAt">): Promise<Submission> {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .insert({
          user_id: submission.userId,
          problem_id: submission.problemId,
          code: submission.code,
          language: submission.language,
          status: submission.status,
          execution_time: submission.executionTime,
          memory: submission.memory,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        userId: data.user_id,
        problemId: data.problem_id,
        code: data.code,
        language: data.language,
        status: data.status,
        submittedAt: data.submitted_at,
        executionTime: data.execution_time,
        memory: data.memory,
      }
    } catch (error) {
      console.error("Error creating submission:", error)
      throw error
    }
  },

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false })

      if (error) throw error

      return data.map((submission) => ({
        id: submission.id,
        userId: submission.user_id,
        problemId: submission.problem_id,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        submittedAt: submission.submitted_at,
        executionTime: submission.execution_time,
        memory: submission.memory,
      }))
    } catch (error) {
      console.error("Error fetching user submissions:", error)
      return []
    }
  },

  async getProblemSubmissions(problemId: string): Promise<Submission[]> {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("problem_id", problemId)
        .order("submitted_at", { ascending: false })

      if (error) throw error

      return data.map((submission) => ({
        id: submission.id,
        userId: submission.user_id,
        problemId: submission.problem_id,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        submittedAt: submission.submitted_at,
        executionTime: submission.execution_time,
        memory: submission.memory,
      }))
    } catch (error) {
      console.error("Error fetching problem submissions:", error)
      return []
    }
  },

  // User Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", userId)

      if (error) throw error

      return data.map((progress) => ({
        userId: progress.user_id,
        problemId: progress.problem_id,
        status: progress.status,
        bestSubmission: progress.best_submission,
        attempts: progress.attempts,
        lastAttemptAt: progress.last_attempt_at,
      }))
    } catch (error) {
      console.error("Error fetching user progress:", error)
      return []
    }
  },

  async updateUserProgress(userId: string, problemId: string, status: UserProgress["status"]): Promise<void> {
    try {
      const { error } = await supabase.from("user_progress").upsert({
        user_id: userId,
        problem_id: problemId,
        status,
        attempts: 1,
        last_attempt_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (error) {
      console.error("Error updating user progress:", error)
    }
  },

  // Analytics
  async getUserStats(userId: string) {
    try {
      const [progressData, submissionsData, problemsData] = await Promise.all([
        supabase.from("user_progress").select("*").eq("user_id", userId),
        supabase.from("submissions").select("*").eq("user_id", userId),
        supabase.from("problems").select("id"),
      ])

      const progress = progressData.data || []
      const submissions = submissionsData.data || []
      const totalProblems = problemsData.data?.length || 0

      return {
        totalProblems,
        solvedProblems: progress.filter((p) => p.status === "solved").length,
        attemptedProblems: progress.filter((p) => p.status === "attempted").length,
        totalSubmissions: submissions.length,
        acceptedSubmissions: submissions.filter((s) => s.status === "accepted").length,
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
  },

  async getAllUserStats() {
    try {
      const { data: users, error } = await supabase.from("users").select("id")

      if (error) throw error

      const stats = await Promise.all(
        users.map(async (user) => ({
          userId: user.id,
          ...(await this.getUserStats(user.id)),
        })),
      )

      return stats
    } catch (error) {
      console.error("Error fetching all user stats:", error)
      return []
    }
  },
}
