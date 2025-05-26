"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  avatar?: string
  joinedAt: string
  problemsSolved: number
  totalSubmissions: number
  streak: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock database - In production, this would be replaced with actual database calls
const mockUsers: Record<string, User & { password: string }> = {
  "admin@algoguru.com": {
    id: "1",
    email: "admin@algoguru.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-01-01",
    problemsSolved: 0,
    totalSubmissions: 0,
    streak: 0,
  },
  "user@example.com": {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "John Doe",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-01-15",
    problemsSolved: 12,
    totalSubmissions: 25,
    streak: 5,
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("algoguru_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("algoguru_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = mockUsers[email]
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false)
      return { success: false, error: "Invalid email or password" }
    }

    const { password: _, ...userWithoutPassword } = mockUser
    setUser(userWithoutPassword)
    localStorage.setItem("algoguru_user", JSON.stringify(userWithoutPassword))
    setIsLoading(false)

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("algoguru_user")
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("algoguru_user", JSON.stringify(updatedUser))

    // In production, this would update the database
    if (mockUsers[user.email]) {
      Object.assign(mockUsers[user.email], data)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>{children}</AuthContext.Provider>
  )
}
