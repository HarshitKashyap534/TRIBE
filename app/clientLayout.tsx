"use client"

import type React from "react"
import { ThemeProvider } from "@/lib/theme-provider"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { TopBar } from "@/components/top-bar"
import { BottomNav } from "@/components/bottom-nav"
import { Toaster } from "@/components/ui/toaster"
import PageViewTracker from "@/components/analytics/page-view-tracker"

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {user && <TopBar />}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
        <PageViewTracker />
      </main>
      {user && <BottomNav />}
      <Toaster />
    </div>
  )
}

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayout>{children}</AppLayout>
      </AuthProvider>
    </ThemeProvider>
  )
}
