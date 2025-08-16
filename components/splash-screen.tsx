"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TribeLogo } from "@/components/tribe-logo"

export function SplashScreen() {
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSplashScreen(false)
    }, 2000) // Hide after 2 second

    return () => clearTimeout(timeoutId)
  }, [])

  if (!showSplashScreen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <TribeLogo className="w-24 h-24 mx-auto text-white" />
        </motion.div>
        <motion.h1
          className="text-4xl font-bold text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Tribe
        </motion.h1>
        <motion.p
          className="text-sm italic text-white mt-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Raise your words, not your voice. It is rain that grows flowers, not thunder
        </motion.p>
      </div>
    </motion.div>
  )
}
