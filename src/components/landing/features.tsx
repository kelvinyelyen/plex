"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ConundraAnimation, MemoryAnimation, SudokuAnimation, PulseAnimation, SplitAnimation, SchulteAnimation, ChimpAnimation } from "@/components/ui/game-animations"

const features = [
    {
        title: "Sudoku",
        description: "Classic logic-based number placement puzzle.",
        href: "/games/sudoku",
        animation: <div className="mx-auto mb-4"><SudokuAnimation /></div>
    },
    {
        title: "Split Decision",
        description: "Rapid sorting challenge. Even/Odd, Prime/Not.",
        href: "/games/split-decision",
        animation: <div className="mx-auto mb-4"><SplitAnimation /></div>
    },
    {
        title: "Schulte Table",
        description: "Peripheral vision and speed reading trainer.",
        href: "/games/schulte",
        animation: <div className="mx-auto mb-4"><SchulteAnimation /></div>
    },

    {
        title: "Chimp Test",
        description: "Working memory. Reproduce patterns from memory.",
        href: "/games/chimp",
        animation: <div className="mx-auto mb-4"><ChimpAnimation /></div>
    },
    {
        title: "Memory Grid",
        description: "Test your visual memory and pattern recognition.",
        href: "/games/memory-grid",
        animation: <div className="mx-auto mb-4"><MemoryAnimation /></div>
    },
    {
        title: "Conundra",
        description: "Arithmetic puzzle challenge. Combine numbers to reach the target.",
        href: "/games/conundra",
        animation: <div className="mx-auto mb-4"><ConundraAnimation /></div>
    },
    {
        title: "Pulse Reaction",
        description: "Cognitive latency test.",
        href: "/games/pulse-reaction",
        animation: <div className="mx-auto mb-4"><PulseAnimation /></div>
    },
]

export function Features() {
    const { data: session } = useSession()
    return (
        <section className="container lg:-my-20 py-8 md:py-12 lg:py-24">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-mono font-bold uppercase tracking-widest">Popular Games</h2>
                    <div className="md:hidden">
                        {session?.user ? (
                            <UserNav user={session.user} />
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-mono uppercase text-xs tracking-wider px-2">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.map((feature) => (
                        <Link
                            key={feature.title}
                            href={feature.href}
                            className={`w-full ${feature.title === "Sudoku" ? "col-span-2 md:col-span-1" : ""}`}
                        >
                            <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                                <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                    <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                        {feature.animation}
                                    </div>
                                    <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">{feature.title}</CardTitle>
                                    <CardDescription className="text-center text-xs pt-2 line-clamp-1">{feature.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
