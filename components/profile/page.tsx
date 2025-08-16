"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAuthForm } from "@/components/user-auth-form"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function ProfilePage() {
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const profilePictures = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Doe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
  ]

  const handleAvatarSelect = (pic: string) => {
    setSelectedAvatar(pic)
  }

  const handleAvatarSave = () => {
    // Save the selected avatar to the user's profile
    setShowAvatarDialog(false)
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="avatar" onClick={() => setShowAvatarDialog(true)}>
            Avatar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <UserAuthForm />
        </TabsContent>
      </Tabs>

      <div className="mt-6 border rounded-md p-4">
        <h2 className="text-lg font-semibold mb-2">Become a Service Provider</h2>
        <p className="text-sm text-gray-500 mb-4">
          Interested in offering your services through our platform? Contact us to learn more about becoming a service
          provider.
        </p>
        <Link href="mailto:services@example.com" className={cn(buttonVariants())}>
          Contact Us via Email
        </Link>
      </div>

      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Choose Your Profile Picture</DialogTitle>
            <DialogDescription className="pt-2">Select one of these cool avatars for your profile</DialogDescription>
          </DialogHeader>

          {/* Update the avatar selection dialog to show more avatars in a better grid with improved scrolling */}
          <div
            className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4 py-4 overflow-y-auto pr-2 custom-scrollbar"
            style={{ maxHeight: "60vh" }}
          >
            {profilePictures.map((pic, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedAvatar === pic ? "ring-2 ring-primary scale-105" : "hover:scale-105"
                }`}
                onClick={() => handleAvatarSelect(pic)}
              >
                <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
                  <img
                    src={pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {selectedAvatar === pic && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 pt-4 mt-auto">
            <Button variant="outline" onClick={() => setShowAvatarDialog(false)} className="sm:w-auto w-full">
              Cancel
            </Button>
            <Button onClick={handleAvatarSave} className="sm:w-auto w-full" disabled={!selectedAvatar}>
              Save Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
