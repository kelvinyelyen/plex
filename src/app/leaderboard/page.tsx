import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowUpRight } from "lucide-react"

export default function LeaderboardIndexPage() {
    return (
        <div className="min-h-screen bg-background py-16 px-8 md:px-16">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex items-end justify-between border-b border-foreground/10 pb-8">
                    <div className="space-y-2">
                        <h1 className="font-display italic text-5xl md:text-7xl">Archives</h1>
                        <p className="font-mono text-sm text-muted-foreground max-w-md">
                            {"// ACCESS_DATA"} <br />
                            Review global performance metrics and cognitive rankings.
                        </p>
                    </div>
                    <div className="hidden md:block font-mono text-xs text-muted-foreground text-right">
                        <span>NET.STATUS: ONLINE</span> <br />
                        <span>DATA_STREAMS: 01</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Sudoku Archive Card */}
                    <Link href="/leaderboard/sudoku" className="group relative block h-[400px] border border-foreground/10 bg-background hover:border-foreground/30 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="font-mono text-xs text-muted-foreground">
                                DAT_01 :: RANKING
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual - Bar Chart */}
                        <div className="absolute inset-0 flex items-end justify-center pb-24 px-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex items-end justify-between w-full h-32 gap-2">
                                {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-full"
                                        style={{
                                            height: `${h}%`,
                                            opacity: Math.random() * 0.5 + 0.5
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                <h2 className="font-display text-3xl font-bold">Sudoku</h2>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                                Global performance index for logic placement protocols. Top percentile analysis.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono text-xs uppercase tracking-widest">
                                    Access Data
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Memory Grid Archive Card */}
                    <Link href="/leaderboard/memory-grid" className="group relative block h-[400px] border border-foreground/10 bg-background hover:border-foreground/30 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="font-mono text-xs text-muted-foreground">
                                DAT_02 :: RANKING
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual - Line Chart */}
                        <div className="absolute inset-0 flex items-end justify-center pb-24 px-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex items-end justify-between w-full h-32 gap-1">
                                {[20, 35, 45, 30, 55, 65, 50, 70, 60, 80].map((h, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-1"
                                        style={{
                                            height: `${h}%`,
                                            opacity: 0.5 + (i / 10) * 0.5
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                <h2 className="font-display text-3xl font-bold">Memory Grid</h2>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                                Retention capacity metrics. Level progression analysis.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono text-xs uppercase tracking-widest">
                                    Access Data
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Placeholder for Future Archives */}
                    <div className="h-[400px] border border-foreground/5 bg-foreground/5 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <p className="font-mono text-xs text-muted-foreground">DAT_02 :: ENCRYPTED</p>
                            <p className="font-display italic text-xl text-muted-foreground/50">Awaiting Input</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
