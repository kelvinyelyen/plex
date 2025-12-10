"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SudokuAnimation, MemoryAnimation, LeaderboardAnimation, ConundraAnimation } from "@/components/ui/game-animations"

const features = [
    {
        title: "Sudoku",
        description: "Classic logic-based number placement puzzle.",
        href: "/games/sudoku",
        animation: <div className="mx-auto mb-4"><SudokuAnimation /></div>
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
        title: "Leaderboard",
        description: "See how you stack up against other players.",
        href: "/leaderboard",
        animation: <div className="mx-auto mb-4"><LeaderboardAnimation /></div>
    },
]

export function Features() {
    return (
        <section className="container my-4 lg:-my-20 py-8 md:py-12 lg:py-24">
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                {features.map((feature) => (
                    <Link key={feature.title} href={feature.href}>
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
