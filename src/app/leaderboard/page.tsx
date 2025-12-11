import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowUpRight } from "lucide-react"

export default function LeaderboardIndexPage() {
    return (
        <div className="container min-h-screen bg-background py-16">
            <div className="space-y-12">
                <div className="flex items-end justify-between border-b pb-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-mono font-bold uppercase tracking-tight">Archives</h1>
                        <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                            Review global performance metrics and rankings.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Sudoku Archive Card */}
                    <Link href="/leaderboard/sudoku" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Ranking
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual - Bar Chart */}
                        <div className="absolute inset-0 flex items-end justify-center pb-24 px-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex items-end justify-between w-full h-32 gap-2">
                                {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-full rounded-t-sm"
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
                                <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Sudoku</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Global performance index for Sudoku. Top percentile analysis.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider rounded-none">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Memory Grid Archive Card */}
                    <Link href="/leaderboard/memory-grid" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Ranking
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual - Line Chart */}
                        <div className="absolute inset-0 flex items-end justify-center pb-24 px-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex items-end justify-between w-full h-32 gap-1">
                                {[20, 35, 45, 30, 55, 65, 50, 70, 60, 80].map((h, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-1 rounded-full"
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
                                <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Memory Grid</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Retention capacity metrics. Level progression analysis.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider rounded-none">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Conundra Archive Card */}
                    <Link href="/leaderboard/conundra" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Ranking
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual - Scatter Plot */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-5 gap-4 w-64 h-64">
                                {[...Array(25)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground rounded-full w-2 h-2"
                                        style={{
                                            opacity: Math.random() * 0.8 + 0.2,
                                            transform: `scale(${Math.random() * 1.5 + 0.5})`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Conundra</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Arithmetic efficiency ratings. Solution speed analysis.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider rounded-none">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Schulte Table Archive Card */}
                    <Link href="/leaderboard/schulte" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Ranking
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-5 gap-1 w-48 h-48">
                                {[...Array(25)].map((_, i) => (
                                    <div key={i} className="bg-foreground w-full h-full" style={{ opacity: Math.random() > 0.5 ? 0.8 : 0.2 }} />
                                ))}
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Schulte</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Peripheral scan speed data. Focus retention metrics.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider rounded-none">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Chimp Test Archive Card */}
                    <Link href="/leaderboard/chimp" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Content
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-3 gap-4 w-48 h-48">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="bg-foreground w-full h-full" style={{ opacity: i % 2 === 0 ? 1 : 0 }} />
                                ))}
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Chimp</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Working memory capacity. Sequential recall stats.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider rounded-none">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Pulse Reaction Archive Card */}
                    <Link href="/leaderboard/pulse-reaction" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Ranking
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual - Pulse Wave */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex items-center gap-1">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-4 bg-foreground rounded-full"
                                        style={{
                                            height: i === 4 ? '64px' : i === 3 || i === 5 ? '48px' : i === 2 || i === 6 ? '32px' : '16px',
                                            opacity: 0.2 + (i === 4 ? 0.8 : 0.4)
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Pulse Rxn</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Cognitive latency metrics. Reaction precision analysis.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider rounded-none">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Split Decision Archive Card */}
                    <Link href="/leaderboard/split-decision" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Ranking
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual - Split/Diverge */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="relative w-32 h-32">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rounded-full" />
                                <div className="absolute top-1/2 left-0 w-4 h-4 bg-foreground rounded-full" />
                                <div className="absolute top-1/2 right-0 w-4 h-4 bg-foreground rounded-full" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rounded-full" />
                                {/* Cross lines */}
                                <div className="absolute top-2 left-1/2 w-0.5 h-28 bg-foreground -translate-x-1/2 rotate-45 origin-center" />
                                <div className="absolute top-2 left-1/2 w-0.5 h-28 bg-foreground -translate-x-1/2 -rotate-45 origin-center" />
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Split Dec</h2>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Sorting efficiency index. Cognitive branch analysis.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider rounded-none">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
