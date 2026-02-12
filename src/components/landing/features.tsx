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
    // Top 3 Popular Games (Manually selected for showcase)
    const popularTitles = ["Pulse Reaction", "Memory Grid", "Schulte Table"]

    const popularFeatures = features.filter(f => popularTitles.includes(f.title))
    const otherFeatures = features.filter(f => !popularTitles.includes(f.title))

    return (
        <section className="container lg:-my-20 py-8 md:py-12 lg:py-24 space-y-12">

            {/* Popular Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-mono font-bold uppercase tracking-widest">Popular Games</h2>
                    <div className="md:hidden">
                        {session?.user ? (
                            <UserNav user={session.user} />
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="font-mono uppercase text-xs tracking-wider rounded-none px-2">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex w-full gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar">
                    {popularFeatures.map((feature) => (
                        <Link key={feature.title} href={feature.href} className="flex-shrink-0 w-[85vw] sm:w-[350px] snap-center">
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
            </div>

            {/* All Games Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-mono font-bold uppercase tracking-widest">All Challenges</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {otherFeatures.map((feature) => (
                        <Link key={feature.title} href={feature.href} className="w-full">
                            <Card className="h-full transition-all hover:bg-muted/50 hover:border-primary/50 group overflow-hidden rounded-none border-foreground/10">
                                <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                    <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                        {feature.animation}
                                    </div>
                                    <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">{feature.title}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
