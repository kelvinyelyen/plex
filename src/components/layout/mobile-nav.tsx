"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Gamepad2, Trophy, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()

    // Hide on starter page (Root)
    if (pathname === "/") return null



    const links = [
        {
            href: "/home",
            label: "Home",
            icon: Home
        },
        {
            href: "/games",
            label: "Games",
            icon: Gamepad2
        },
        {
            href: "/leaderboard",
            label: "Ranks",
            icon: Trophy
        },
        {
            href: "/settings",
            label: "Settings",
            icon: Settings
        }
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 backdrop-blur-lg md:hidden pb-safe">
            {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href))
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
                            isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                        <span className="text-[10px] font-medium font-mono uppercase tracking-wider">{label}</span>
                    </Link>
                )
            })}
        </div>
    )
}
