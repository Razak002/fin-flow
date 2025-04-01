"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, User, BarChart3, PiggyBank, LineChart, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

export function DashboardHeader() {
  const { userData } = useStore()
  const pathname = usePathname()

  const handleProfileClick = () => {
    toast.success("Profile page coming soon")
  }

  const handleSettingsClick = () => {
    toast.success("Settings page coming soon")
  }

  const handleLogoutClick = () => {
    toast.success("Logged out successfully")
  }

  const isActive = (path) => {
    return pathname === path
  }

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/savings", label: "Savings", icon: PiggyBank },
    { href: "/investments", label: "Investments", icon: LineChart },
    { href: "/transactions", label: "Transactions", icon: History },
  ]

  return (
    <header className="px-4 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-4 mr-4 ">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-2 py-4">
                <Logo size="default" />
              </div>
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Logo />
        </div>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => {
              toast.success("You have 3 unread notifications")
            }}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">{userData?.name?.split(" ")[0] || "Account"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="rounded-full bg-muted p-1">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{userData?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{userData?.email || "user@example.com"}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogoutClick}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

