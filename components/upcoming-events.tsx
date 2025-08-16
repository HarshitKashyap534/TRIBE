"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export function UpcomingEvents() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(3)

      if (error) throw error
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={event.image || `/placeholder.svg?height=40&width=40`} alt={event.title} />
              <AvatarFallback>{event.title[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
              <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        <Button asChild className="w-full text-xs" variant="outline">
          <Link href="/events">View All Events</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
