"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Calendar, MapPin, Clock, Heart, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Events() {
  const { user, profile } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedEvents, setSavedEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = () => {
    // Simulate API call with a short delay for better UX
    setTimeout(() => {
      const eventsData = [
        // {
        //   id: 1,
        //   title: "Inter-University Kabaddi & Chess Tournament 2025",
        //   date: "Mar 16, 2025",
        //   time: "10:00",
        //   venue: "Marwadi University",
        //   description:
        //     "Marwadi University presents Inter-University Kabaddi & Chess Tournament 2025 for Men & Women. Chess Tournament has no limit on players per category. Entry fee is ₹100 per player. Kabaddi Selection Trial will be held on 13th March 2025 at 9:30 AM. Chess participants can directly register through the registration link.",
        //   image:
        //     "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        //   attendees: 0,
        //   category: "Sports",
        //   organizer: {
        //     name: "Marwadi University",
        //     //avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        //     website: "http://event.marwadiuniversity.ac.in/SportInterUni/index.aspx",
        //   },
        //   registrationLink: "http://event.marwadiuniversity.ac.in/SportInterUni/index.aspx",
        //   tags: ["Sports", "Chess", "Kabaddi", "Inter-University"],
        // },
      ]

      // Sort events by date
      const sortedEvents = eventsData.sort((a, b) => {
        const dateA = new Date(a.date.replace("Feb", "February").replace("March", "March").replace("Dec", "December"))
        const dateB = new Date(b.date.replace("Feb", "February").replace("March", "March").replace("Dec", "December"))
        return dateA - dateB
      })

      setEvents(sortedEvents)
      setLoading(false)
    }, 800)
  }

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.replace("#", "")
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [events])

  const toggleSaveEvent = (eventId) => {
    if (savedEvents.includes(eventId)) {
      setSavedEvents(savedEvents.filter((id) => id !== eventId))
    } else {
      setSavedEvents([...savedEvents, eventId])
    }
  }

  if (!user || !profile) return null

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-foreground">Campus Events</h1>
        <p className="text-muted-foreground">Discover exciting events happening around your university</p>
      </div>

      {loading ? (
        // Skeleton loading state
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-card border border-border">
              <div className="h-40 bg-muted animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-full"></div>
                <div className="flex justify-between pt-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                  <div className="h-8 bg-muted rounded animate-pulse w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Events Grid - Mobile Responsive */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow duration-200"
                  id={`${event.id}`}
                >
                  <div className="relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-40 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 w-full p-3 flex justify-between">
                      <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-0">
                        {event.category}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                              onClick={() => toggleSaveEvent(event.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${savedEvents.includes(event.id) ? "fill-red-500 text-red-500" : "text-foreground"}`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{savedEvents.includes(event.id) ? "Remove from saved" : "Save event"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-3">
                      <div className="flex gap-1">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 max-h-24 overflow-y-auto pr-1">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground col-span-2">
                        <MapPin className="w-3 h-3 mr-1 text-primary" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div className="flex items-center">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                          <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="ml-1 text-xs text-muted-foreground">{event.organizer.name}</span>
                      </div>
                      <Button
                        size="sm"
                        className="text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                        onClick={() => window.open(event.organizer.website, "_blank")}
                      >
                        Details <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No events found.</p>
            </div>
          )}
        </>
      )}

      {/* Contact for event feature section */}
      <Card className="mt-10 border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Want to feature your event?</h3>
              <p className="text-sm text-muted-foreground">
                If you'd like to add or feature an event on our platform, please contact us. We're always looking for
                exciting campus events to share with the community.
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full px-6 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
              onClick={() => (window.location.href = "mailto:tribenetworkteam@gmail.com?subject=Event Feature Request")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
