import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a fallback client for build time when env vars might not be available
let supabase: ReturnType<typeof createClient>

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co") {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Create a mock client for build time
  supabase = createClient("https://placeholder.supabase.co", "placeholder-anon-key")

  // Only log the warning in the browser (not during build)
  if (typeof window !== "undefined") {
    console.warn("Supabase environment variables are missing. Using placeholder client.")
  }
}

export { supabase }
