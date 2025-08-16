import type React from "react"
// import { RightSidebar } from "@/components/right-sidebar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full">
      {/* <MainNav /> Removed because the file was deleted */}
      <main className="flex-1 overflow-auto">{children}</main>
      {/* <RightSidebar /> Removed because the file was deleted */}
    </div>
  )
}
