import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export default function GamesPage() {
    return (
        <div className="container min-h-screen bg-background py-8">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-mono font-bold uppercase tracking-tighter">Games</h1>
                    <p className="text-muted-foreground text-sm">Choose a game to begin training.</p>
                </div>

                <hr className="border-border" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Sudoku Module Card */}
                    <Link href="/games/sudoku" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Logic
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-3 gap-2 w-48 h-48">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-full h-full"
                                        style={{ opacity: Math.random() * 0.5 + 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Sudoku</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Classic numerical placement puzzle. Optimizes pattern recognition and logical deduction.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Memory Grid Module Card */}
                    <Link href="/games/memory-grid" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Memory
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-4 gap-2 w-48 h-48">
                                {[...Array(16)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-full h-full"
                                        style={{ opacity: Math.random() * 0.5 + 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Memory Grid</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Visual pattern retention game. Enhances short-term memory and spatial recall.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Conundra Module Card */}
                    <Link href="/games/conundra" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Math
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex gap-4 text-6xl font-bold font-mono">
                                <span>+</span>
                                <span>-</span>
                                <span>×</span>
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Conundra</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Arithmetic puzzle challenge. Combine numbers to reach the target.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Schulte Table Module Card */}
                    <Link href="/games/schulte" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Focus
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
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Schulte</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Peripheral vision trainer. Find numbers 1-25 in ascending order.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Chimp Test Module Card */}
                    <Link href="/games/chimp" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Working Memory
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
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Chimp</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Primate-level memory test. Recall hidden variances.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Pulse Reaction Module Card */}
                    <Link href="/games/pulse-reaction" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Latency
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="w-32 h-32 rounded-full border-[16px] border-foreground/50" />
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Pulse Rxn</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Cognitive latency calibration. Sync with optimal brightness.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Split Decision Module Card */}
                    <Link href="/games/split-decision" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Attention
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="relative w-32 h-48">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-foreground" />
                                <div className="absolute bottom-0 left-0 w-8 h-1 bg-foreground" />
                                <div className="absolute bottom-0 right-0 w-8 h-1 bg-foreground" />
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Split Dec</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Rapid categorization protocols. Test mental flexibility.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
