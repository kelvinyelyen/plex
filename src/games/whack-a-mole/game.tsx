"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Target, RotateCcw, Home, ArrowLeft, Trophy, Skull, Zap } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Config
const GRID_SIZE = 9 // 3x3
const GAME_DURATION = 30
const INITIAL_SPAWN_Rate = 1000

export function WhackAMoleGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
    const [activeMole, setActiveMole] = useState<number | null>(null)
    const [isBomb, setIsBomb] = useState(false) // Sometimes a bomb appears instead of a mole

    // Streak multiplier?
    const [streak, setStreak] = useState(0)

    const router = useRouter()
    const pathname = usePathname()
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const spawnTimerRef = useRef<NodeJS.Timeout | null>(null)

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const initGame = () => {
        setScore(0)
        setTimeLeft(GAME_DURATION)
        setStreak(0)
        setActiveMole(null)
        setGameState("PLAYING")
        spawnMole()
    }

    const spawnMole = () => {
        if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current)

        // Determine random slot
        // Make sure it's different from last time
        // Just random for now
        const newMole = Math.floor(Math.random() * GRID_SIZE)
        setActiveMole(newMole)

        // 10% chance of bomb
        setIsBomb(Math.random() > 0.9)

        // Determine how long it stays up based on streak/time?
        // Let's make it disappear and reappear somewhere else if not clicked?
        // Or simple interval logic: Every X ms, move mole.

        const speed = Math.max(500, 1000 - (score * 10))
        spawnTimerRef.current = setTimeout(spawnMole, speed)
    }

    const handleGridClick = (index: number) => {
        if (gameState !== "PLAYING") return

        if (index === activeMole) {
            if (isBomb) {
                // Hit bomb!
                setScore(s => Math.max(0, s - 5))
                setStreak(0)
                // Haptic feedback?
                // Shake screen?
            } else {
                // Hit mole!
                setScore(s => s + 1 + Math.floor(streak / 5))
                setStreak(s => s + 1)
            }
            // Respawn immediately on hit
            spawnMole()
        } else {
            // Missed!
            setStreak(0)
        }
    }

    // Game Timer
    useEffect(() => {
        if (gameState === "PLAYING") {
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        setGameState("GAME_OVER")
                        return 0
                    }
                    return t - 1
                })
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
            if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current)
        }
    }, [gameState])

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Reflex Grid"
                    description="Whack-a-Mole Style. Hit targets. Avoid bombs."
                    onStart={() => {
                        initGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>1. Tap the green targets instantly.</p>
                        <p>2. Don't tap the red bombs.</p>
                        <p>3. Build streaks for multipliers.</p>
                    </div>}
                    icon={<Target className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-lg mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Reflex Grid</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
                    <span className="text-2xl font-mono font-bold text-muted-foreground">{timeLeft}s</span>
                </div>

                <div className="flex flex-col items-center">
                    {streak > 2 && (
                        <div className="animate-bounce">
                            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Streak x{Math.floor(streak / 5) + 1}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-4xl font-mono font-bold tabular-nums text-primary">
                        {score}
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-4 w-full aspect-square max-w-[400px]">
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                    <div
                        key={i}
                        className="relative bg-muted/20 border-2 border-border/10 rounded-xl active:scale-95 transition-transform"
                        onClick={() => handleGridClick(i)}
                    >
                        {/* Target / Mole */}
                        <AnimatePresence>
                            {activeMole === i && (
                                <motion.div
                                    key={isBomb ? "bomb" : "mole"}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                    className={cn(
                                        "absolute inset-0 m-2 rounded-full flex items-center justify-center shadow-lg cursor-pointer",
                                        isBomb ? "bg-destructive shadow-destructive/50" : "bg-primary shadow-primary/50"
                                    )}
                                >
                                    {isBomb ? <Skull className="w-8 h-8 text-destructive-foreground dark:text-white" /> : <Zap className="w-8 h-8 text-primary-foreground dark:text-black" />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <div className="text-xs text-muted-foreground font-mono">
                Tap targets fast!
            </div>

            {/* Game Over Dialog */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">
                                Time's Up
                            </DialogTitle>
                            <DialogDescription>
                                Good reflexes.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/20 space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Final Score</span>
                        <div className="text-6xl font-bold font-mono text-primary tracking-tighter">
                            {score}
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" size="lg" onClick={() => setGameState("MENU")} className="w-full gap-2 rounded-none">
                            <Home className="w-4 h-4" />
                            Menu
                        </Button>
                        <Button size="lg" onClick={initGame} className="w-full gap-2 rounded-none">
                            <RotateCcw className="w-4 h-4" />
                            Replay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
