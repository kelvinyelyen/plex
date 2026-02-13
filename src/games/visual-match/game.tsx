"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { ScanSearch, RotateCcw, Home, Skull, ArrowLeft, Check, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Symbol sets for matching
const SYMBOLS = ["◆", "●", "■", "▲", "▼", "★", "✚", "✖"]
// Or rotation based? e.g. "R" vs "P"?
// Let's do "Find the duplicate" in a grid of unique items?
// OR "Find the target" 
// Let's do: Target symbol is shown. Grid appears. Tap the target.

export function VisualMatchGame() {
    const [gameState, setGameState] = useState<"MENU" | "SHOW_TARGET" | "SEARCH" | "GAME_OVER">("MENU")
    const [level, setLevel] = useState(1)
    const [score, setScore] = useState(0)
    const [target, setTarget] = useState("")
    const [gridItems, setGridItems] = useState<string[]>([])
    const [lives, setLives] = useState(3)

    // Time limit for finding?
    const [timeLeft, setTimeLeft] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = () => {
        setLevel(1)
        setScore(0)
        setLives(3)
        startLevel(1)
    }

    const startLevel = (lvl: number) => {
        // difficulty: more items, less time, more similar items
        const numItems = Math.min(25, 4 + lvl) // Start with 5, cap at 25
        const availableSymbols = SYMBOLS // could expand this list

        // Pick target
        const rT = availableSymbols[Math.floor(Math.random() * availableSymbols.length)]
        setTarget(rT)

        setGameState("SHOW_TARGET")

        // Generate grid
        // 1 instance of target
        // (numItems - 1) distractors
        const items = [rT]
        for (let i = 0; i < numItems - 1; i++) {
            items.push(availableSymbols[Math.floor(Math.random() * availableSymbols.length)])
        }

        // Shuffle
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        setGridItems(items)

        setTimeout(() => {
            setGameState("SEARCH")
            // Time bonus based on level?
            setTimeLeft(5 + lvl * 0.5) // e.g. 5.5s
        }, 1500) // 1.5s to see target
    }

    useEffect(() => {
        if (gameState === "SEARCH") {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0.1) {
                        // Timeout treated as wrong
                        handleWrong()
                        return 0
                    }
                    return prev - 0.1
                })
            }, 100)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [gameState])

    const handleWrong = () => {
        setLives(prev => {
            const next = prev - 1
            if (next <= 0) {
                setGameState("GAME_OVER")
            } else {
                // Retry level or next? usually retry implies re-finding same target or new?
                // Let's generate new level to avoid frustration of "where was it"
                startLevel(level)
            }
            return next
        })
    }

    const handleCardClick = (symbol: string) => {
        if (gameState !== "SEARCH") return

        if (symbol === target) {
            // Correct
            setScore(prev => prev + (level * 50) + Math.round(timeLeft * 10))
            setLevel(prev => {
                const next = prev + 1
                startLevel(next)
                return next
            })
        } else {
            handleWrong()
        }
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Visual Match"
                    description="Scanning Speed. Find the target symbol in the grid of distractors."
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>A target symbol will appear.</p>
                        <p>Memorize it.</p>
                        <p>Find and tap it in the grid before time runs out.</p>
                    </div>}
                    icon={<ScanSearch className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Visual Match</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
                    <span className={cn("text-2xl font-mono font-bold tabular-nums", timeLeft < 3 && "text-destructive animate-pulse")}>
                        {timeLeft.toFixed(1)}s
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Target</span>
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-xl bg-primary/20 rounded text-primary">
                        {gameState === "SHOW_TARGET" ? target : "?"}
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {score}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[300px]">
                <AnimatePresence mode="wait">
                    {gameState === "SHOW_TARGET" && (
                        <motion.div
                            key="target"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Find This</span>
                            <div className="text-9xl text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                                {target}
                            </div>
                        </motion.div>
                    )}

                    {gameState === "SEARCH" && (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-5 gap-4"
                        >
                            {gridItems.map((item, idx) => (
                                <motion.button
                                    key={idx}
                                    layoutId={`card-${idx}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-4xl bg-card border-2 border-border/50 hover:border-primary rounded-xl shadow-lg"
                                    onClick={() => handleCardClick(item)}
                                >
                                    {item}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="h-8 flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={cn("w-3 h-3 rounded-full transition-colors", i < lives ? "bg-primary" : "bg-muted/30")} />
                ))}
            </div>

            {/* Game Over */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                            <Skull className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Target Lost</DialogTitle>
                            <DialogDescription>
                                Visual processing failed.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/20 space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Final Score</span>
                        <div className="text-6xl font-bold font-mono text-primary tracking-tighter">
                            {score}
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Reached Level {level}</span>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" size="lg" onClick={() => setGameState("MENU")} className="w-full gap-2 rounded-none">
                            <Home className="w-4 h-4" />
                            Menu
                        </Button>
                        <Button size="lg" onClick={startGame} className="w-full gap-2 rounded-none">
                            <RotateCcw className="w-4 h-4" />
                            Retry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
