"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/lib/theme-provider"
import { Moon, Sun, LogOut, Mail, Check, Briefcase, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type React from "react"

// Massive collection of 100+ profile avatars with different styles
const profilePictures = [
  // Avataaars style - 25 avatars
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Harper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mason",

  // Bottts style - 25 avatars
  "https://api.dicebear.com/7.x/bottts/svg?seed=Dusty",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Crumble",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Rusty",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Sparky",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Binary",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Circuit",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Voltage",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Neon",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Chrome",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Steel",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Copper",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Titanium",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Quantum",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Cyber",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Matrix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Digital",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Pixel",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Data",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Code",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Logic",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Algorithm",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Protocol",
  "https://api.dicebear.com/7.x/bottts/svg?seed=System",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Network",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Server",

  // Micah style - 25 avatars
  "https://api.dicebear.com/7.x/micah/svg?seed=Felix",
  "https://api.dicebear.com/7.x/micah/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/micah/svg?seed=Mia",
  "https://api.dicebear.com/7.x/micah/svg?seed=Alex",
  "https://api.dicebear.com/7.x/micah/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/micah/svg?seed=River",
  "https://api.dicebear.com/7.x/micah/svg?seed=Sage",
  "https://api.dicebear.com/7.x/micah/svg?seed=Phoenix",
  "https://api.dicebear.com/7.x/micah/svg?seed=Ocean",
  "https://api.dicebear.com/7.x/micah/svg?seed=Storm",
  "https://api.dicebear.com/7.x/micah/svg?seed=Sky",
  "https://api.dicebear.com/7.x/micah/svg?seed=Rain",
  "https://api.dicebear.com/7.x/micah/svg?seed=Thunder",
  "https://api.dicebear.com/7.x/micah/svg?seed=Lightning",
  "https://api.dicebear.com/7.x/micah/svg?seed=Wind",
  "https://api.dicebear.com/7.x/micah/svg?seed=Earth",
  "https://api.dicebear.com/7.x/micah/svg?seed=Fire",
  "https://api.dicebear.com/7.x/micah/svg?seed=Water",
  "https://api.dicebear.com/7.x/micah/svg?seed=Air",
  "https://api.dicebear.com/7.x/micah/svg?seed=Nature",
  "https://api.dicebear.com/7.x/micah/svg?seed=Forest",
  "https://api.dicebear.com/7.x/micah/svg?seed=Mountain",
  "https://api.dicebear.com/7.x/micah/svg?seed=Valley",
  "https://api.dicebear.com/7.x/micah/svg?seed=Desert",
  "https://api.dicebear.com/7.x/micah/svg?seed=Tundra",

  // Personas style - 25 avatars
  "https://api.dicebear.com/7.x/personas/svg?seed=Felix",
  "https://api.dicebear.com/7.x/personas/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/personas/svg?seed=Mia",
  "https://api.dicebear.com/7.x/personas/svg?seed=Alex",
  "https://api.dicebear.com/7.x/personas/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/personas/svg?seed=Echo",
  "https://api.dicebear.com/7.x/personas/svg?seed=Blaze",
  "https://api.dicebear.com/7.x/personas/svg?seed=Frost",
  "https://api.dicebear.com/7.x/personas/svg?seed=Ember",
  "https://api.dicebear.com/7.x/personas/svg?seed=Cosmic",
  "https://api.dicebear.com/7.x/personas/svg?seed=Stellar",
  "https://api.dicebear.com/7.x/personas/svg?seed=Lunar",
  "https://api.dicebear.com/7.x/personas/svg?seed=Solar",
  "https://api.dicebear.com/7.x/personas/svg?seed=Nebula",
  "https://api.dicebear.com/7.x/personas/svg?seed=Galaxy",
  "https://api.dicebear.com/7.x/personas/svg?seed=Comet",
  "https://api.dicebear.com/7.x/personas/svg?seed=Asteroid",
  "https://api.dicebear.com/7.x/personas/svg?seed=Meteor",
  "https://api.dicebear.com/7.x/personas/svg?seed=Orbit",
  "https://api.dicebear.com/7.x/personas/svg?seed=Cosmos",
  "https://api.dicebear.com/7.x/personas/svg?seed=Universe",
  "https://api.dicebear.com/7.x/personas/svg?seed=Infinity",
  "https://api.dicebear.com/7.x/personas/svg?seed=Quantum",
  "https://api.dicebear.com/7.x/personas/svg?seed=Dimension",
  "https://api.dicebear.com/7.x/personas/svg?seed=Reality",

  // Additional unique styles - 20 avatars
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure1",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure2",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure3",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure4",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure5",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Smile1",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Smile2",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Smile3",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Smile4",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Smile5",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun1",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun2",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun3",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun4",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun5",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=Peeps1",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=Peeps2",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=Peeps3",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=Peeps4",
  "https://api.dicebear.com/7.x/open-peeps/svg?seed=Peeps5",
]

export default function Profile() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [profileData, setProfileData] = useState({
    name: "",
    avatar: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [existingUsernames, setExistingUsernames] = useState<string[]>([])

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        avatar: profile.avatar || "",
      })

      // Set selected avatar based on profile
      if (profile.avatar) {
        setSelectedAvatar(profile.avatar)
      }
    }

    // Fetch existing usernames for uniqueness check
    if (user?.id) {
      fetchExistingUsernames()
    }
  }, [profile, user])

  const fetchExistingUsernames = async () => {
    try {
      // Only proceed if we have a valid user ID
      if (!user?.id) {
        console.log("No user ID available, skipping username fetch")
        return
      }

      const { data, error } = await supabase.from("profiles").select("name").neq("id", user.id)

      if (error) throw error

      const hasStringName = (item: { name: unknown }): item is { name: string } => typeof item.name === "string"
      const usernames = (data ?? []).filter(hasStringName).map((item) => item.name.toLowerCase())
      setExistingUsernames(usernames)
    } catch (error) {
      console.error("Error fetching usernames:", error)
      // Don't show error to user for this background operation
      setExistingUsernames([])
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))

    // Check for username uniqueness when name field changes
    if (name === "name") {
      validateUsername(value)
    }
  }

  const validateUsername = (username: string) => {
    setNameError(null)

    if (!username.trim()) {
      setNameError("Username cannot be empty")
      return false
    }

    // Check if username already exists (case insensitive)
    if (existingUsernames.includes(username.toLowerCase())) {
      setNameError("This username is already taken by someone in your network")
      return false
    }

    return true
  }

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
  }

  const handleAvatarSave = async () => {
    if (!selectedAvatar) return

    try {
      if (!user) throw new Error("No user found")

      const { error } = await supabase.from("profiles").update({ avatar: selectedAvatar }).eq("id", user.id)

      if (error) throw error

      setProfileData((prev) => ({ ...prev, avatar: selectedAvatar }))
      setShowAvatarDialog(false)

      toast({
        title: "Profile Updated Successfully!",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating avatar:", error)
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = () => {
    setShowSignOutDialog(false)
    signOut()
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate username before submission
    if (!validateUsername(profileData.name)) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error("No user found")

      const updates = {
        id: user.id,
        name: profileData.name,
        avatar: profileData.avatar,
        updated_at: new Date(),
      }

      const { error } = await supabase.from("profiles").upsert(updates)

      if (error) throw error

      // Show success message
      toast({
        title: "Profile Updated Successfully!",
        description: "Your profile changes have been saved successfully.",
      })

      // Update the existing usernames list
      if (user?.id) {
        fetchExistingUsernames()
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailRedirect = () => {
    window.location.href =
      "mailto:tribenetworkteam@gmail.com?subject=Service Provider Application&body=I would like to become a service provider on Tribe. Here are my details:%0A%0AName: %0AService Type: %0AExperience: %0AContact: "
  }

  if (!user || !profile) return null

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-3xl">
      {/* Update the profile card design to be more modern */}
      <Card className="rounded-xl shadow-md border border-border overflow-hidden">
        <CardHeader className="bg-card border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">Your Profile</CardTitle>
          <CardDescription>Update your personal information visible to other users</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
              {/* Update the Avatar component in the profile form */}
              <Avatar className="w-24 h-24 rounded-full border-2 border-primary/20 mx-auto sm:mx-0">
                <AvatarImage
                  src={profileData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  alt={profileData.name}
                />
                <AvatarFallback>{profileData.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-medium text-foreground">{profileData.name || "Your Name"}</h3>
                <p className="text-sm text-muted-foreground mb-3">Update your profile picture and personal details</p>
                <Button
                  onClick={() => setShowAvatarDialog(true)}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 rounded-full"
                >
                  Change Avatar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled
                title="Name changes are temporarily locked"
                className={`w-full p-3 rounded-lg border ${nameError ? "border-red-500" : "border-border"} bg-background`}
              />
              {nameError && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {nameError}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">This is how you'll appear to others in your network.</p>
              <p className="text-xs text-muted-foreground">Name changes are temporarily locked for security. We'll update it for you.</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
                <Label htmlFor="theme-toggle" className="flex items-center space-x-2">
                  {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>{theme === "dark" ? "Dark" : "Light"} Mode</span>
                </Label>
              </div>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                disabled
                title="Profile updates are temporarily limited. Name changes are locked."
              >
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Become a Service Provider
          </CardTitle>
          <CardDescription>Offer your skills and services to the Tribe community</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              We're currently reviewing service provider applications to ensure quality and authenticity. If you'd like
              to offer your services on Tribe, please contact us directly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">Available service categories:</h3>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-1" /> Video Editing
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-1" /> Web Development
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-1" /> Marketing Support
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-1" /> Event Management
                </li>
              </ul>
            </div>
            <Button
              onClick={handleEmailRedirect}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-lg border-0 overflow-hidden bg-red-50 dark:bg-red-900/10">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-200">Sign Out from Tribe</h3>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                You'll need to sign in again to access your account
              </p>
            </div>
            <Button
              onClick={() => setShowSignOutDialog(true)}
              variant="destructive"
              className="flex items-center justify-center gap-2 rounded-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-destructive" />
              Confirm Sign Out
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSignOutDialog(false)}
              className="sm:w-auto w-full rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="sm:w-auto w-full flex items-center gap-2 rounded-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avatar Selection Dialog - UPDATED for better scrolling and proportions */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Choose Your Profile Picture</DialogTitle>
            <DialogDescription className="pt-2">
              Select from over 100 unique avatars! Choose one that represents your personality.
            </DialogDescription>
          </DialogHeader>

          {/* Avatar grid container with improved scrolling */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div
              className="flex-1 overflow-y-auto pr-4 pb-4 custom-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
              }}
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 py-4">
                {profilePictures.map((pic, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                      selectedAvatar === pic ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"
                    }`}
                    onClick={() => handleAvatarSelect(pic)}
                  >
                    <div className="aspect-square bg-card flex items-center justify-center relative p-2">
                      <img
                        src={pic || "/placeholder.svg"}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                      {selectedAvatar === pic && (
                        <div className="absolute top-1 right-1 bg-primary rounded-full p-1 shadow-md">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom scrollbar styles */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(156, 163, 175, 0.5);
              border-radius: 20px;
              border: 2px solid transparent;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(156, 163, 175, 0.8);
            }
          `}</style>

          <DialogFooter className="flex sm:justify-end gap-2 pt-4 mt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setShowAvatarDialog(false)}
              className="sm:w-auto w-full rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleAvatarSave} className="sm:w-auto w-full rounded-full" disabled={!selectedAvatar}>
              Save Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
