"use client"

import Link from "next/link"
import { Users } from "lucide-react"
import { TribeLogo } from "@/components/tribe-logo"
import { motion } from "framer-motion"

export function TopBar() {
  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-border bg-background">
      <Link href="/" className="flex items-center space-x-2">
        <TribeLogo />
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl text-foreground leading-tight">Tribe</h1>
          {/* <p className="text-[10px] text-muted-foreground/70 font-medium tracking-wide -mt-1 italic">
            Exclusively For<br />Marwadi University
          </p> */}
        </div>
      </Link>
      {/* <motion.div
        className="flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative px-4 py-1.5 bg-background rounded-full border border-blue-400 dark:border-blue-600 flex items-center gap-2 shadow-md">
            <Users className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                50+ Active Users
              </span>
              <span className="text-[10px] text-muted-foreground">Join the community</span>
            </div>
          </div>
        </div>
      </motion.div> */}
    </div>
  )
}
