"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Grid3X3, RotateCcw, Home, Skull, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export function SequenceMemoryGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "SHOWING_SEQUENCE" | "PLAYER_TURN" | "GAME_OVER">("MENU")
    const [level, setLevel] = useState(1)
    const [sequence, setSequence] = useState<number[]>([])
    const [playerSequence, setPlayerSequence] = useState<number[]>([])
    const [activeTile, setActiveTile] = useState<number | null>(null)
    const [score, setScore] = useState(0)

    const router = useRouter()
    const pathname = usePathname()

    // Audio context refs for sound effects could go here

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = () => {
        setLevel(1)
        setScore(0)
        setSequence([])
        setPlayerSequence([])
        setGameState("PLAYING")
        // Start first level
        startLevel(1)
    }

    const startLevel = useCallback((lvl: number) => {
        setGameState("SHOWING_SEQUENCE")
        setPlayerSequence([])

        // Add one new step to the sequence
        const newStep = Math.floor(Math.random() * 9)
        setSequence(prev => {
            const next = [...prev, newStep]
            playSequence(next)
            return next
        })
    }, [])

    const playSequence = async (seq: number[]) => {
        // Wait a bit before starting
        await new Promise(r => setTimeout(r, 500))

        for (let i = 0; i < seq.length; i++) {
            setActiveTile(seq[i])
            // Play sound here if implemented
            await new Promise(r => setTimeout(r, 600)) // Flash duration
            setActiveTile(null)
            await new Promise(r => setTimeout(r, 200)) // Gap between flashes
        }

        setGameState("PLAYER_TURN")
    }

    const handleTileClick = (index: number) => {
        if (gameState !== "PLAYER_TURN") return

        // Flash clicked tile briefly
        setActiveTile(index)
        setTimeout(() => setActiveTile(null), 200)

        const expectedIndex = playerSequence.length
        if (index === sequence[expectedIndex]) {
            // Correct click
            const newPlayerSeq = [...playerSequence, index]
            setPlayerSequence(newPlayerSeq)

            if (newPlayerSeq.length === sequence.length) {
                // Completed sequence
                setScore(prev => prev + (level * 10))
                setTimeout(() => {
                    setLevel(prev => {
                        const next = prev + 1
                        startLevel(next)
                        return next
                    })
                }, 1000)
            }
        } else {
            // Wrong click
            setGameState("GAME_OVER")
            // Save Score
            fetch("/api/games/sequence-memory/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score: score }),
            }).catch(err => console.error("Failed to save score:", err))
        }
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Sequence Memory"
                    description="Pattern Retention. Memorize the sequence of flashing tiles. Repeat the pattern in order."
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>Watch the pattern carefully.</p>
                        <p>Repeat the sequence by clicking the tiles.</p>
                        <p>The sequence gets longer each round.</p>
                    </div>}
                    icon={<Grid3X3 className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Sequence Memory</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Level</span>
                    <span className="text-2xl font-mono font-bold">{level}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {score}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full max-w-[400px] aspect-square grid grid-cols-3 gap-4 p-4">
                {[...Array(9)].map((_, i) => (
                    <motion.button
                        key={i}
                        layout
                        whileHover={gameState === "PLAYER_TURN" ? { scale: 0.95 } : {}}
                        whileTap={gameState === "PLAYER_TURN" ? { scale: 0.9 } : {}}
                        className={cn(
                            "w-full h-full rounded-xl border-2 transition-all duration-200",
                            activeTile === i
                                ? "bg-primary border-primary shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                                : "bg-muted/20 border-border/50 hover:bg-muted/40"
                        )}
                        onClick={() => handleTileClick(i)}
                        disabled={gameState !== "PLAYER_TURN"}
                    />
                ))}
            </div>

            <div className="h-8 flex items-center justify-center">
                {gameState === "SHOWING_SEQUENCE" && (
                    <span className="text-sm font-mono uppercase tracking-widest animate-pulse text-muted-foreground">Watch Sequence...</span>
                )}
                {gameState === "PLAYER_TURN" && (
                    <span className="text-sm font-mono uppercase tracking-widest text-primary">Your Turn</span>
                )}
            </div>

            {/* Game Over */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                            <Skull className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Sequence Broken</DialogTitle>
                            <DialogDescription>
                                You reached level {level}.
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
