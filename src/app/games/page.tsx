import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

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

                    {/* Sequence Memory Module Card */}
                    <Link href="/games/sequence-memory" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Pattern
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-3 gap-2 w-32 h-32">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn("w-full h-full border-2 border-foreground", i === 4 ? "bg-foreground" : "")}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Sequence</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Pattern retention. Memorize and repeat the flashing sequence.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Aim Trainer Module Card */}
                    <Link href="/games/aim-trainer" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Precision
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="relative w-48 h-48 border border-foreground/20 rounded-full flex items-center justify-center">
                                <div className="w-32 h-32 border border-foreground/40 rounded-full flex items-center justify-center">
                                    <div className="w-16 h-16 border border-foreground/60 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-foreground rounded-full" />
                                    </div>
                                </div>
                                <div className="absolute w-full h-[1px] bg-foreground/20" />
                                <div className="absolute h-full w-[1px] bg-foreground/20" />
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Aim Trainer</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Reaction & Precision. Hit targets as quickly as possible.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Color Match (Stroop) Module Card */}
                    <Link href="/games/color-match" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Attention
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex flex-col items-center gap-2 font-black text-6xl uppercase tracking-tighter">
                                <span className="text-foreground/50">RED</span>
                                <span className="text-foreground/80">BLUE</span>
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Color Match</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Stroop Test. Does the meaning match the color?
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Number Memory Module Card */}
                    <Link href="/games/number-memory" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Memory
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="text-8xl font-black font-mono tracking-tighter text-foreground/50">
                                472
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Number Mem</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Digit span test. Memorize and recall increasing numbers.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Verbal Memory Module Card */}
                    <Link href="/games/verbal-memory" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Language
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex flex-col gap-2 font-mono text-sm text-foreground/50 uppercase tracking-widest text-center">
                                <span>House</span>
                                <span>Tree</span>
                                <span>Apple</span>
                                <span className="line-through decoration-2">House</span>
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Verbal Mem</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Word retention. Have you seen this word before?
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>



                    {/* Tower of Hanoi Module Card */}
                    <Link href="/games/hanoi" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Logic
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-2 bg-foreground rounded-full" />
                                <div className="w-16 h-2 bg-foreground rounded-full" />
                                <div className="w-24 h-2 bg-foreground rounded-full" />
                                <div className="w-32 h-2 bg-foreground/50 rounded-full" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Hanoi</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Ancient logic puzzle. Move the stack to the target beat by beat.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>



                    {/* Minesweeper Module Card */}
                    <Link href="/games/minesweeper" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Logic
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="w-8 h-8 border border-foreground/50 flex items-center justify-center">1</div>
                                <div className="w-8 h-8 border border-foreground/50 flex items-center justify-center bg-foreground/20" />
                                <div className="w-8 h-8 border border-foreground/50 flex items-center justify-center">2</div>
                                <div className="w-8 h-8 border border-foreground/50 flex items-center justify-center bg-foreground/20" />
                                <div className="w-8 h-8 border border-foreground/50 flex items-center justify-center text-red-500">⚠</div>
                                <div className="w-8 h-8 border border-foreground/50 flex items-center justify-center bg-foreground/20" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Mines</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Deduction puzzle. Clear the field without detonation.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Snake Module Card */}
                    <Link href="/games/snake" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Focus
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="relative w-32 h-32 border border-foreground/20">
                                <div className="absolute top-4 left-4 w-4 h-4 bg-foreground" />
                                <div className="absolute top-4 left-8 w-4 h-4 bg-foreground/50" />
                                <div className="absolute top-4 left-12 w-4 h-4 bg-foreground/50" />
                                <div className="absolute bottom-8 right-8 w-4 h-4 bg-foreground border border-foreground" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Snake</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Spatial navigation. Consume and grow without collision.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Whack-a-Mole Module Card */}
                    <Link href="/games/whack-a-mole" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Reflex
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="w-12 h-12 rounded-full border border-foreground/50" />
                                <div className="w-12 h-12 rounded-full bg-foreground" />
                                <div className="w-12 h-12 rounded-full border border-foreground/50" />
                                <div className="w-12 h-12 rounded-full border border-foreground/50" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Grid Rxn</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Rapid target acquisition. Hit the targets, duplicate the bomb.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Typing Speed Module Card */}
                    <Link href="/games/typing-speed" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Proficiency
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="font-mono text-6xl font-black text-foreground/50 tracking-wides">
                                _WPM
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Typing</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Keyboard proficiency. Type the given text with speed and accuracy.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono uppercase text-xs tracking-wider">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Visual Match Module Card */}
                    <Link href="/games/visual-match" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden">
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">
                                Scanning
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-4xl text-foreground/50">◆</div>
                                <div className="text-4xl text-foreground">◆</div>
                                <div className="text-4xl text-foreground/50">◆</div>
                                <div className="text-4xl text-foreground/50">◆</div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Visual Match</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Visual search. Locate the target symbol among distractors.
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
