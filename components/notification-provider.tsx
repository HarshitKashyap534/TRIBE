"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"

type NotificationContextType = {
  notificationsEnabled: boolean
  enableNotifications: () => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType>({
  notificationsEnabled: false,
  enableNotifications: async () => false,
})

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const { user } = useAuth()
  const channelsRef = useRef<any[]>([])

  // Function to request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  }

  // Function to show a notification
  const showNotification = (title: string, options: NotificationOptions = {}) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    try {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      })

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  }

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    return granted
  }

  useEffect(() => {
    // Check if notifications are already enabled
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationsEnabled(true)
    }
  }, [])

  useEffect(() => {
    // Check if we have valid Supabase configuration
    const hasValidConfig =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"

    if (!user || !notificationsEnabled || !hasValidConfig) return

    // Clean up any existing subscriptions
    channelsRef.current.forEach((channel) => {
      supabase.removeChannel(channel)
    })
    channelsRef.current = []

    try {
      // Create subscription for new posts
      const postsChannel = supabase
        .channel(`posts-notifications-${user.id}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "posts",
          },
          async (payload) => {
            if (payload.new && payload.new.user_id !== user.id) {
              // Get the profile name of the poster
              const { data: profile } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", payload.new.user_id)
                .single()

              showNotification("New Post on Tribe", {
                body: `${profile?.name || "Someone"} just shared something new!`,
                tag: "new-post",
              })
            }
          },
        )
        .subscribe()

      // Create subscription for new confessions
      const confessionsChannel = supabase
        .channel(`confessions-notifications-${user.id}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "confessions",
          },
          () => {
            showNotification("New Anonymous Post", {
              body: "Someone just shared a new confession!",
              tag: "new-confession",
            })
          },
        )
        .subscribe()

      // Create subscription for likes on your posts
      const likesChannel = supabase
        .channel(`likes-notifications-${user.id}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "likes",
          },
          async (payload) => {
            if (payload.new && payload.new.user_id !== user.id) {
              // Check if the liked post belongs to the current user
              const { data: post } = await supabase
                .from("posts")
                .select("user_id")
                .eq("id", payload.new.post_id)
                .single()

              if (post && post.user_id === user.id) {
                const { data: profile } = await supabase
                  .from("profiles")
                  .select("name")
                  .eq("id", payload.new.user_id)
                  .single()

                showNotification("New Like", {
                  body: `${profile?.name || "Someone"} liked your post!`,
                  tag: "new-like",
                })
              }
            }
          },
        )
        .subscribe()

      // Store channels for cleanup
      channelsRef.current = [postsChannel, confessionsChannel, likesChannel]
    } catch (error) {
      console.error("Error setting up notifications:", error)
    }

    return () => {
      // Clean up subscriptions when component unmounts
      channelsRef.current.forEach((channel) => {
        supabase.removeChannel(channel)
      })
      channelsRef.current = []
    }
  }, [user, notificationsEnabled])

  return (
    <NotificationContext.Provider value={{ notificationsEnabled, enableNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}
