"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "./supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase.from("users").select("*").eq("id", supabaseUser.id).single()

      if (error && error.code === "PGRST116") {
        // User doesn't exist, create profile
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email!.split("@")[0],
          role: "user",
          avatar_url: supabaseUser.user_metadata?.avatar_url,
        }

        const { data: createdProfile, error: createError } = await supabase
          .from("users")
          .insert(newProfile)
          .select()
          .single()

        if (createError) throw createError

        setUser({
          id: createdProfile.id,
          name: createdProfile.name,
          email: createdProfile.email,
          role: createdProfile.role,
          avatar: createdProfile.avatar_url,
          joinedAt: createdProfile.created_at,
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
            rank: 0,
          },
        })
      } else if (profile) {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatar: profile.avatar_url,
          joinedAt: profile.created_at,
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
            rank: 0,
          },
        })
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
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

      return { success: true }
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
          avatar_url: updates.avatar,
        })
        .eq("id", user.id)

      if (!error) {
        setUser({ ...user, ...updates })
      }
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
