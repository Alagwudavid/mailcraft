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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Function to generate username on client side as fallback
function generatePublicUsername(): string {
  const letters = Array.from({ length: 3 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join("")

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

  const fetchOrCreateProfile = async (userId: string) => {
    try {
      // First, try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (existingProfile && !fetchError) {
        setProfile(existingProfile)
        return
      }

      // If no profile exists, create one
      const newUsername = generatePublicUsername()
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          public_username: newUsername,
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating profile:", createError)
        // Try with a different username if there's a conflict
        const fallbackUsername = `${newUsername}-${Date.now()}`
        const { data: fallbackProfile, error: fallbackError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            public_username: fallbackUsername,
          })
          .select()
          .single()

        if (fallbackError) {
          console.error("Error creating fallback profile:", fallbackError)
          return
        }
        setProfile(fallbackProfile)
      } else {
        setProfile(newProfile)
      }
    } catch (error) {
      console.error("Error in fetchOrCreateProfile:", error)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        await fetchOrCreateProfile(user.id)
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchOrCreateProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>
}
