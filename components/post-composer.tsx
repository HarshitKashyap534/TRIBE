"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Rocket, ImageIcon, X } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"

interface PostComposerProps {
  onPost: (content: string, imageUrl?: string | null) => Promise<void> | void;
}

export function PostComposer({ onPost }: PostComposerProps) {
  const { profile } = useAuth();
  const [content, setContent] = useState<string>("");
  const [charCount, setCharCount] = useState<number>(0);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed",
          variant: "destructive",
        })
        return
      }

      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImage = async () => {
    if (!image) return null

    setIsUploading(true)
    try {
      const fileExt = image.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `post-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("tribe-media").upload(filePath, image)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("tribe-media").getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handlePost = async () => {
    if ((content.trim() || image) && charCount <= 360) {
      setIsPosting(true)

      let imageUrl: string | null = null
      if (image) {
        imageUrl = await uploadImage()
      }

      await onPost(content, imageUrl)
      setContent("")
      setCharCount(0)
      removeImage()
      setIsPosting(false)
    }
  }

  if (!profile) return null

  return (
    <Card className="overflow-hidden shadow-lg bg-card border border-border">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-10 h-10 rounded-full border border-gray-700">
              <AvatarImage
                src={
                  profile.avatar ||
                  (typeof profile.id === "number"
                    ? `/avatars/cartoon${((profile.id % 5) + 1)}.png`
                    : "/avatars/cartoon1.png")
                }
                alt={profile.name}
              />
              <AvatarFallback>{profile.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1 text-muted-foreground font-medium">{profile.name || "You"}</span>
          </div>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="What's your hot take today?"
              className="resize-none text-foreground min-h-[80px] w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setCharCount(e.target.value.length)
              }}
              maxLength={360}
            />

            {imagePreview && (
              <div className="relative">
                <div className="w-full rounded-lg overflow-hidden bg-background/50">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Post image preview"
                    className="w-full h-auto object-contain max-h-[28rem]"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${charCount > 360 ? "text-red-500" : "text-gray-400"}`}>{charCount}/360</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPosting || isUploading}
                >
                  <div className="relative">
                    <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </Button>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  className="relative overflow-hidden rounded-full px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={handlePost}
                  disabled={(!content.trim() && !image) || charCount > 360 || isPosting || isUploading}
                >
                  <div className="relative flex items-center gap-2">
                    <motion.div
                      animate={isPosting || isUploading ? { rotate: 360 } : {}}
                      transition={{
                        duration: 1,
                        repeat: isPosting || isUploading ? Number.POSITIVE_INFINITY : 0,
                        ease: "linear",
                      }}
                    >
                      <Rocket className="w-4 h-4" />
                    </motion.div>
                    <span className="font-semibold text-sm">{isPosting || isUploading ? "Publishing..." : "Publish"}</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
