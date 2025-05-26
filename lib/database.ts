"use client"

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

// Mock database storage
const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    starterCode: {
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};`,
      python: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`,
    },
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "[0,1]",
        isHidden: true,
      },
    ],
    createdAt: "2024-01-01",
    createdBy: "admin",
    tags: ["array", "hash-table"],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character."],
    starterCode: {
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here
        
    }
};`,
      python: `def reverse_string(s):
    """
    :type s: List[str]
    :rtype: None Do not return anything, modify s in-place instead.
    """
    # Your code here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
        
    }
}`,
    },
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
      },
    ],
    createdAt: "2024-01-02",
    createdBy: "admin",
    tags: ["string", "two-pointers"],
  },
]

const submissions: Submission[] = []
const userProgress: UserProgress[] = []

// Database operations
export const db = {
  // Problems
  async getProblems(): Promise<Problem[]> {
    return [...problems]
  },

  async getProblem(id: string): Promise<Problem | null> {
    return problems.find((p) => p.id === id) || null
  },

  async createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<Problem> {
    const newProblem: Problem = {
      ...problem,
      id: `problem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    problems.push(newProblem)
    return newProblem
  },

  async updateProblem(id: string, updates: Partial<Problem>): Promise<Problem | null> {
    const index = problems.findIndex((p) => p.id === id)
    if (index === -1) return null

    problems[index] = { ...problems[index], ...updates }
    return problems[index]
  },

  async deleteProblem(id: string): Promise<boolean> {
    const index = problems.findIndex((p) => p.id === id)
    if (index === -1) return false

    problems.splice(index, 1)
    return true
  },

  // Submissions
  async createSubmission(submission: Omit<Submission, "id" | "submittedAt">): Promise<Submission> {
    const newSubmission: Submission = {
      ...submission,
      id: `submission-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    }
    submissions.push(newSubmission)
    return newSubmission
  },

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return submissions.filter((s) => s.userId === userId)
  },

  async getProblemSubmissions(problemId: string): Promise<Submission[]> {
    return submissions.filter((s) => s.problemId === problemId)
  },

  // User Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return userProgress.filter((p) => p.userId === userId)
  },

  async updateUserProgress(userId: string, problemId: string, status: UserProgress["status"]): Promise<void> {
    const existingProgress = userProgress.find((p) => p.userId === userId && p.problemId === problemId)

    if (existingProgress) {
      existingProgress.status = status
      existingProgress.attempts += 1
      existingProgress.lastAttemptAt = new Date().toISOString()
    } else {
      userProgress.push({
        userId,
        problemId,
        status,
        attempts: 1,
        lastAttemptAt: new Date().toISOString(),
      })
    }
  },

  // Analytics
  async getUserStats(userId: string) {
    const progress = await this.getUserProgress(userId)
    const userSubmissions = await this.getUserSubmissions(userId)

    return {
      totalProblems: problems.length,
      solvedProblems: progress.filter((p) => p.status === "solved").length,
      attemptedProblems: progress.filter((p) => p.status === "attempted").length,
      totalSubmissions: userSubmissions.length,
      acceptedSubmissions: userSubmissions.filter((s) => s.status === "accepted").length,
    }
  },

  async getAllUserStats() {
    const allUsers = Array.from(new Set(userProgress.map((p) => p.userId)))
    const stats = await Promise.all(
      allUsers.map(async (userId) => ({
        userId,
        ...(await this.getUserStats(userId)),
      })),
    )
    return stats
  },
}
