"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { TribeLogo } from "@/components/tribe-logo"
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn, HelpCircle, AlertTriangle, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import type React from "react"

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key && url !== "https://placeholder.supabase.co" && key !== "placeholder-anon-key"
}

// Configuration missing component
function ConfigurationMissing() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[url('/auth-bg.jpg')] bg-cover bg-center bg-no-repeat fixed top-0 left-0 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="w-full max-w-md z-10 px-4">
        <Card className="bg-black/30 shadow-2xl backdrop-blur-md border-gray-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Configuration Required</h2>
              <p className="text-gray-400 text-sm text-center">
                Supabase environment variables are missing. Please configure them in Vercel.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-2">Add these to Vercel:</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-gray-300">NEXT_PUBLIC_SUPABASE_URL</div>
                  <div className="text-gray-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                </div>
              </div>

              <Button asChild className="w-full rounded-full">
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Vercel Dashboard
                </a>
              </Button>

              <Button variant="outline" onClick={() => window.location.reload()} className="w-full rounded-full">
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Terms and Conditions Component
const TermsDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const terms = [
    {
      title: "Acceptance of Terms",
      content: "By using Tribe, you agree to these Terms and Conditions.",
    },
    {
      title: "User Responsibilities",
      content: "You are responsible for your account activity and content.",
    },
    {
      title: "Privacy",
      content: "We respect your privacy as outlined in our Privacy Policy.",
    },
    {
      title: "Content Guidelines",
      content: "Post appropriate, respectful content that doesn't violate others' rights.",
    },
    {
      title: "Intellectual Property",
      content: "Respect copyright and intellectual property rights.",
    },
    {
      title: "Account Security",
      content: "Keep your login information secure.",
    },
    {
      title: "Prohibited Activities",
      content: "No spamming, harassment, or illegal activities.",
    },
    {
      title: "Disclaimer",
      content: 'Tribe is provided "as is" without warranties.',
    },
    {
      title: "Contact",
      content: "For questions about these terms, contact us at tribenetworkteam@gmail.com.",
    },
    {
      title: "Username Authenticity",
      content: "You must use your real username. If you do not, we will automatically update your username based on the email data you used to log in to our service.",
    },
    {
      title: "Changes to Terms",
      content: "We may update these terms; check regularly for updates.",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl bg-white text-gray-900 border border-gray-200 shadow-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-3xl font-semibold text-center tracking-tight">Terms and Conditions</DialogTitle>
          <p className="text-sm text-center text-gray-500 mt-2">Please read these terms carefully before proceeding</p>
        </DialogHeader>
        <div className="px-6">
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full mb-4" />
        </div>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 px-6 py-4 font-sans text-gray-700 text-base leading-7 divide-y divide-gray-200">
            <p>
              Welcome to Tribe! By using our platform, you agree to the following terms and conditions. Please review each point carefully:
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">1. Acceptance of Terms:</span> By accessing or using Tribe, you acknowledge and accept these Terms and Conditions in full. Your continued use constitutes ongoing acceptance.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">2. Prohibited Activities:</span> Spamming, harassment, and any illegal activities are strictly forbidden. We maintain a zero-tolerance policy for such behavior.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">3. Content Guidelines:</span> All content must be appropriate, respectful, and must not infringe upon the rights of others. Inappropriate, offensive, or illegal content is strictly prohibited.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">4. User Responsibilities:</span> You are solely responsible for all activities conducted through your account and for the content you post. Please ensure your actions reflect respect and integrity within the community.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">5. Account Security:</span> Keep your login credentials confidential and secure. You are responsible for maintaining the security of your account at all times.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">6. Password Recovery:</span> Password recovery is not possible due to privacy concerns. We will not be able to give your password back or change it in any way. If you forget your password, you must contact us at <a href="mailto:tribenetworkteam@gmail.com" className="text-blue-600 hover:text-blue-700 transition-colors">tribenetworkteam@gmail.com</a>. Please try not to forget your password and save it somewhere secure.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">7. Username Authenticity:</span> You must use your real username. If you do not, we reserve the right to automatically update your username based on the email data you used to log in to our service, ensuring authenticity and trust within the community.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">8. Privacy:</span> We are committed to protecting your privacy. Your personal information, including your name, email address, and any content you provide, is collected solely for the purpose of providing and improving our services. We do not share your personal data with third parties except as required by law or to operate Tribe’s core features. All data is stored securely, and we take reasonable measures to protect it from unauthorized access. By using Tribe, you consent to this data collection and usage policy.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">9. Intellectual Property:</span> Please respect copyright and intellectual property rights. Do not post content that you do not have the right to share.
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-900">10. Disclaimer:</span> Tribe is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.
            </p>
            <p className="mb-2 italic">
              For any questions or concerns regarding these terms, please contact us at <a href="mailto:tribenetworkteam@gmail.com" className="text-blue-600 hover:text-blue-700 transition-colors">tribenetworkteam@gmail.com</a>. We may update these terms at any time. Please review them regularly to stay informed of any changes.
            </p>
            <div className="text-xs text-gray-500 text-center pt-3 pb-1">Last updated: August 2025</div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// About Dialog Component
const AboutDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl bg-white text-gray-900 border border-gray-200 shadow-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-4xl font-bold text-center tracking-tight text-gray-900 font-sans">About Tribe</DialogTitle>
          <p className="text-sm text-center text-gray-600 mt-1">Get to know what makes Tribe special</p>
        </DialogHeader>
        <div className="px-6">
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full mb-4" />
        </div>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 px-6 py-6 font-sans text-gray-800 text-base leading-7">
            <p className="text-[15px]">
              Tribe was born from a simple frustration, campus social media either exposes everything or means nothing. Students needed a space where they could be genuinely themselves sometimes boldly, sometimes anonymously without the noise of the broader internet drowning out what actually matters on campus.
            </p>

            <p className="text-[15px]">
              We're not another social network trying to grab global attention. Tribe is purpose-built for the unique dynamics of university life, where your reputation matters but so does your ability to speak freely. Every member is verified through their university email, creating a trusted environment where students can share real experiences, seek genuine help, and connect with peers who understand their specific campus reality.
            </p>

            <p className="text-[15px]">
              Whether you're looking to vent about that impossible professor, find study partners who won't flake, discover the campus opportunities everyone's talking about, or simply connect with people beyond your usual circle, Tribe gives you the tools to engage authentically. Optional anonymity means you can choose when to attach your name and when to speak freely without consequences.
            </p>

            <p className="text-[15px]">
              This isn't about building a personal brand or chasing viral moments. It's about creating real connections and getting real things done with the people who share your daily campus experience. Your university community, amplified and accessible, with the trust and safety you deserve.
            </p>

            <p className="pt-2 border-t border-gray-200 text-center text-sm text-gray-700">
              Cohorts and teams fill quickly. Claim your handle and join the next cohort before it closes.
            </p>

            <div className="text-xs text-gray-500 text-center pt-3 pb-1">
              Tribe Network © 2025. All rights reserved.
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Main Auth Component
export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
const [showPassword, setShowPassword] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const router = useRouter()

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return <ConfigurationMissing />
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isSignUp && !termsAccepted) {
      setError("You must accept the terms and conditions to sign up.")
      setLoading(false)
      return
    }

    // Email domain validation
    const allowedDomains = ["@oziere.com", "@marwadiuniversity.ac.in"]
    const isValidDomain = allowedDomains.some((domain) => email.toLowerCase().endsWith(domain))

    if (!isValidDomain) {
      setError("Please use an email address ending with @marwadiuniversity.ac.in")
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setConfirmationSent(true)
        toast({
          title: "Sign Up Successful",
          description: "A confirmation email has been sent to your registered email address.",
        })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/create-profile")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center bg-[url('/auth-bg.jpg')] bg-cover bg-center bg-no-repeat fixed top-0 left-0 overflow-hidden">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="w-full max-w-md z-10 px-4">
        <Card className="bg-white shadow-2xl backdrop-blur-md border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <TribeLogo className="w-16 h-16 text-blue-500" />
              </motion.div>
              <motion.h2
                className="text-2xl font-bold mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome to Tribe
              </motion.h2>
              <motion.p
                className="text-gray-600 text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isSignUp ? "Create your account to get started" : "Sign in to continue your journey"}
              </motion.p>
            </div>
            <AnimatePresence mode="wait">
              {confirmationSent ? (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center px-4 py-6"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Confirmation Email Sent</h3>
                  <p className="text-gray-300 mb-2">
                    Please check your email to confirm your account. If you don't see it, check your spam folder.
                  </p>
                  <p className="text-gray-400 text-sm">
                    The email will arrive in 3-5 minutes.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="authForm"
                  onSubmit={handleAuth}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-gray-700">
                      University Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your university email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {isSignUp && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        className="border-gray-600 text-blue-500 focus:ring-blue-500 rounded"
                      />
                      <Label htmlFor="terms" className="text-xs text-gray-400">
                        I accept the{" "}
                        <button
                          type="button"
                          onClick={() => setShowTerms(true)}
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          terms and conditions
                        </button>
                      </Label>
                    </div>
                  )}
                  {error && (
                    <motion.p
                      className="text-red-500 text-sm mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 rounded-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner />
                    ) : isSignUp ? (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Sign Up
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      {isSignUp ? "Already have an account?" : "Don't have an account?"}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-1 text-blue-500 hover:text-blue-400 hover:underline focus:outline-none"
                      >
                        {isSignUp ? "Sign In" : "Sign Up"}
                      </button>
                    </p>
                  </div>

                  {/* Help text with creative hyperlink */}
                  <div className="mt-2 text-center">
                    <p className="text-xs italic text-gray-500">
                      Having trouble accessing your Tribe account?{" "}
                      <Link href="mailto:tribenetworkteam@gmail.com" className="relative inline-flex items-center group">
                        <span className="text-blue-500 group-hover:text-blue-400 transition-colors">
                          Contact our support wizards
                        </span>
                        <HelpCircle className="inline-block ml-1 w-3 h-3 text-blue-500 group-hover:text-blue-400 transition-transform group-hover:rotate-12" />
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    </p>
</div>
                  {/* About button */}
                  <div className="mt-6 text-center">
<button
                      type="button"
                      onClick={() => setShowAbout(true)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-transform duration-300 hover:scale-105"
                    >
                      <Info className="w-3 h-3" /> Learn More 
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
<TermsDialog open={showTerms} onOpenChange={setShowTerms} />
      <AboutDialog open={showAbout} onOpenChange={setShowAbout} />
      </div>
    </>
  )
}
