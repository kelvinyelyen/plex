"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"
import { useSession } from "next-auth/react"
import { ModeToggle } from "@/components/layout/mode-toggle"

export function Header() {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">PLEX</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/games"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Games
                        </Link>
                        <Link
                            href="/leaderboard"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Leaderboard
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search or other controls here if needed */}
                    </div>
                    <nav className="flex items-center gap-2">
                        <ModeToggle />
                        {session?.user ? (
                            <UserNav user={session.user} />
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
