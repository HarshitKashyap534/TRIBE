import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
