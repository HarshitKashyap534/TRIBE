"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { PostComposer } from "@/components/post-composer"
import { PostFeed } from "@/components/post-feed"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SplashScreen } from "@/components/splash-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ExternalLink, RefreshCw } from "lucide-react"

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key && url !== "https://placeholder.supabase.co" && key !== "placeholder-anon-key"
}

// Configuration missing component
function ConfigurationMissing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Configuration Required</CardTitle>
              <p className="text-muted-foreground">Supabase environment variables are missing</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between bg-background rounded px-3 py-2">
                <span>NEXT_PUBLIC_SUPABASE_URL</span>
                <span className="text-red-500">Missing</span>
              </div>
              <div className="flex items-center justify-between bg-background rounded px-3 py-2">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <span className="text-red-500">Missing</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">To fix this:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to your Vercel dashboard</li>
              <li>Navigate to your project settings</li>
              <li>Go to Environment Variables</li>
              <li>Add the missing variables with your Supabase credentials</li>
              <li>Redeploy your application</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button asChild className="rounded-full">
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Vercel Dashboard
              </a>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full">
              Refresh Page
            </Button>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/30 rounded p-3">
            <strong>Your Supabase credentials:</strong>
            <br />
            URL: https://fswemcamuqdhzgqbhqcw.supabase.co
            <br />
            ANON KEY:
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzd2VtY2FtdXFkaHpncWJocWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMzIzNzUsImV4cCI6MjA1MDcwODM3NX0.FcB-o78D7M4_9HAyR4zHRh1iOLke4V4XgRTC27lV_2Q
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Home() {
  const { user, profile, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()

  const fetchPosts = async (isRetry = false) => {
    if (!user || !profile) return

    try {
      setLoading(true)
      setError(null)

      // Multiple retry attempts with exponential backoff
      const maxRetries = 3
      let attempt = 0
      let data = null

      while (attempt < maxRetries) {
        try {
          const { data: fetchedData, error: fetchError } = await supabase
            .from("posts")
            .select(`
              *,
              profiles:profiles(id, name, avatar, is_verified),
              likes:likes(count),
              dislikes:dislikes(count),
              comments:comments(count)
            `)
            .order("created_at", { ascending: false })
            .limit(20)

          if (fetchError) throw fetchError
          data = fetchedData
          break
        } catch (err) {
          attempt++
          if (attempt === maxRetries) throw err
          // Wait before retry (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }

      if (data) {
        setPosts(
          data.map((post) => ({
            ...post,
            likes: post.likes[0]?.count || 0,
            dislikes: post.dislikes[0]?.count || 0,
            comments: post.comments[0]?.count || 0,
          })),
        )
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to load posts. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && profile) {
      fetchPosts()
    } else if (user && !profile) {
      router.push("/create-profile")
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, profile, router, authLoading])

  const addPost = async (content: string, imageUrl: string | null = null) => {
    try {
      if (!user) throw new Error("No user found")

      const postData = {
        content,
        user_id: user.id,
        ...(imageUrl && { image_url: imageUrl }),
      }

      const { data, error } = await supabase
        .from("posts")
        .insert(postData)
        .select(`
          *,
          profiles:profiles(id, name, avatar, is_verified)
        `)
        .single()

      if (error) throw error

      const newPostData = { ...data, likes: 0, dislikes: 0, comments: 0 }
      setNewPost(newPostData)
    } catch (error) {
      console.error("Error adding post:", error)
      setError("Failed to create post. Please try again.")
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    fetchPosts(true)
  }

  if (authLoading || (user && !profile && loading))
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )

  if (!user) return null

  if (error) {
    return (
      <div className="p-4 text-center space-y-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={handleRetry} variant="outline" className="rounded-full flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <>
      <SplashScreen />
      <div className="max-w-lg mx-auto space-y-4 p-4 pb-20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Home</h1>
        </div>
        <PostComposer onPost={addPost} />
        <PostFeed initialPosts={posts} newPosts={newPost} />
      </div>
    </>
  )
}
