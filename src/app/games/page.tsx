"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    SudokuAnimation,
    MemoryAnimation,
    ConundraAnimation,
    SchulteAnimation,
    ChimpAnimation,
    PulseAnimation,
    SplitAnimation
} from "@/components/ui/game-animations"
import { motion } from "framer-motion"

// Inline animations for games that don't have them in game-animations.tsx yet
const SequenceAnimation = () => (
    <div className="grid grid-cols-3 gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md">
        {[...Array(9)].map((_, i) => (
            <motion.div
                key={i}
                className={cn("w-full h-full rounded-sm", i === 4 ? "bg-primary" : "bg-primary/20")}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
        ))}
    </div>
)

const AimAnimation = () => (
    <div className="relative w-24 h-24 p-2 bg-muted/20 rounded-md flex items-center justify-center">
        <div className="absolute w-16 h-16 border border-primary/30 rounded-full" />
        <div className="absolute w-10 h-10 border border-primary/50 rounded-full" />
        <motion.div
            className="w-2 h-2 bg-primary rounded-full absolute"
            animate={{ x: [0, 20, -15, 10, 0], y: [0, -20, 10, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
        />
    </div>
)

const ColorAnimation = () => (
    <div className="flex flex-col items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md gap-1">
        <motion.span
            className="font-black text-xl"
            style={{ color: "hsl(var(--primary))" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            BLUE
        </motion.span>
        <motion.span
            className="font-black text-xl text-foreground/50"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
            RED
        </motion.span>
    </div>
)

const NumberAnimation = () => (
    <div className="flex items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md">
        <motion.span
            className="text-3xl font-black font-mono tracking-tighter text-primary/80"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            472
        </motion.span>
    </div>
)

const VerbalAnimation = () => (
    <div className="flex flex-col items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md gap-1">
        <span className="text-[10px] font-mono text-foreground/40 uppercase">House</span>
        <motion.span
            className="text-xs font-mono font-bold text-primary uppercase"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            Tree
        </motion.span>
        <span className="text-[10px] font-mono text-foreground/40 uppercase line-through decoration-primary">House</span>
    </div>
)

const HanoiAnimation = () => (
    <div className="flex flex-col items-center justify-center gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md">
        <div className="w-4 h-1.5 bg-primary rounded-full" />
        <div className="w-8 h-1.5 bg-primary rounded-full" />
        <div className="w-12 h-1.5 bg-primary rounded-full" />
        <div className="w-16 h-1.5 bg-primary/30 rounded-full" />
    </div>
)

const MinesAnimation = () => (
    <div className="grid grid-cols-3 gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md icon-grid">
        <div className="flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 bg-background rounded-sm">1</div>
        <div className="flex items-center justify-center bg-primary/10 rounded-sm" />
        <div className="flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 bg-background rounded-sm">2</div>
        <div className="flex items-center justify-center bg-primary/10 rounded-sm" />
        <div className="flex items-center justify-center text-[10px] text-destructive border border-destructive/20 bg-destructive/10 rounded-sm">!</div>
        <div className="flex items-center justify-center bg-primary/10 rounded-sm" />
        <div className="flex items-center justify-center bg-primary/10 rounded-sm" />
        <div className="flex items-center justify-center bg-primary/10 rounded-sm" />
        <div className="flex items-center justify-center bg-primary/10 rounded-sm" />
    </div>
)

const SnakeAnimation = () => (
    <div className="relative w-24 h-24 p-2 bg-muted/20 rounded-md border border-primary/10">
        <div className="absolute top-6 left-6 w-2 h-2 bg-primary rounded-sm" />
        <div className="absolute top-6 left-8 w-2 h-2 bg-primary/60 rounded-sm" />
        <div className="absolute top-6 left-10 w-2 h-2 bg-primary/40 rounded-sm" />
        <div className="absolute bottom-6 right-6 w-2 h-2 bg-primary border border-primary rounded-sm animate-pulse" />
    </div>
)

const WhackAnimation = () => (
    <div className="grid grid-cols-2 gap-2 w-24 h-24 p-4 bg-muted/20 rounded-md">
        <div className="rounded-full border border-primary/30" />
        <motion.div
            className="rounded-full bg-primary"
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
        />
        <div className="rounded-full border border-primary/30" />
        <div className="rounded-full border border-primary/30" />
    </div>
)

const TypingAnimation = () => (
    <div className="flex items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md">
        <span className="font-mono text-xl font-black text-primary/50 tracking-widest animate-pulse">_WPM</span>
    </div>
)

const VisualAnimation = () => (
    <div className="grid grid-cols-2 gap-2 w-24 h-24 p-4 bg-muted/20 rounded-md">
        <div className="text-xl text-primary/30 flex items-center justify-center">◆</div>
        <div className="text-xl text-primary flex items-center justify-center">◆</div>
        <div className="text-xl text-primary/30 flex items-center justify-center">◆</div>
        <div className="text-xl text-primary/30 flex items-center justify-center">◆</div>
    </div>
)


export default function GamesPage() {
    return (
        <div className="container min-h-screen bg-background py-8">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-mono font-bold uppercase tracking-tighter">Games</h1>
                    <p className="text-muted-foreground text-sm">Choose a game to begin training.</p>
                </div>

                <hr className="border-border" />

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Sudoku */}
                    <Link href="/games/sudoku" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><SudokuAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Sudoku</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Classic numerical placement puzzle.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Memory Grid */}
                    <Link href="/games/memory-grid" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><MemoryAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Memory Grid</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Visual pattern retention game.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Conundra */}
                    <Link href="/games/conundra" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><ConundraAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Conundra</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Arithmetic puzzle challenge.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Schulte */}
                    <Link href="/games/schulte" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><SchulteAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Schulte</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Peripheral vision trainer.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Chimp */}
                    <Link href="/games/chimp" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><ChimpAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Chimp</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Primate-level memory test.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Pulse Reaction */}
                    <Link href="/games/pulse-reaction" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><PulseAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Pulse Rxn</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Cognitive latency calibration.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Split Decision */}
                    <Link href="/games/split-decision" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><SplitAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Split Dec</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Rapid categorization protocols.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Sequence Memory */}
                    <Link href="/games/sequence-memory" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><SequenceAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Sequence</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Pattern retention.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Aim Trainer */}
                    <Link href="/games/aim-trainer" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><AimAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Aim Trainer</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Reaction & Precision.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Color Match */}
                    <Link href="/games/color-match" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><ColorAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Color Match</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Stroop Test.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Number Memory */}
                    <Link href="/games/number-memory" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><NumberAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Number Mem</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Digit span test.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Verbal Memory */}
                    <Link href="/games/verbal-memory" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><VerbalAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Verbal Mem</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Word retention.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Tower of Hanoi */}
                    <Link href="/games/hanoi" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><HanoiAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Hanoi</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Ancient logic puzzle.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Minesweeper */}
                    <Link href="/games/minesweeper" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><MinesAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Mines</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Deduction puzzle.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Snake */}
                    <Link href="/games/snake" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><SnakeAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Snake</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Spatial navigation.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Whack-a-Mole */}
                    <Link href="/games/whack-a-mole" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><WhackAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Grid Rxn</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Rapid target acquisition.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Typing Speed */}
                    <Link href="/games/typing-speed" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><TypingAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Typing</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Keyboard proficiency.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Visual Match */}
                    <Link href="/games/visual-match" className="w-full">
                        <Card className="h-full transition-all md:hover:bg-muted/50 md:hover:border-primary/50 group overflow-hidden rounded-xl border-foreground/10">
                            <CardHeader className="relative z-10 pt-6 pb-6 px-4">
                                <div className="flex justify-center items-center scale-75 origin-center -mb-2">
                                    <div className="mx-auto mb-4"><VisualAnimation /></div>
                                </div>
                                <CardTitle className="text-center group-hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm pt-2">Visual Match</CardTitle>
                                <CardDescription className="text-center text-xs pt-2 line-clamp-1">Visual search.</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                </div>
            </div>
        </div>
    )
}
