"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
  joinedAt: string
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
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database with live data
const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@algoguru.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-01-01T00:00:00Z",
    streak: 15,
    preferences: {
      theme: "dark",
      language: "cpp",
      notifications: true,
    },
    stats: {
      problemsSolved: 50,
      totalSubmissions: 75,
      accuracy: 85,
      rank: 1,
    },
  },
  {
    id: "user-1",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-01-15T00:00:00Z",
    streak: 7,
    preferences: {
      theme: "light",
      language: "python",
      notifications: true,
    },
    stats: {
      problemsSolved: 12,
      totalSubmissions: 20,
      accuracy: 75,
      rank: 156,
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Simulate live data updates
        const updatedUser = {
          ...parsedUser,
          stats: {
            ...parsedUser.stats,
            // Simulate real-time updates
            problemsSolved: parsedUser.stats.problemsSolved + Math.floor(Math.random() * 2),
            totalSubmissions: parsedUser.stats.totalSubmissions + Math.floor(Math.random() * 3),
          },
        }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockCredentials = [
      { email: "admin@algoguru.com", password: "admin123" },
      { email: "user@example.com", password: "user123" },
    ]

    const validCredential = mockCredentials.find((cred) => cred.email === email && cred.password === password)

    if (validCredential) {
      const foundUser = mockUsers.find((u) => u.email === email)
      if (foundUser) {
        // Add live data updates
        const userWithLiveData = {
          ...foundUser,
          stats: {
            ...foundUser.stats,
            problemsSolved: foundUser.stats.problemsSolved + Math.floor(Math.random() * 2),
            totalSubmissions: foundUser.stats.totalSubmissions + Math.floor(Math.random() * 3),
          },
        }
        setUser(userWithLiveData)
        localStorage.setItem("user", JSON.stringify(userWithLiveData))
        setIsLoading(false)
        return { success: true }
      }
    }

    setIsLoading(false)
    return { success: false, error: "Invalid email or password" }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      setIsLoading(false)
      return { success: false, error: "User with this email already exists" }
    }

    // Create new user with live data initialization
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "user",
      avatar: `/placeholder.svg?height=40&width=40`,
      joinedAt: new Date().toISOString(),
      streak: 0,
      preferences: {
        theme: "system",
        language: "python",
        notifications: true,
      },
      stats: {
        problemsSolved: 0,
        totalSubmissions: 0,
        accuracy: 0,
        rank: mockUsers.length + 1,
      },
    }

    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Update in mock database
      const userIndex = mockUsers.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
