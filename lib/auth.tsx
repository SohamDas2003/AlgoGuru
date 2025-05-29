"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "./supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string | null
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
  joinedAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchUserProfile(session.user)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await fetchUserProfile(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
          streak: data.streak,
          preferences: data.preferences,
          stats: data.stats,
          joinedAt: data.created_at,
        })
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        await fetchUserProfile(data.user)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // The user profile will be created automatically by the trigger
        return { success: true }
      }

      return { success: false, error: "Registration failed" }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: updates.name,
          avatar: updates.avatar,
          preferences: updates.preferences,
          stats: updates.stats,
          streak: updates.streak,
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating user:", error)
        return
      }

      setUser({ ...user, ...updates })
    } catch (error) {
      console.error("Error updating user:", error)
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
