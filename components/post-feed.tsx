"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Flag, MoreVertical, Heart, HeartCrack } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { VerifiedBadge } from "@/components/verified-badge"
import { toast } from "@/components/ui/use-toast"
import { ReportModal } from "@/components/report-modal"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TimeAgo from "timeago-react"
import Image from "next/image"

export function PostFeed({ initialPosts = [], newPosts = null }) {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState(initialPosts || [])
  const [comments, setComments] = useState({})
  const [showComments, setShowComments] = useState({})
  const [reportingPostId, setReportingPostId] = useState(null)
  const [userActions, setUserActions] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const [commentsLoaded, setCommentsLoaded] = useState({})

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

  const loadComments = async (postId) => {
    if (commentsLoaded[postId]) return // Prevent duplicate loading

    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles:user_id(name, avatar)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (error) throw error

      setComments((prev) => ({ ...prev, [postId]: data || [] }))
      setCommentsLoaded((prev) => ({ ...prev, [postId]: true }))
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (!initialPosts || initialPosts.length === 0) {
      fetchPosts()
    } else {
      setLoading(false)

      // Debug: Log initialPosts and their comments field
      console.log('DEBUG: initialPosts for auto-expand', initialPosts.map(p => ({id: p.id, comments: p.comments})))

      // Process posts and auto-expand comments
      const autoExpandComments = {}
      const postsToLoadComments = []

      initialPosts.forEach((post) => {
        const commentCount = Number(post.comments) || 0
        if (commentCount > 0) {
          autoExpandComments[post.id] = true
          postsToLoadComments.push(post.id)
        }
      })

      setShowComments(autoExpandComments)

      // Load comments for posts that should be expanded
      postsToLoadComments.forEach((postId) => {
        loadComments(postId)
      })
    }

    const postsChannel = supabase
      .channel(`posts-${Date.now()}-${Math.random()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, handlePostChange)
      .subscribe()

    return () => {
      supabase.removeChannel(postsChannel)
    }
  }, [initialPosts])

  useEffect(() => {
    if (newPosts) {
      setPosts((prevPosts) => [newPosts, ...(prevPosts || [])])
    }
  }, [newPosts])

  // Load user's likes and dislikes when posts are loaded
  useEffect(() => {
    if (user && posts.length > 0) {
      fetchUserActions()
    }
  }, [user, posts])

  const fetchUserActions = async () => {
    if (!user) return

    try {
      // Fetch user's likes
      const { data: likes, error: likesError } = await supabase.from("likes").select("post_id").eq("user_id", user.id)

      if (likesError) throw likesError

      // Fetch user's dislikes
      const { data: dislikes, error: dislikesError } = await supabase
        .from("dislikes")
        .select("post_id")
        .eq("user_id", user.id)

      if (dislikesError) throw dislikesError

      // Create a map of user actions
      const actions = {}
      likes?.forEach((like) => {
        actions[like.post_id] = { ...actions[like.post_id], liked: true }
      })

      dislikes?.forEach((dislike) => {
        actions[dislike.post_id] = { ...actions[dislike.post_id], disliked: true }
      })

      setUserActions(actions)
    } catch (error) {
      console.error("Error fetching user actions:", error)
    }
  }

  const handlePostChange = (payload) => {
    if (payload.eventType === "INSERT") {
      setPosts((current) => [payload.new, ...(current || [])])
    } else if (payload.eventType === "DELETE") {
      setPosts((current) => (current || []).filter((post) => post.id !== payload.old.id))
    } else if (payload.eventType === "UPDATE") {
      setPosts((current) =>
        (current || []).map((post) => (post.id === payload.new.id ? { ...post, ...payload.new } : post)),
      )
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles(id, name, avatar, is_verified),
          likes:likes(count),
          dislikes:dislikes(count),
          comments:comments(count)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      if (data) {
        const processedPosts = data.map((post) => ({
          ...post,
          likes: post.likes[0]?.count || 0,
          dislikes: post.dislikes[0]?.count || 0,
          comments: post.comments[0]?.count || 0,
        }))

        setPosts(processedPosts)

        // Auto-expand comments for posts with comments > 0
        const autoExpandComments = {}
        const postsToLoadComments = []

        processedPosts.forEach((post) => {
          const commentCount = Number(post.comments) || 0
          if (commentCount > 0) {
            autoExpandComments[post.id] = true
            postsToLoadComments.push(post.id)
          }
        })

        setShowComments(autoExpandComments)

        // Load comments for posts that should be expanded
        postsToLoadComments.forEach((postId) => {
          loadComments(postId)
        })
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      })
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    if (actionLoading[postId] || !user) return

    setActionLoading((prev) => ({ ...prev, [postId]: true }))

    const currentPost = posts.find((p) => p.id === postId)
    const isCurrentlyLiked = userActions[postId]?.liked

    try {
      if (!user) throw new Error("No user found")

      if (isCurrentlyLiked) {
        // Remove like
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id)

        // Update UI
        setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: Math.max(0, post.likes - 1) } : post)))
        setUserActions((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], liked: false },
        }))
      } else {
        // Add like and remove dislike if exists
        await supabase.from("likes").insert({ post_id: postId, user_id: user.id })
        await supabase.from("dislikes").delete().eq("post_id", postId).eq("user_id", user.id)

        // Update UI
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              const wasDisliked = userActions[postId]?.disliked
              return {
                ...post,
                likes: post.likes + 1,
                dislikes: wasDisliked ? Math.max(0, post.dislikes - 1) : post.dislikes,
              }
            }
            return post
          }),
        )
        setUserActions((prev) => ({
          ...prev,
          [postId]: { liked: true, disliked: false },
        }))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleDislike = async (postId) => {
    if (actionLoading[postId] || !user) return

    setActionLoading((prev) => ({ ...prev, [postId]: true }))

    const currentPost = posts.find((p) => p.id === postId)
    const isCurrentlyDisliked = userActions[postId]?.disliked

    try {
      if (!user) throw new Error("No user found")

      if (isCurrentlyDisliked) {
        // Remove dislike
        await supabase.from("dislikes").delete().eq("post_id", postId).eq("user_id", user.id)

        // Update UI
        setPosts(
          posts.map((post) => (post.id === postId ? { ...post, dislikes: Math.max(0, post.dislikes - 1) } : post)),
        )
        setUserActions((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], disliked: false },
        }))
      } else {
        // Add dislike and remove like if exists
        await supabase.from("dislikes").insert({ post_id: postId, user_id: user.id })
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id)

        // Update UI
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              const wasLiked = userActions[postId]?.liked
              return {
                ...post,
                dislikes: post.dislikes + 1,
                likes: wasLiked ? Math.max(0, post.likes - 1) : post.likes,
              }
            }
            return post
          }),
        )
        setUserActions((prev) => ({
          ...prev,
          [postId]: { disliked: true, liked: false },
        }))
      }
    } catch (error) {
      console.error("Error toggling dislike:", error)
      toast({
        title: "Error",
        description: "Failed to dislike post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleComment = async (postId, comment) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content: comment,
        })
        .select("*, profiles:user_id(name, avatar)")
        .single()

      if (error) throw error

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }))

      setPosts((posts || []).map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post)))

      // Auto-expand comments if not already expanded
      if (!showComments[postId]) {
        setShowComments((prev) => ({ ...prev, [postId]: true }))
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleComments = async (postId) => {
    if (!showComments[postId] && !commentsLoaded[postId]) {
      await loadComments(postId)
    }
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const openReportModal = (postId) => {
    setReportingPostId(postId)
  }

  const closeReportModal = () => {
    setReportingPostId(null)
  }

  const handleReport = async (reason: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("No user found")

      if (!reportingPostId) throw new Error("No post selected for reporting")

      const { data, error } = await supabase
        .from("reports")
        .insert({
          post_id: reportingPostId,
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
      console.error("Error reporting post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to report the post. Please try again.",
        variant: "destructive",
      })
    } finally {
      closeReportModal()
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {loading ? (
          <LoadingSpinner />
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <Card className="bg-card rounded-lg shadow-sm overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={post.profiles?.avatar || `/avatars/cartoon${(post.profiles?.id % 5) + 1 || 1}.png`}
                        alt={post.profiles?.name || "User"}
                      />
                      <AvatarFallback>{post.profiles?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {post.profiles?.name || "User"}
                        </p>
                        {post.profiles?.is_verified && <VerifiedBadge className="ml-1" />}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <TimeAgo datetime={post.created_at} />
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0 space-y-3">
                  {post.content && (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{linkifyText(post.content)}</p>
                  )}

                  {post.image_url && (
                    <div className="w-full rounded-lg overflow-hidden bg-background/50">
                      <img
                        src={post.image_url || "/placeholder.svg"}
                        alt="Post image"
                        className="w-full h-auto object-contain max-h-[28rem]"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex space-x-1">
                      {/* Like Button with Heart */}
                      <motion.div whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`transition-all duration-300 rounded-full ${
                            userActions[post.id]?.liked
                              ? "text-pink-500 hover:text-pink-600"
                              : "text-muted-foreground hover:text-pink-500"
                          }`}
                          onClick={() => handleLike(post.id)}
                          disabled={actionLoading[post.id]}
                        >
                          <motion.div
                            animate={
                              userActions[post.id]?.liked
                                ? {
                                    scale: [1, 1.4, 1.2],
                                    rotate: [0, -10, 10, 0],
                                  }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative mr-1"
                          >
                            <Heart
                              className={`w-4 h-4 transition-all duration-300 ${
                                userActions[post.id]?.liked
                                  ? "fill-current text-pink-500 drop-shadow-lg"
                                  : "text-muted-foreground"
                              }`}
                              style={
                                userActions[post.id]?.liked
                                  ? {
                                      filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))",
                                    }
                                  : {}
                              }
                            />
                            {userActions[post.id]?.liked && (
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
                                    background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
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
                            className={`text-xs font-medium transition-all duration-300 ${
                              userActions[post.id]?.liked ? "text-pink-500" : "text-muted-foreground"
                            }`}
                            animate={userActions[post.id]?.liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {post.likes}
                          </motion.span>
                        </Button>
                      </motion.div>

                      {/* Dislike Button with Broken Heart */}
                      <motion.div whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`transition-all duration-300 rounded-full ${
                            userActions[post.id]?.disliked
                              ? "text-gray-600 hover:text-gray-700"
                              : "text-muted-foreground hover:text-gray-600"
                          }`}
                          onClick={() => handleDislike(post.id)}
                          disabled={actionLoading[post.id]}
                        >
                          <motion.div
                            animate={
                              userActions[post.id]?.disliked
                                ? {
                                    scale: [1, 1.3, 1.1],
                                    rotate: [0, -15, 15, -10, 0],
                                  }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative mr-1"
                          >
                            <HeartCrack
                              className={`w-4 h-4 transition-all duration-300 ${
                                userActions[post.id]?.disliked
                                  ? "fill-current text-gray-600 drop-shadow-lg"
                                  : "text-muted-foreground"
                              }`}
                              style={
                                userActions[post.id]?.disliked
                                  ? {
                                      filter: "drop-shadow(0 0 6px rgba(75, 85, 99, 0.5))",
                                    }
                                  : {}
                              }
                            />
                            {userActions[post.id]?.disliked && (
                              <>
                                <motion.div
                                  className="absolute inset-0 rounded-full"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{
                                    scale: [0, 3, 4],
                                    opacity: [0, 0.4, 0],
                                  }}
                                  transition={{ duration: 0.8 }}
                                  style={{
                                    background: "radial-gradient(circle, rgba(75, 85, 99, 0.2) 0%, transparent 70%)",
                                  }}
                                />
                                {/* Crack effect */}
                                <motion.div
                                  className="absolute inset-0"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <div className="w-full h-full relative">
                                    <motion.div
                                      className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-400 origin-center"
                                      initial={{ scaleX: 0, rotate: 45 }}
                                      animate={{ scaleX: [0, 1, 0], rotate: 45 }}
                                      transition={{ duration: 0.4 }}
                                      style={{ transform: "translate(-50%, -50%)" }}
                                    />
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </motion.div>
                          <motion.span
                            className={`text-xs font-medium transition-all duration-300 ${
                              userActions[post.id]?.disliked ? "text-gray-600" : "text-muted-foreground"
                            }`}
                            animate={userActions[post.id]?.disliked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {post.dislikes}
                          </motion.span>
                        </Button>
                      </motion.div>

                      <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary transition-all duration-200 rounded-full"
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">{post.comments}</span>
                        </Button>
                      </motion.div>
                      {/* Report Button */}
                      <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-red-500 transition-all duration-200 rounded-full"
                          onClick={() => openReportModal(post.id)}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {showComments[post.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 ml-4 pl-4 border-l-2 border-muted/30"
                      >
                        {(comments[post.id] || []).map((comment, commentIndex) => (
                          <div
                            key={commentIndex}
                            className="flex items-start space-x-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg"
                          >
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={
                                  comment.profiles?.avatar ||
                                  `/avatars/cartoon${(comment.profiles?.id % 5) + 1 || 1}.png`
                                }
                                alt={comment.profiles?.name || "User"}
                              />
                              <AvatarFallback>{comment.profiles?.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground/90">
                                {comment.profiles?.name || "User"}
                              </p>
                              <p className="text-xs text-foreground/80 whitespace-pre-wrap mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2 ml-8">
                          <Input
                            placeholder="Write a comment..."
                            className="text-xs h-9 rounded-full bg-background/50 border-muted"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && e.target.value.trim()) {
                                handleComment(post.id, e.target.value)
                                e.target.value = ""
                              }
                            }}
                          />
                          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                            <Button
                              size="sm"
                              className="text-xs rounded-full px-4"
                              onClick={() => {
                                const input = document.querySelector(
                                  `input[placeholder="Write a comment..."]`,
                                ) as HTMLInputElement
                                if (input && input.value.trim()) {
                                  handleComment(post.id, input.value)
                                  input.value = ""
                                }
                              }}
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
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
          </div>
        )}
      </AnimatePresence>
      <ReportModal isOpen={!!reportingPostId} onClose={closeReportModal} onReport={handleReport} />
    </div>
  )
}
