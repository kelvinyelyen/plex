"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ConundraAnimation, LeaderboardAnimation, MemoryAnimation, SudokuAnimation, PulseAnimation, SplitAnimation, SchulteAnimation, ChimpAnimation } from "@/components/ui/game-animations"

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
    {
        title: "Leaderboard",
        description: "See how you stack up against other players.",
        href: "/leaderboard",
        animation: <div className="mx-auto mb-4"><LeaderboardAnimation /></div>
    },
]

export function Features() {
    return (
        <section className="container lg:-my-20 py-8 md:py-12 lg:py-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-mono font-bold uppercase tracking-widest">Game Collection</h2>
            </div>
            <div className="mx-auto flex w-full gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar sm:grid sm:overflow-visible sm:pb-0 sm:justify-center sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                    <Link key={feature.title} href={feature.href} className="flex-shrink-0 w-[60vw] sm:w-auto snap-center">
                        <Card className="h-full transition-all hover:bg-muted/50 hover:border-primary/50 group overflow-hidden rounded-none border-foreground/10">
                            <CardHeader className="relative z-10 pt-8 pb-8">
                                {feature.animation}
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-lg pt-4">{feature.title}</CardTitle>
                                <CardDescription className="text-center text-xs pt-2">{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}
