"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Crosshair, RotateCcw, Home, Trophy, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface Target {
    id: number
    x: number
    y: number
}

export function AimTrainerGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [targets, setTargets] = useState<Target[]>([])
    const [accuracy, setAccuracy] = useState(100)
    const [, setClicks] = useState(0)
    const [hits, setHits] = useState(0)

    const router = useRouter()
    const pathname = usePathname()
    const containerRef = useRef<HTMLDivElement>(null)

    const GAME_DURATION = 30 // seconds

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = () => {
        setScore(0)
        setTimeLeft(GAME_DURATION)
        setTargets([])
        setClicks(0)
        setHits(0)
        setAccuracy(100)
        setGameState("PLAYING")
        spawnTarget()
    }

    const spawnTarget = useCallback(() => {
        // Random position within 10% - 90% of container
        const x = Math.random() * 80 + 10
        const y = Math.random() * 80 + 10
        const newTarget: Target = {
            id: Date.now(),
            x,
            y
        }
        setTargets([newTarget]) // Only one target at a time for now? Or multiple? Let's do one for speed.
    }, [])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (gameState === "PLAYING") {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState("GAME_OVER")
                        // Save score logic could go here
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [gameState])

    const handleBackgroundClick = () => {
        if (gameState !== "PLAYING") return
        setClicks(prev => {
            const newClicks = prev + 1
            setAccuracy(Math.round((hits / newClicks) * 100))
            return newClicks
        })
    }

    const handleTargetClick = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent background click from registering as miss if we want to separate logic, but actually we want to count it as a click
        if (gameState !== "PLAYING") return

        setHits(prev => prev + 1)
        setClicks(prev => {
            const newClicks = prev + 1
            setAccuracy(Math.round(((hits + 1) / newClicks) * 100))
            return newClicks
        })

        setScore(prev => prev + 100) // Simple scoring
        spawnTarget()
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Aim Trainer"
                    description="Mouse Control & Reaction. Hit targets as quickly as possible. Speed and accuracy matter."
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>Hit 30 targets as fast as you can (or infinite in time limit).</p>
                        <p>Actually, let&apos;s do: <span className="font-bold">Score as many hits as possible in 30s</span>.</p>
                        <p>Don&apos;t miss! Accuracy counts.</p>
                    </div>}
                    icon={<Crosshair className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-4xl mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Aim Trainer</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full grid grid-cols-3 border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
                    <span className={cn("text-4xl font-mono font-bold tabular-nums", timeLeft <= 5 && "text-destructive animate-pulse")}>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Accuracy</span>
                    <span className="text-4xl font-mono font-bold tabular-nums text-primary">
                        {accuracy}%
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-4xl font-mono font-bold tabular-nums">
                        {score}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div
                ref={containerRef}
                className="relative w-full h-[60vh] bg-background/50 border border-border/50 rounded-xl overflow-hidden cursor-crosshair"
                onClick={handleBackgroundClick}
            >
                <AnimatePresence mode="popLayout">
                    {targets.map(target => (
                        <motion.button
                            key={target.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            style={{
                                left: `${target.x}%`,
                                top: `${target.y}%`,
                            }}
                            className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-primary border-4 border-background shadow-[0_0_15px_rgba(var(--primary),0.5)] flex items-center justify-center group"
                            onClick={(e) => handleTargetClick(e)}
                        >
                            <div className="w-2 h-2 bg-background rounded-full group-hover:scale-125 transition-transform" />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Game Over */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Session Complete</DialogTitle>
                            <DialogDescription>
                                Precision analysis finished.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/20 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Hits</span>
                            <div className="text-3xl font-bold font-mono text-foreground tracking-tighter">
                                {hits}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/20 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Accuracy</span>
                            <div className="text-3xl font-bold font-mono text-foreground tracking-tighter">
                                {accuracy}%
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-border/20 space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Final Score</span>
                        <div className="text-5xl font-bold font-mono text-primary tracking-tighter">
                            {score}
                        </div>
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
