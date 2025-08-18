"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
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
  // Use refs to track state without triggering re-renders
  const userRef = useRef<User | null>(null)
  const profileRef = useRef<Profile | null>(null)
  const [user, _setUser] = useState<User | null>(null)
  const [profile, _setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Wrapper functions to keep refs in sync with state
  const setUser = (user: User | null) => {
    userRef.current = user
    _setUser(user)
  }
  
  const setProfile = (profile: Profile | null) => {
    profileRef.current = profile
    _setProfile(profile)
  }
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let isMounted = true
    let subscription: { unsubscribe: () => void } | null = null

    const initializeAuth = async () => {
      // Check if we have valid Supabase configuration
      const hasValidConfig =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"

      if (!hasValidConfig) {
        console.warn("Supabase not configured properly")
        setLoading(false)
        return
      }

      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (error) throw error

        if (session?.user) {
          setUser(session.user)
          
          // Only fetch profile if we don't have it or if the user ID changed
          if (!profileRef.current || profileRef.current.id !== session.user.id) {
            await fetchProfile(session.user.id, true)
          }
          
          // If we're on auth page, redirect to home
          if (pathname === "/auth") {
            router.push("/")
          }
        } else {
          setUser(null)
          setProfile(null)
          if (pathname !== "/auth") {
            router.push("/auth")
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }

      // Set up auth state change listener
      const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return

        if (session?.user) {
          setUser(session.user)
          
          // Only fetch profile if we don't have it or if the user ID changed
          if (!profileRef.current || profileRef.current.id !== session.user.id) {
            await fetchProfile(session.user.id, true)
          }
          
          // If we're on auth page, redirect to home
          if (pathname === "/auth") {
            router.push("/")
          }
        } else {
          setUser(null)
          setProfile(null)
          if (pathname !== "/auth") {
            router.push("/auth")
          }
        }
      })
      
      subscription = authListener
    }

    initializeAuth()

    return () => {
      isMounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router, pathname])

  const fetchProfile = async (userId: string, force = false) => {
    // If we already have the profile and not forcing a refresh, skip
    if (profileRef.current?.id === userId && !force) {
      return
    }

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single<Profile>()

      if (error) {
        // If no profile exists and we're not on create-profile page
        if (error.code === "PGRST116" && !pathname.includes("create-profile")) {
          router.push("/create-profile")
        } else if (error.code !== "PGRST116") {
          console.error("Error fetching profile:", error)
        }
        return
      }

      if (data) {
        setProfile(data)
        // If we're on create-profile page but already have a profile, redirect to home
        if (pathname.includes("create-profile")) {
          router.push("/")
        }
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
