"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  name: string
  email: string
  major?: string
  year?: string
  interests?: string
  bio?: string
  avatar?: string
  created_at: string
  updated_at: string
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

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we have valid Supabase configuration
    const hasValidConfig =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"

    if (!hasValidConfig) {
      if (typeof window !== "undefined") {
        console.warn("Supabase not configured properly")
      }
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          // Only fetch profile if we don't have it or if the user ID changed
          if (!profile || profile.id !== session.user.id) {
            await fetchProfile(session.user.id, true)
          }
          
          // If we're on auth page and have a profile, redirect to home
          if (pathname === "/auth" && profile) {
            router.push("/")
          }
        } else {
          setUser(null)
          setProfile(null)
          // Only redirect to auth if not already on auth page
          if (pathname !== "/auth") {
            router.push("/auth")
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        // Only fetch profile if we don't have it or if the user ID changed
        if (!profile || profile.id !== session.user.id) {
          await fetchProfile(session.user.id, true)
        }

        // Only redirect if not on auth page and we have a profile
        if (pathname === "/auth" && profile) {
          router.push("/")
        }
      } else {
        setUser(null)
        setProfile(null)
        if (pathname !== "/auth") {
          router.push("/auth")
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router, pathname, profile])

  const fetchProfile = async (userId: string, force = false) => {
    // If we already have the profile and not forcing a refresh, skip
    if (profile?.id === userId && !force) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single<Profile>()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        setLoading(false)
        return
      }

      if (data) {
        setProfile(data)
        // If we have a profile and we're on create-profile page, redirect to home
        if (pathname === "/create-profile" || pathname === "/(main)/create-profile") {
          router.push("/")
        }
      } else if (pathname === "/auth" || pathname === "/auth/") {
        // Only redirect to create-profile if user just came from auth page
        router.push("/create-profile")
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error)
      // Ensure loading is set to false on error
      setLoading(false)
    } finally {
      // Always ensure loading is set to false when done
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>
}
