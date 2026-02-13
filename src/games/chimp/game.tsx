"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Eye, RotateCcw, Home, Skull, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface CellData {
    id: number
    num: number
    x: number // Percent 0-90
    y: number // Percent 0-90
    state: "visible" | "hidden" | "solved"
}

export function ChimpGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [level, setLevel] = useState(1)
    const [lives, setLives] = useState(3)
    const [cells, setCells] = useState<CellData[]>([])
    const [nextExpected, setNextExpected] = useState(1)
    const [score, setScore] = useState(0)

    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startLevel = useCallback((lvl: number) => {
        const count = 4 + lvl // Level 1 = 5 nums, Level 2 = 6...
        const newCells: CellData[] = []

        // Generate positions avoiding overlap
        // Simple grid bucket approach? Or random with dist check?
        // Let's use a virtual 8x5 grid for simplicity and random selection
        const gridPositions = []
        for (let r = 0; r < 8; r++) { // 8 rows
            for (let c = 0; c < 5; c++) { // 5 cols
                gridPositions.push({ x: c * 20, y: r * 12.5 })
            }
        }

        // Shuffle grid positions
        for (let i = gridPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gridPositions[i], gridPositions[j]] = [gridPositions[j], gridPositions[i]];
        }

        for (let i = 1; i <= count; i++) {
            const pos = gridPositions[i - 1]
            newCells.push({
                id: i,
                num: i,
                x: pos.x + 2, // offset for padding
                y: pos.y + 2,
                state: "visible"
            })
        }

        setCells(newCells)
        setNextExpected(1)
    }, [])

    const startGame = () => {
        setLevel(1)
        setLives(3)
        setScore(0)
        setGameState("PLAYING")
        startLevel(1)
    }

    const handleCellClick = (cell: CellData) => {
        if (cell.state === "solved") return

        if (cell.num === nextExpected) {
            // Correct
            if (cell.num === 1) {
                // First click -> HIDE ALL others
                setCells(prev => prev.map(c => c.num === 1 ? { ...c, state: "solved" } : { ...c, state: "hidden" }))
            } else {
                setCells(prev => prev.map(c => c.id === cell.id ? { ...c, state: "solved" } : c))
            }

            // Check completion
            if (nextExpected === cells.length) {
                // Level Complete
                setScore(prev => prev + (level * 100))
                setTimeout(() => {
                    setLevel(prev => {
                        const next = prev + 1
                        startLevel(next)
                        return next
                    })
                }, 500)
            } else {
                setNextExpected(prev => prev + 1)
            }
        } else {
            // Wrong
            setLives(prev => {
                const next = prev - 1
                if (next <= 0) {
                    setGameState("GAME_OVER")
                    // Save Score
                    fetch("/api/games/chimp/score", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ score: score }),
                    }).catch(err => console.error("Failed to save score:", err))

                } else {
                    // Repeat level but shuffle
                    setTimeout(() => startLevel(level), 500)
                }
                return next
            })
        }
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Chimp Test"
                    description="Spatial Memory. Memorize the positions of the numbers. Click '1' and the rest will disappear. Find them in order."
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>Level increases number count.</p>
                        <p>Click <span className="font-bold">1</span> &rarr; Visually memorize others.</p>
                        <p>Tap blank squares in sequence (2, 3, 4...).</p>
                    </div>}
                    icon={<Eye className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Chimp Test</span>
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

                <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={cn("w-3 h-3 transition-colors rounded-none", i < lives ? "bg-primary" : "bg-muted")} />
                    ))}
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {score}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full h-[60vh] max-h-[600px] border border-border/50 bg-background/50">
                <AnimatePresence>
                    {cells.map(cell => {
                        if (cell.state === "solved") return null // removing correctly clicked ones or keep them? Usually they disappear or stay visible. Let's remove for cleaner look.

                        return (
                            <motion.button
                                key={cell.id}
                                layoutId={`cell-${cell.id}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                style={{
                                    left: `${cell.x}%`,
                                    top: `${cell.y}%`,
                                    width: '18%', // Approx fit 5 cols
                                    height: '10%' // Approx fit 8 rows
                                }}
                                className={cn(
                                    "absolute flex items-center justify-center border-2 font-mono text-2xl md:text-3xl font-bold transition-all rounded-none",
                                    cell.state === "visible" ? "bg-background border-primary text-foreground" : "bg-primary border-primary text-transparent"
                                )}
                                onClick={() => handleCellClick(cell)}
                            >
                                {cell.state === "visible" && cell.num}
                                {cell.state === "hidden" && <div className="w-full h-full bg-primary" />}
                            </motion.button>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Game Over */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                            <Skull className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Memory Fail</DialogTitle>
                            <DialogDescription>
                                Level {level} proved too difficult.
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
