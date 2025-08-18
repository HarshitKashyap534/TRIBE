"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

// Add username uniqueness check to create profile page
const checkUsernameUniqueness = async (username: string) => {
  const { data, error } = await supabase.from("profiles").select("name").eq("name", username).single()

  if (error && error.code === "PGRST116") {
    // No matching username found, so it's unique
    return true
  } else if (data) {
    // Username already exists
    return false
  }

  // In case of other errors, assume it's not unique to be safe
  return false
}

export default function CreateProfile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [loadingProfile, setLoading] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [existingUsernames, setExistingUsernames] = useState<string[]>([])

  // Define functions before any early returns to avoid TDZ issues in effects
  const fetchExistingUsernames = async () => {
    try {
      // Only proceed if we have a valid user
      if (!user?.id) {
        console.log("No user available, skipping username fetch")
        return
      }

      const { data, error } = await supabase.from("profiles").select("name")

      if (error) throw error

      const usernames = data.map((item) => item.name.toLowerCase())
      setExistingUsernames(usernames)
    } catch (error) {
      console.error("Error fetching usernames:", error)
      // Don't show error to user for this background operation
      setExistingUsernames([])
    }
  }

  const checkProfile = async () => {
    if (user) {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      if (data && data.name) {
        // Profile exists and has a name
        router.push("/")
      }
    }
  }

  const validateUsername = (username: string) => {
    setNameError(null)

    if (!username.trim()) {
      setNameError("Name is required")
      return false
    }

    // Check if username already exists (case insensitive)
    if (existingUsernames.includes(username.toLowerCase())) {
      setNameError("This username is already taken by someone in your network")
      return false
    }

    return true
  }

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)
    validateUsername(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateUsername(name)) {
      return
    }

    setLoading(true)

    try {
      const isUnique = await checkUsernameUniqueness(name)
      if (!isUnique) {
        setNameError("This username is already taken. Please choose a different one.")
        setLoading(false)
        return
      }

      if (!user) throw new Error("No user found")

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        name,
        updated_at: new Date(),
      })

      if (error) throw error

      router.push("/")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      checkProfile()
      fetchExistingUsernames()
    }
  }, [user])

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">What's your name? (We recommend using your real name)</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className={`h-10 ${nameError ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {nameError && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {nameError}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                This is how you'll appear to others.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading || !!nameError}>
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
