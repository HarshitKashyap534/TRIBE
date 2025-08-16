"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Flag, Plus, Calendar, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from "@/components/auth-provider"
import React from "react"

const founders = [
  {
    name: "Kashbeth",
    role: "The Mastermind & Developer behind this!",
    bio: "I just build stuffs for fun 👻",
    image: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Felix",
  },
]

const faqItems = [
  {
    question: "What is Tribe?",
    answer:
      "Tribe is a social media platform designed specifically for university students. It aims to connect students, share experiences, and foster a sense of community within the campus.",
  },
  {
    question: "How do I create an account?",
    answer:
      "To create an account, click on the 'Sign Up' button on the homepage. You'll need to use your university email address to register. Follow the prompts to set up your profile and start connecting with your peers.",
  },
  {
    question: "Is my information safe on Tribe?",
    answer:
      "Yes, we take your privacy and security seriously. We use industry-standard encryption and security measures to protect your data. You can control your privacy settings in your account to decide what information you want to share with others.",
  },
  {
    question: "How do I get verified?",
    answer:
      "Verification is done manually based on factors like activity, credibility, and engagement. If eligible, you'll be verified automatically.",
  },
  {
    question: "How do I create a service profile?",
    answer:
      "For now, If you want to become a service provider, contact us directly via the Contact Us section in the Masthead. This helps us maintain quality and authenticity",
  },
  {
    question: "How can I feature my event on Tribe?",
    answer:
      "If you'd like to add or feature your event on our platform, please contact us at unitynomad@gmail.com with details about your event. We're always looking for exciting campus events to share with the community.",
  },
]

interface Announcement {
  id: number;
  title: string;
  date: string;
  description: string;
}

export default function MastHead() {
  const { user, profile } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpdates()
  }, [])

  const fetchUpdates = async () => {
    try {
      // Instead of fetching from a non-existent "updates" table, we'll use dummy data
      // In a real scenario, you'd create this table or fetch from an appropriate source
      const dummyUpdates = [
        {
          id: 1,
          title: "Releasing Tribe Today!\n~ Kashbeth",
          date: "2025-08-18",
          description: "We're releasing Tribe today! 🎉 \n This is the first version of the app, and we're working on adding more features and improving the app. \n If you have any feedback, please contact us at tribenetworkteam@gmail.com",
        },
        // {
        //   id: 2,
        //   title: "Releasing Tribe Today!\n~ Harshit Kashyap",
        //   date: "2025-06-11",
        //   description: "We've launched our new 'GhostPost' feature. Share your thoughts anonymously!",
        // },
        // {
        //   id: 3,
        //   title: "New Feature: Services!",
        //   date: "2025-12-03",
        //   description: "Introducing our new 'Services' feature. Find and offer services within your campus community!",
        // },
      ]
      setAnnouncements(dummyUpdates)
    } catch (error) {
      console.error("Error fetching updates:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8 pb-20">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Mast-Head</h1>
        <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
        <span className="text-sm font-medium text-primary animate-pulse">New Updates!</span>
      </div>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">About Tribe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base mb-4 text-muted-foreground">
            We're literally building THE space where students can say what they actually think, call out what needs to
            change, and start conversations that actually matter. This is where student voices shine. Speak your truth,
            challenge the status quo, and ignite real change. No filters, no limits, just raw, honest conversations that
            matter✨
          </p>
          <p className="text-base text-muted-foreground">
            App Info:
            <br />
            <br /> 1. Version: 1.0.0
            <br /> 2. Updated on: August 18, 2025
            <br /> 3. Released on: August 18, 2025
            <br /> 4. No App permissions Required
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Latest Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((update) => (
              <div key={update.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-foreground">
                  {update.title.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line.trim().startsWith('~') ? (
                        <span className="text-sm italic text-muted-foreground">{line}</span>
                      ) : (
                        line
                      )}
                      {idx !== update.title.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="text-muted-foreground">{new Date(update.date).toLocaleDateString('en-GB')}</p>
                <p className="mt-2 text-foreground">
                  {update.description.split(/\n/).map((line, idx) => {
                    // Regex to find email addresses
                    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
                    const parts = line.split(emailRegex);
                    return (
                      <span key={idx}>
                        {parts.map((part, i) =>
                          emailRegex.test(part) ? (
                            <a
                              key={i}
                              href={`mailto:${part}`}
                              className="underline italic text-foreground"
                            >
                              {part}
                            </a>
                          ) : (
                            <React.Fragment key={i}>{part}</React.Fragment>
                          )
                        )}
                        <br />
                      </span>
                    );
                  })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Feature Event Card */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-gray-700 shadow-lg overflow-hidden dark:from-blue-900 dark:to-purple-900 light:from-blue-600 light:to-purple-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-300" />
            Feature Your Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base mb-4 text-gray-200">
            Want to showcase your event to the entire university community? We can help you reach more students and
            increase attendance. Whether it's a club meeting, cultural celebration, workshop, or social gathering, we'd
            love to feature it on Tribe.
          </p>
          <Button
            className="bg-white text-blue-700 hover:bg-white/90"
            onClick={() =>
              (window.location.href =
                "mailto:tribenetworkteam@gmail.com?subject=Event Feature Request&body=Event Details:%0A%0AName of Event: %0ADate: %0ATime: %0ALocation: %0ADescription: %0AOrganizer: %0AContact Information: ")
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Submit Your Event
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Created & Owned By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {founders.map((founder) => (
              <div key={founder.name} className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={founder.image} />
                  <AvatarFallback>{founder.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{founder.name}</h3>
                  <p className="text-muted-foreground">{founder.role}</p>
                  <p className="mt-2 text-foreground">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-sm text-foreground hover:text-primary">
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Need Help or Have Feedback?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base mb-4 text-muted-foreground">
            At Tribe, we prioritize your experience and are dedicated to providing a seamless and engaging platform.
            Your feedback drives our continuous improvement. Whether you need assistance, have suggestions, or wish to
            report an issue, our team is here to support you every step of the way.
          </p>
          <Button
            asChild
            className="w-full text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Link href="/report">
              <Flag className="w-4 h-4 mr-2" />
              Contact Us!
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
