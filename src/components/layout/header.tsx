"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"
import { useSession } from "next-auth/react"
import { ModeToggle } from "@/components/layout/mode-toggle"

export function Header() {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md">
            <div className="w-full flex h-16 items-center justify-between px-8 md:px-16">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-3 h-3 bg-primary rounded-sm group-hover:animate-pulse" />
                        <span className="font-display italic font-bold text-xl tracking-tight">PLEX</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                        <span>::</span>
                        <span>SYS.NAV</span>
                    </div>

                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/games"
                            className="text-xs font-mono uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            [ Modules ]
                        </Link>
                        <Link
                            href="/leaderboard"
                            className="text-xs font-mono uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            [ Data ]
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-muted-foreground border-r border-foreground/10 pr-4 mr-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>NET.SECURE</span>
                    </div>

                    <ModeToggle />

                    {session?.user ? (
                        <UserNav user={session.user} />
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-mono text-xs uppercase tracking-wider hover:bg-foreground/5">
                                {"/// Login"}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
