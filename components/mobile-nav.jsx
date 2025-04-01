"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, PiggyBank, LineChart, History, Settings, HelpCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path
  }

  const handleSecondaryNavClick = (label) => {
    toast.success(`${label} page coming soon`)
  }

  const mainNavItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/savings", label: "Savings", icon: PiggyBank },
    { href: "/investments", label: "Investments", icon: LineChart },
    { href: "/transactions", label: "Transactions", icon: History },
  ]

  const secondaryNavItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & Support", icon: HelpCircle },
  ]

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="px-3">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Main Menu</h2>
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive(item.href) ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      <Separator />

      <div className="px-3">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Account</h2>
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleSecondaryNavClick(item.label)}
                className="w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

