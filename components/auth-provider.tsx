"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  public_username: string
  display_name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Simple username generator for client-side fallback
function generateUsername(): string {
  const letters = Array.from({ length: 3 }, () => {
    const isUpper = Math.random() > 0.5
    const charCode = isUpper ? 65 + Math.floor(Math.random() * 26) : 97 + Math.floor(Math.random() * 26)
    return String.fromCharCode(charCode)
  }).join("")

  const numbers = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `user-${letters}${numbers}`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = async (userId: string, retries = 3): Promise<Profile | null> => {
    for (let i = 0; i < retries; i++) {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

        if (data && !error) {
          return data
        }

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found", other errors should be logged
          console.error(`Error fetching profile (attempt ${i + 1}):`, error)
        }

        // Wait before retrying
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
        }
      } catch (error) {
        console.error(`Error in fetchProfile (attempt ${i + 1}):`, error)
      }
    }
    return null
  }

  const createProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const username = generateUsername()
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          public_username: username,
        })
        .select()
        .single()

      if (data && !error) {
        return data
      }

      // If username conflict, try with timestamp
      if (error?.code === "23505") {
        const fallbackUsername = `${username}-${Date.now()}`
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            public_username: fallbackUsername,
          })
          .select()
          .single()

        if (fallbackData && !fallbackError) {
          return fallbackData
        }
        console.error("Error creating fallback profile:", fallbackError)
      } else {
        console.error("Error creating profile:", error)
      }
    } catch (error) {
      console.error("Error in createProfile:", error)
    }
    return null
  }

  const refreshProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      let userProfile = await fetchProfile(user.id)

      // If no profile exists, try to create one
      if (!userProfile) {
        console.log("No profile found, creating one...")
        userProfile = await createProfile(user.id)
      }

      setProfile(userProfile)
    } catch (error) {
      console.error("Error in refreshProfile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user)

        if (user) {
          await refreshProfile()
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Give database trigger time to complete, then refresh
        setTimeout(async () => {
          await refreshProfile()
        }, 2000)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>{children}</AuthContext.Provider>
  )
}
