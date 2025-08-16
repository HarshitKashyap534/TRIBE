"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bug, MessageSquare, Shield, Mail, Users, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

export default function ReportPage() {
  const handleEmailReport = (subject: string) => {
    window.location.href = `mailto:tribenetworkteam@gmail.com?subject=${encodeURIComponent(subject)}`
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border border-border shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <CardTitle className="text-3xl font-bold">Report an Issue</CardTitle>
                <p className="text-blue-100 mt-2">
                  We're committed to making Tribe a safe and enjoyable platform for everyone. Your feedback helps us
                  improve.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Bug className="w-4 h-4" /> Technical
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Content
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Feedback
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Bug className="w-5 h-5" /> Technical Issues
                  </h3>
                  <p className="mt-2 text-blue-700 dark:text-blue-300">
                    Experiencing bugs, glitches, or performance problems? Help us identify and resolve technical issues
                    to ensure Tribe runs smoothly.
                  </p>
                </div>

                <div className="grid gap-4 mt-4">
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <h4 className="font-medium">Common Technical Issues:</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full p-1 mt-0.5">
                          <Bug className="w-3 h-3" />
                        </span>
                        <span>App crashes or freezes during use</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full p-1 mt-0.5">
                          <Bug className="w-3 h-3" />
                        </span>
                        <span>Features not working as expected</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full p-1 mt-0.5">
                          <Bug className="w-3 h-3" />
                        </span>
                        <span>Login or authentication problems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full p-1 mt-0.5">
                          <Bug className="w-3 h-3" />
                        </span>
                        <span>Display or UI rendering issues</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={() => handleEmailReport("Technical Issue Report")}>
                  <Mail className="w-4 h-4 mr-2" />
                  Report Technical Issue
                </Button>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Content Concerns
                  </h3>
                  <p className="mt-2 text-red-700 dark:text-red-300">
                    Found inappropriate content that violates our community guidelines? Help us maintain a respectful
                    environment by reporting content that disrupts your experience.
                  </p>
                </div>

                <div className="grid gap-4 mt-4">
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <h4 className="font-medium">Reportable Content:</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full p-1 mt-0.5">
                          <Shield className="w-3 h-3" />
                        </span>
                        <span>Harassment or bullying</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full p-1 mt-0.5">
                          <Shield className="w-3 h-3" />
                        </span>
                        <span>Hate speech or discrimination</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full p-1 mt-0.5">
                          <Shield className="w-3 h-3" />
                        </span>
                        <span>Misinformation or fake news</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full p-1 mt-0.5">
                          <Shield className="w-3 h-3" />
                        </span>
                        <span>Spam or scam content</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  variant="destructive"
                  onClick={() => handleEmailReport("Content Violation Report")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Report Inappropriate Content
                </Button>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" /> Suggestions & Feedback
                  </h3>
                  <p className="mt-2 text-green-700 dark:text-green-300">
                    Have ideas for new features or improvements? Share your vision for how we can make Tribe even better
                    for the university community.
                  </p>
                </div>

                <div className="grid gap-4 mt-4">
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <h4 className="font-medium">We Welcome Feedback On:</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full p-1 mt-0.5">
                          <Lightbulb className="w-3 h-3" />
                        </span>
                        <span>New feature ideas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full p-1 mt-0.5">
                          <Lightbulb className="w-3 h-3" />
                        </span>
                        <span>User interface improvements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full p-1 mt-0.5">
                          <Lightbulb className="w-3 h-3" />
                        </span>
                        <span>Community engagement suggestions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full p-1 mt-0.5">
                          <Lightbulb className="w-3 h-3" />
                        </span>
                        <span>Content and event ideas</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={() => handleEmailReport("Feature Suggestion")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </TabsContent>

              <TabsContent value="account" className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Account Support
                  </h3>
                  <p className="mt-2 text-purple-700 dark:text-purple-300">
                    Need assistance with your account? Reach out for help with login issues, settings, or any
                    account-related questions.
                  </p>
                </div>

                <div className="grid gap-4 mt-4">
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <h4 className="font-medium">Common Account Issues:</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full p-1 mt-0.5">
                          <Users className="w-3 h-3" />
                        </span>
                        <span>Password reset problems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full p-1 mt-0.5">
                          <Users className="w-3 h-3" />
                        </span>
                        <span>Email verification issues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full p-1 mt-0.5">
                          <Users className="w-3 h-3" />
                        </span>
                        <span>Profile settings questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full p-1 mt-0.5">
                          <Users className="w-3 h-3" />
                        </span>
                        <span>Account security concerns</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  variant="secondary"
                  onClick={() => handleEmailReport("Account Support Request")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get Account Support
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="bg-muted/30 p-6 border-t border-border">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Response Time</h3>
                </div>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">12-24 hours</span>
              </div>

              <p className="text-sm text-muted-foreground">
                We aim to respond to all inquiries within <strong>12-24 hours</strong>. Your input is invaluable in
                shaping Tribe into a platform that serves everyone better. Thank you for helping us grow and improve
                together!
              </p>

              <div className="pt-4 border-t border-border flex justify-center">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  size="lg"
                  onClick={() => handleEmailReport("General Inquiry")}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Support Team
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
