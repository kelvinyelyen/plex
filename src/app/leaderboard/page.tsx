"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"

// Reusing LeaderboardAnimation logic but adapting for specific content types if needed
// Or generic "Chart" animations for the leaderboard view
const BarChartAnimation = () => (
    <div className="flex items-end justify-between w-24 h-24 p-2 bg-muted/20 rounded-md gap-1">
        {[40, 70, 50, 90, 60, 80].map((h, i) => (
            <motion.div
                key={i}
                className="bg-primary w-full rounded-t-sm"
                animate={{ height: [`${h}%`, `${h * 0.7}%`, `${h}%`] }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            />
        ))}
    </div>
)

const LineChartAnimation = () => (
    <div className="flex items-end justify-between w-24 h-24 p-2 bg-muted/20 rounded-md gap-0.5">
        {[20, 35, 45, 30, 55, 65, 50, 70, 60, 80].map((h, i) => (
            <motion.div
                key={i}
                className="bg-primary w-1 rounded-full"
                initial={{ height: `${h}%` }}
                animate={{ height: [`${h}%`, `${h * 0.8}%`, `${h}%`] }}
                transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
            />
        ))}
    </div>
)

const ScatterPlotAnimation = () => (
    <div className="grid grid-cols-5 gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md items-center justify-center">
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                className="bg-primary rounded-full w-1.5 h-1.5"
                animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random()
                }}
            />
        ))}
    </div>
)

const GridAnimation = () => (
    <div className="grid grid-cols-5 gap-0.5 w-24 h-24 p-2 bg-muted/20 rounded-md">
        {[...Array(25)].map((_, i) => (
            <motion.div
                key={i}
                className="bg-primary/50 w-full h-full rounded-[1px]"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                }}
            />
        ))}
    </div>
)

const ChimpLeaderboardAnimation = () => (
    <div className="grid grid-cols-3 gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md">
        {[1, 2, 3].map((n, i) => (
            <motion.div
                key={i}
                className="flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-sm h-6 w-6"
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5
                }}
            >
                {n}
            </motion.div>
        ))}
    </div>
)

const PulseLeaderboardAnimation = () => (
    <div className="flex items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md">
        <motion.div
            className="w-16 h-1 bg-primary/20 rounded-full overflow-hidden"
        >
            <motion.div
                className="h-full bg-primary"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
        </motion.div>
    </div>
)

const SplitLeaderboardAnimation = () => (
    <div className="flex items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md">
        <div className="flex gap-2">
            <motion.div
                className="w-4 h-12 bg-primary rounded-sm"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div
                className="w-4 h-12 bg-primary/50 rounded-sm"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
        </div>
    </div>
)

export default function LeaderboardIndexPage() {
    return (
        <div className="container min-h-screen bg-background py-8">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-mono font-bold uppercase tracking-tighter">Archives</h1>
                    <p className="text-muted-foreground text-sm">Review global performance metrics and rankings.</p>
                </div>

                <hr className="border-border" />

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Sudoku */}
                    <Link href="/leaderboard/sudoku" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><BarChartAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Sudoku</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Global performance index.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Memory Grid */}
                    <Link href="/leaderboard/memory-grid" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><LineChartAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Memory Grid</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Retention capacity metrics.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Conundra */}
                    <Link href="/leaderboard/conundra" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><ScatterPlotAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Conundra</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Arithmetic efficiency ratings.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Schulte */}
                    <Link href="/leaderboard/schulte" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><GridAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Schulte</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Peripheral scan speed data.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Chimp */}
                    <Link href="/leaderboard/chimp" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><ChimpLeaderboardAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Chimp</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Working memory capacity.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Pulse Reaction */}
                    <Link href="/leaderboard/pulse-reaction" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><PulseLeaderboardAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Pulse Rxn</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Cognitive latency metrics.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Split Decision */}
                    <Link href="/leaderboard/split-decision" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><SplitLeaderboardAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Split Dec</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Sorting efficiency index.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
