import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className, size = "default" }) {
  const sizeClasses = {
    small: "text-lg",
    default: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl",
  }

  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full"></div>
        <div className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-1.5 rounded-full">
          <TrendingUp className={size === "small" ? "h-4 w-4" : "h-5 w-5"} />
        </div>
      </div>
      <span
        className={cn(
          "font-bold italic bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight",
          sizeClasses[size],
        )}
      >
        FinFlow
      </span>
    </Link>
  )
}

