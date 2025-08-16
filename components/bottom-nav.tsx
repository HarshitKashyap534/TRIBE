"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Ghost, Info, Briefcase, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/confessions", icon: Ghost, label: "Confessions" },
  {
    href: "/mast-head",
    icon: (isActive) => <Info className={`h-6 w-6 ${isActive ? "text-primary" : ""}`} />,
    label: "TRIBE",
  },
  { href: "/services", icon: Briefcase, label: "Services" },
  { href: "/events", icon: CalendarDays, label: "Events" },
  { href: "/profile", icon: null, label: "Profile" }, // We'll handle this separately
]

export function BottomNav() {
  const pathname = usePathname()
  const { profile } = useAuth()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-[100] shadow-2xl"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          // Special handling for profile
          if (item.href === "/profile") {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <motion.div whileTap={{ scale: 0.8 }} className="relative">
                    <Avatar className="w-6 h-6 ring-2 ring-primary/20">
                      <AvatarImage
                        src={profile?.avatar || `/avatars/cartoon${(profile?.id % 5) + 1}.png`}
                        alt={profile?.name}
                      />
                      <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <span className="text-xs font-medium relative z-10">{item.label}</span>
                </motion.div>
              </Link>
            )
          }

          // For all other items
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <motion.div whileTap={{ scale: 0.8 }} className="relative z-10">
                  {typeof item.icon === "function" ? item.icon(isActive) : <item.icon className="w-6 h-6 mb-1" />}
                </motion.div>

                <span className="text-xs font-medium relative z-10">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
