// Update the service cards to remove background banner, profile photo, rating, portfolio button, and working experience
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { Mail, Video, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ServiceProvider {
  id: number;
  name: string;
  service_type: string;
  price: string;
  description: string;
  contact: string;
  location: string;
  icon: any;
}

export default function Services() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Dummy service providers with simplified data
  const serviceProviders = [
    {
      id: 1,
      name: "Dhruv Nair",
      service_type: "Video Editing",
      price: "Negotiable Price",
      description:
        "Professional video editor with 3+ years of experience. Specializing in social media content, event highlights, and promotional videos. Fast turnaround times and unlimited revisions.",
      contact: "dhruvnair200@gmail.com",
      //phone: "+91 98765 43210",
      location: "Campus (D-Block)",
      icon: Video,
      //availability: "Weekdays & Weekends",
    },
  ]

  const renderServiceCard = (service: ServiceProvider) => {
    const ServiceIcon = service.icon

    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: service.id * 0.1 }}
        whileHover={{ y: -8, boxShadow: '0 8px 32px 0 rgba(80, 36, 180, 0.15)' }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden border-2 border-blue-500/10 shadow-md bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-card dark:via-blue-950/30 dark:to-purple-950/30 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="font-medium px-3 py-1 text-xs bg-blue-100 text-blue-700 border-0">
                {service.service_type}
              </Badge>
              <span className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-3 py-1 text-xs font-bold shadow-sm">
                {service.price}
              </span>
            </div>

            <div className="mb-3">
              <h3 className="font-extrabold text-xl text-blue-800 dark:text-blue-300 mb-1 tracking-tight">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
              <div className="flex items-center text-blue-700 dark:text-blue-300 font-semibold">
                <MapPin className="w-4 h-4 mr-1 text-pink-500" />
                <span>{service.location}</span>
              </div>
              <div className="flex items-center text-purple-700 dark:text-purple-300 font-semibold">
                <Mail className="w-4 h-4 mr-1 text-purple-500" />
                <span className="truncate">{service.contact}</span>
              </div>
            </div>

            <div className="border-t border-blue-200 dark:border-blue-900 pt-4 mt-2">
              <Button
                className="w-full text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md font-semibold tracking-wide py-2"
                onClick={() =>
                  (window.location.href = `mailto:${service.contact}?subject=Service%20Inquiry%20from%20Tribe`)
                }
              >
                Contact Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!user || !profile) return null

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-foreground">Campus Services</h1>
        <p className="text-muted-foreground">Connect with trusted service providers from your university community</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[300px] animate-pulse">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 w-24 bg-muted rounded"></div>
                  <div className="h-6 w-24 bg-muted rounded"></div>
                </div>
                <div className="h-5 w-32 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-2/3 bg-muted rounded"></div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="h-8 w-full bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceProviders.map((service) => renderServiceCard(service))}
        </div>
      )}

      <div className="mt-10 bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Offer your services on Tribe</h3>
            <p className="text-sm text-muted-foreground">
              Are you skilled in a particular area? Join our service provider network and connect with students who need
              your expertise.
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full px-6 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
            onClick={() =>
              (window.location.href =
                "mailto:tribenetworkteam@gmail.com?subject=Service%20Provider%20Application&body=Name:%0AService%20Type:%0APrice%20Range:%0ADescription%20of%20Services:%0ALocation%20on%20Campus:%0AAvailability:%0AContact%20Email:%0APhone%20Number:")
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  )
}
