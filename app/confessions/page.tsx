"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Heart, Flag, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReportModal } from "@/components/report-modal"

const generateFakeName = () => {
  const adjectives = [
    "Savage",
    "Fearless",
    "Unstoppable",
    "Legendary",
    "Reckless",
    "Untamed",
    "Epic",
    "Daring",
    "Ferocious",
    "Vibrant",
    "Cryptic",
    "Phantom",
    "Enigmatic",
    "Elusive",
    "Shadowy",
    "Arcane",
    "Veiled",
    "Otherworldly",
    "Runic",
    "Ethereal",
    "Aesthetic",
    "Dreamy",
    "Abstract",
    "Cinematic",
    "Melodic",
    "Surreal",
    "Groovy",
    "Funky",
    "Expressive",
    "Dizzy",
    "Chaotic",
    "Loopy",
    "Zany",
    "Unhinged",
    "Wacky",
    "Hyperactive",
    "Goofy",
    "Bizarre",
    "Whimsical",
    "Bonkers",
    "Opulent",
    "Exquisite",
    "Dapper",
    "Classy",
    "Gilded",
    "Majestic",
    "Pristine",
    "Regal",
    "Supreme",
    "Slick",
  ]

  const nouns = [
    "Dragon",
    "Phoenix",
    "Unicorn",
    "Griffin",
    "Goblin",
    "Troll",
    "Elf",
    "Mermaid",
    "Wizard",
    "Sorcerer",
    "Cosmonaut",
    "Alien",
    "Nebula",
    "Astro",
    "Galaxy",
    "Starship",
    "Meteor",
    "WarpDrive",
    "BlackHole",
    "Martian",
    "Pirate",
    "Explorer",
    "Nomad",
    "Vagabond",
    "Wayfarer",
    "Wanderer",
    "Outlaw",
    "Corsair",
    "Maverick",
    "Pathfinder",
    "Jester",
    "Prankster",
    "Clown",
    "Mischief",
    "Troublemaker",
    "Doodle",
    "Gizmo",
    "Sidekick",
    "Noodle",
    "Rascal",
    "Duke",
    "Baron",
    "Squire",
    "Maestro",
    "Sultan",
    "Chancellor",
    "Emperor",
    "Monarch",
    "Magnate",
    "Tycoon",
  ]

  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`
}

const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export default function Confessions() {
  const { user, profile } = useAuth()
  const [confessions, setConfessions] = useState([])
  const [newConfession, setNewConfession] = useState("")
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState({})
  const [newComments, setNewComments] = useState({})
  const [visibleComments, setVisibleComments] = useState({})
  const [userActions, setUserActions] = useState({})
  const [actionLoading, setActionLoading] = useState({})
  const [reportingConfessionId, setReportingConfessionId] = useState(null)

  const fetchConfessions = useCallback(async () => {
    try {
      setLoading(true)

      // Add timeout to prevent endless loading
      const timeoutId = setTimeout(() => {
        toast({
          title: "Loading timeout",
          description: "Please refresh the page if confessions don't load.",
          variant: "destructive",
        })
        setLoading(false)
      }, 8000) // 8 second timeout

      const { data, error } = await supabase
        .from("confessions")
        .select(`
      id,
      content,
      author_name,
      created_at,
      upvotes:confession_upvotes(count),
      comments:confession_comments(count)
    `)
        .order("created_at", { ascending: false })
        .limit(15) // Limit for better performance

      clearTimeout(timeoutId)

      if (error) throw error

      const processedData = data.map((confession) => ({
        id: confession.id,
        content: confession.content,
        author_name: confession.author_name,
        created_at: confession.created_at,
        upvotes: confession.upvotes[0]?.count || 0,
        comments: confession.comments[0]?.count || 0,
      }))

      setConfessions(processedData)

      // Auto-expand comments for confessions with comments > 0
      const autoExpandComments = {}
      processedData.forEach((confession) => {
        if (confession.comments > 0) {
          autoExpandComments[confession.id] = true
        }
      })
      setVisibleComments(autoExpandComments)
    } catch (error) {
      console.error("Error fetching confessions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch confessions. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfessions()
  }, [fetchConfessions])

  // Load user's upvotes when confessions are loaded
  useEffect(() => {
    if (user && confessions.length > 0) {
      fetchUserUpvotes()
      // Auto-load comments for confessions that should be expanded
      confessions.forEach((confession) => {
        if (confession.comments > 0 && !comments[confession.id]) {
          loadComments(confession.id)
        }
      })
    }
  }, [user, confessions])

  const fetchUserUpvotes = async () => {
    if (!user) return

    try {
      // Fetch user's upvotes
      const { data: upvotes, error } = await supabase
        .from("confession_upvotes")
        .select("confession_id")
        .eq("user_id", user.id)

      if (error) throw error

      // Create a map of user actions
      const actions = {}
      upvotes?.forEach((upvote) => {
        actions[upvote.confession_id] = { upvoted: true }
      })

      setUserActions(actions)
    } catch (error) {
      console.error("Error fetching user upvotes:", error)
    }
  }

  const loadComments = async (confessionId) => {
    try {
      const { data, error } = await supabase
        .from("confession_comments")
        .select("*")
        .eq("confession_id", confessionId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setComments((prev) => ({ ...prev, [confessionId]: data }))
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newConfession.trim() && newConfession.length <= 300) {
      const fakeName = generateFakeName()
      try {
        const { data, error } = await supabase
          .from("confessions")
          .insert({ content: newConfession, author_name: fakeName })
          .select()

        if (error) throw error
        setConfessions([{ ...data[0], upvotes: 0, comments: 0 }, ...confessions])
        setNewConfession("")
        toast({
          title: "Success",
          description: "Your confession has been posted anonymously.",
        })
      } catch (error) {
        console.error("Error submitting confession:", error)
        toast({
          title: "Error",
          description: "Failed to post your confession. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpvote = async (confessionId) => {
    if (actionLoading[confessionId] || !user) return

    setActionLoading((prev) => ({ ...prev, [confessionId]: true }))

    const currentConfession = confessions.find((c) => c.id === confessionId)
    const isCurrentlyUpvoted = userActions[confessionId]?.upvoted

    try {
      if (!user) throw new Error("No user found")

      if (isCurrentlyUpvoted) {
        // Remove upvote
        await supabase.from("confession_upvotes").delete().match({ confession_id: confessionId, user_id: user.id })

        // Update UI
        setConfessions(
          confessions.map((c) => (c.id === confessionId ? { ...c, upvotes: Math.max(0, c.upvotes - 1) } : c)),
        )
        setUserActions((prev) => ({
          ...prev,
          [confessionId]: { upvoted: false },
        }))
      } else {
        // Add upvote
        await supabase.from("confession_upvotes").insert({ confession_id: confessionId, user_id: user.id })

        // Update UI
        setConfessions(confessions.map((c) => (c.id === confessionId ? { ...c, upvotes: c.upvotes + 1 } : c)))
        setUserActions((prev) => ({
          ...prev,
          [confessionId]: { upvoted: true },
        }))
      }
    } catch (error) {
      console.error("Error upvoting confession:", error)
      toast({
        title: "Error",
        description: "Failed to upvote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => ({ ...prev, [confessionId]: false }))
    }
  }

  const toggleComments = async (confessionId) => {
    if (!visibleComments[confessionId] && !comments[confessionId]) {
      await loadComments(confessionId)
    }
    setVisibleComments((prev) => ({
      ...prev,
      [confessionId]: !prev[confessionId],
    }))
  }

  const handleComment = async (confessionId) => {
    if (newComments[confessionId]?.trim()) {
      try {
        const { data, error } = await supabase
          .from("confession_comments")
          .insert({
            confession_id: confessionId,
            user_id: user.id,
            content: newComments[confessionId],
          })
          .select()

        if (error) throw error

        setComments((prev) => ({
          ...prev,
          [confessionId]: [...(prev[confessionId] || []), data[0]],
        }))
        setNewComments((prev) => ({ ...prev, [confessionId]: "" }))
        setConfessions(confessions.map((c) => (c.id === confessionId ? { ...c, comments: c.comments + 1 } : c)))

        // Auto-expand comments if not already expanded
        if (!visibleComments[confessionId]) {
          setVisibleComments((prev) => ({ ...prev, [confessionId]: true }))
        }
      } catch (error) {
        console.error("Error posting comment:", error)
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const openReportModal = (confessionId) => {
    setReportingConfessionId(confessionId)
  }

  const closeReportModal = () => {
    setReportingConfessionId(null)
  }

  const handleReport = async (reason: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("No user found")

      if (!reportingConfessionId) throw new Error("No confession selected for reporting")

      const { data, error } = await supabase
        .from("confession_reports")
        .insert({
          confession_id: reportingConfessionId,
          user_id: user.id,
          reason: reason,
        })
        .select()

      if (error) throw error

      toast({
        title: "Report Submitted",
        description: "Thank you for your report. We will review it shortly.",
      })
    } catch (error) {
      console.error("Error reporting confession:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to report the confession. Please try again.",
        variant: "destructive",
      })
    } finally {
      closeReportModal()
    }
  }

  if (!user || !profile) return null

  return (
    <div className="container mx-auto p-6 space-y-6 pb-24">
      <Card className="mb-8 overflow-hidden border border-border bg-card shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold text-foreground">Share Your Views Anonymously with Confessions</h2>
          <p className="text-sm text-muted-foreground">Your identity will remain anonymous. Express yourself freely!</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative mt-2">
              <Textarea
                placeholder="What's on your mind? Share your thoughts anonymously..."
                value={newConfession}
                onChange={(e) => setNewConfession(e.target.value)}
                className="resize-none text-foreground bg-background border-border focus:border-primary focus:ring-primary/10 min-h-[100px] rounded-lg transition-all duration-200"
                maxLength={300}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                <span
                  className={
                    newConfession.length > 270
                      ? newConfession.length > 300
                        ? "text-red-500"
                        : "text-amber-500"
                      : "text-muted-foreground"
                  }
                >
                  {newConfession.length}
                </span>
                /300
              </div>
            </div>
            <div className="flex justify-end">
              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
                <Button
                  type="submit"
                  className="rounded-full px-6 py-3 bg-gradient-to-r from-teal-500 via-fuchsia-600 to-purple-700 hover:from-teal-600 hover:via-fuchsia-700 hover:to-purple-800 border-0 text-white font-semibold shadow-xl transition-all duration-300 ease-in-out"
                  disabled={!newConfession.trim() || newConfession.length > 300}
                >
                  Publish Anonymously
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border border-border bg-card shadow-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-muted rounded mt-1 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && confessions.length === 0 ? (
        <p className="text-center text-foreground">No confessions yet. Be the first to share!</p>
      ) : (
        <>
          {!loading && confessions.length > 0 && (
            <div className="space-y-4">
              {confessions.map((confession) => (
                <motion.div
                  key={confession.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden border border-border bg-card shadow-sm hover:shadow transition-shadow duration-200 rounded-xl"
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{confession.author_name[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{confession.author_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-foreground mb-4 whitespace-pre-wrap">{linkifyText(confession.content)}</p>
                      <div className="flex items-center space-x-2 pt-2 border-t border-border">
                        {/* Like Button with Heart */}
                        <motion.div whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpvote(confession.id)}
                            disabled={actionLoading[confession.id]}
                            className={`flex items-center space-x-1 transition-all duration-300 ${
                              userActions[confession.id]?.upvoted
                                ? "text-pink-500 hover:text-pink-600"
                                : "text-muted-foreground hover:text-pink-500"
                            }`}
                          >
                            <motion.div
                              animate={
                                userActions[confession.id]?.upvoted
                                  ? {
                                      scale: [1, 1.4, 1.2],
                                      rotate: [0, -10, 10, 0],
                                    }
                                  : { scale: 1 }
                              }
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="relative"
                            >
                              <Heart
                                className={`w-4 h-4 transition-all duration-300 ${
                                  userActions[confession.id]?.upvoted
                                    ? "fill-current text-pink-500 drop-shadow-lg"
                                    : "text-muted-foreground"
                                }`}
                                style={
                                  userActions[confession.id]?.upvoted
                                    ? {
                                        filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))",
                                      }
                                    : {}
                                }
                              />
                              {userActions[confession.id]?.upvoted && (
                                <>
                                  <motion.div
                                    className="absolute inset-0 rounded-full"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                      scale: [0, 3, 4],
                                      opacity: [0, 0.6, 0],
                                    }}
                                    transition={{ duration: 0.8 }}
                                    style={{
                                      background:
                                        "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
                                    }}
                                  />
                                  {/* Floating hearts */}
                                  {[...Array(3)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="absolute w-2 h-2 text-pink-400"
                                      initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                                      animate={{
                                        scale: [0, 1, 0],
                                        x: [0, (i - 1) * 15],
                                        y: [0, -20 - i * 5],
                                        opacity: [0, 1, 0],
                                      }}
                                      transition={{ duration: 1, delay: i * 0.1 }}
                                    >
                                      <Heart className="w-full h-full fill-current" />
                                    </motion.div>
                                  ))}
                                </>
                              )}
                            </motion.div>
                            <motion.span
                              animate={userActions[confession.id]?.upvoted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className={`font-medium transition-all duration-300 ${
                                userActions[confession.id]?.upvoted ? "text-pink-500" : "text-muted-foreground"
                              }`}
                            >
                              {confession.upvotes}
                            </motion.span>
                          </Button>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(confession.id)}
                            className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-all duration-200"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium">{confession.comments}</span>
                          </Button>
                        </motion.div>
                        {/* Report Button */}
                        <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-red-500 transition-all duration-200 rounded-full"
                            onClick={() => openReportModal(confession.id)}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {visibleComments[confession.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 space-y-2"
                          >
                            {comments[confession.id]?.map((comment, index) => (
                              <div key={index} className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            ))}
                            <div className="flex items-center space-x-2 mt-3">
                              <Input
                                placeholder="Add a comment..."
                                value={newComments[confession.id] || ""}
                                onChange={(e) =>
                                  setNewComments((prev) => ({ ...prev, [confession.id]: e.target.value }))
                                }
                                className="flex-grow rounded-full text-sm bg-background/50 border-muted h-9"
                              />
                              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                                <Button
                                  size="sm"
                                  onClick={() => handleComment(confession.id)}
                                  disabled={!newComments[confession.id]?.trim()}
                                  className="rounded-full px-4"
                                >
                                  Post
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      <ReportModal isOpen={!!reportingConfessionId} onClose={closeReportModal} onReport={handleReport} />
    </div>
  )
}
