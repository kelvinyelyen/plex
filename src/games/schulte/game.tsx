"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Grid3X3, RotateCcw, Home, Trophy, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from "next/navigation"

type GameType = "digits" | "letters" | "gorbov"
type GameMode = "direct" | "reverse" | "random"

export function SchulteGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [gameType, setGameType] = useState<GameType>("digits")
    const [gameMode, setGameMode] = useState<GameMode>("direct")
    const [hasSelectedPreferences, setHasSelectedPreferences] = useState(false)

    // Grid Content
    const [grid, setGrid] = useState<string[]>([]) // Store as strings to handle both numbers and letters
    const [gridColors, setGridColors] = useState<("black" | "red")[]>([]) // For Gorbov

    // Logic State
    const [nextExpectedIndex, setNextExpectedIndex] = useState(0) // Index in the sequence
    const [targetSequence, setTargetSequence] = useState<string[]>([]) // Expected sequence of clicks
    const [currentTarget, setCurrentTarget] = useState<string>("") // What to show as "Next"

    const [startTime, setStartTime] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    // Generate Sequence based on settings
    const generateSequence = useCallback(() => {
        let sequence: string[] = []

        if (gameType === "digits") {
            const nums = Array.from({ length: 25 }, (_, i) => (i + 1).toString())
            if (gameMode === "direct") sequence = nums
            else if (gameMode === "reverse") sequence = nums.reverse()
            else if (gameMode === "random") sequence = nums // Logic handled differently for random *target* display
        } else if (gameType === "letters") {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXY".split("")
            if (gameMode === "direct") sequence = letters
            else if (gameMode === "reverse") sequence = letters.reverse()
            else if (gameMode === "random") sequence = letters
        } else if (gameType === "gorbov") {
            // Gorbov: 1 (Black), 12 (Red), 2 (Black), 11 (Red)... 
            // 25 cells: 13 Black (1-13), 12 Red (1-12)
            // Sequence logic needs to be alternating
            // Black Ascending (1..13), Red Descending (12..1)
            // Sequence: B1, R12, B2, R11, B3, R10... 

            sequence = []
            let black = 1
            let red = 12

            // 25 steps
            for (let i = 0; i < 25; i++) {
                if (i % 2 === 0) {
                    sequence.push(black.toString()) // Expect check for separate color logic
                    black++
                } else {
                    sequence.push(red.toString())
                    red--
                }
            }
        }

        return sequence
    }, [gameType, gameMode])

    // Initialize Grid
    const startNewGame = useCallback(() => {
        let items: string[] = []
        let colors: ("black" | "red")[] = []

        if (gameType === "digits") {
            items = Array.from({ length: 25 }, (_, i) => (i + 1).toString())
            colors = Array(25).fill("black")
        } else if (gameType === "letters") {
            items = "ABCDEFGHIJKLMNOPQRSTUVWXY".split("")
            colors = Array(25).fill("black")
        } else if (gameType === "gorbov") {
            // 1-13 Black, 1-12 Red
            const blackItems = Array.from({ length: 13 }, (_, i) => ({ val: (i + 1).toString(), color: "black" as const }))
            const redItems = Array.from({ length: 12 }, (_, i) => ({ val: (i + 1).toString(), color: "red" as const }))
            const all = [...blackItems, ...redItems]

            // Shuffle
            for (let i = all.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [all[i], all[j]] = [all[j], all[i]];
            }

            items = all.map(x => x.val)
            colors = all.map(x => x.color)
            setGridColors(colors)
        }

        if (gameType !== "gorbov") {
            // Shuffle basic items
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            setGridColors(Array(25).fill("black"))
        }

        setGrid(items)

        const seq = generateSequence()
        setTargetSequence(seq)

        if (gameMode === "random") {
            // For random mode, we need a randomized sequence of targets, not just visuals
            // Re-shuffle the sequence to find content in random order?
            // "Random" usually implies "Find X" where X jumps around.
            // Let's shuffle the expected sequence itself.
            for (let i = seq.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [seq[i], seq[j]] = [seq[j], seq[i]];
            }
            setTargetSequence(seq)
        }

        setNextExpectedIndex(0)
        setCurrentTarget(seq[0])

        setGameState("PLAYING")
        setStartTime(Date.now())
        setCurrentTime(0)
    }, [gameType, gameMode, generateSequence])

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (gameState === "PLAYING") {
            interval = setInterval(() => {
                setCurrentTime(Date.now() - startTime)
            }, 50)
        }
        return () => clearInterval(interval)
    }, [gameState, startTime])

    const handleCellClick = (val: string, index: number) => {
        if (gameState !== "PLAYING") return

        // Check Correctness
        // Standard/Reverse/Random: Content match
        // Gorbov: Content match AND Color match logic

        if (gameType === "gorbov") {
            // Expected val
            const expectedVal = targetSequence[nextExpectedIndex]

            // Expected color: Even indices in sequence (0, 2...) are Black, Odd are Red
            const expectedColor = nextExpectedIndex % 2 === 0 ? "black" : "red"
            const clickedColor = gridColors[index]

            if (val === expectedVal && clickedColor === expectedColor) {
                handleCorrectMove()
            }
        } else {
            // Simple match
            const expectedVal = targetSequence[nextExpectedIndex]
            if (val === expectedVal) {
                handleCorrectMove()
            }
        }
    }

    const handleCorrectMove = () => {
        const nextIdx = nextExpectedIndex + 1
        if (nextIdx >= targetSequence.length) {
            // Win
            endGame()
        } else {
            setNextExpectedIndex(nextIdx)
            setCurrentTarget(targetSequence[nextIdx])
        }
    }

    const endGame = async () => {
        setGameState("GAME_OVER")
        const finalTime = currentTime

        // Save Score
        let difficultyStr = `${gameType}-${gameMode}`
        if (gameType === "gorbov") difficultyStr = "gorbov" // Only one gorbov mode for now

        try {
            await fetch("/api/games/schulte/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    score: finalTime,
                    difficulty: difficultyStr,
                }),
            })
        } catch (e) {
            console.error("Failed to save score", e)
        }
    }

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000)
        const centis = Math.floor((ms % 1000) / 10)
        return `${seconds}.${centis.toString().padStart(2, '0')}`
    }

    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setHasSelectedPreferences(false)
        router.replace(pathname)
    }

    if (gameState === "MENU") {
        if (!hasSelectedPreferences) {
            return (
                <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                    <GameStartScreen
                        title="Schulte Table"
                        description="Focus Training. Find items in the grid sequence. Keep eyes on center. Expand your peripheral vision."
                        onStart={() => {
                            setHasSelectedPreferences(true)
                            router.replace(`${pathname}?mode=play`)
                        }}
                        instructions={<div className="space-y-2 text-sm text-muted-foreground">
                            <p>Grid stops at 25.</p>
                            <p>Use peripheral vision.</p>
                            <p>Don&apos;t scan with eyes, stare at center.</p>
                        </div>}
                        icon={<Grid3X3 className="w-16 h-16 text-primary" />}
                    />
                </div>
            )
        }

        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-8 min-h-[50vh]">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-mono font-bold uppercase tracking-tight">Configure Protocol</h2>
                        <p className="text-muted-foreground text-sm">Select your training parameters.</p>
                    </div>

                    <div className="w-full max-w-sm space-y-6 p-8 border bg-card/50 backdrop-blur-sm">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                                <Select value={gameType} onValueChange={(v: GameType) => setGameType(v)}>
                                    <SelectTrigger className="font-mono uppercase transition-colors hover:border-primary/50 h-10 w-full rounded-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="digits" className="font-mono uppercase">Digits (1-25)</SelectItem>
                                        <SelectItem value="letters" className="font-mono uppercase">Letters (A-Y)</SelectItem>
                                        <SelectItem value="gorbov" className="font-mono uppercase">Gorbov (Red/Black)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {gameType !== "gorbov" && (
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Mode</label>
                                    <Select value={gameMode} onValueChange={(v: GameMode) => setGameMode(v)}>
                                        <SelectTrigger className="font-mono uppercase transition-colors hover:border-primary/50 h-10 w-full rounded-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="direct" className="font-mono uppercase">Direct (Ascending)</SelectItem>
                                            <SelectItem value="reverse" className="font-mono uppercase">Reverse (Descending)</SelectItem>
                                            <SelectItem value="random" className="font-mono uppercase">Random (Find X)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <Button size="lg" onClick={startNewGame} className="w-full font-mono uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-none">
                            Start Training
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8">
            <div className="w-full flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">
                        {gameType === "gorbov" ? "Gorbov-Schulte" : `Schulte ${gameType}`}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground uppercase opacity-50">
                        {gameType !== "gorbov" ? gameMode : "Alternating"}
                    </span>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Next</span>
                    <span className={cn(
                        "text-4xl font-mono font-bold",
                        // Gorbov color hint for next
                        gameType === "gorbov" && nextExpectedIndex % 2 === 0 ? "text-foreground" :
                            gameType === "gorbov" ? "text-red-500" : "text-primary"
                    )}>
                        {currentTarget}
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {formatTime(currentTime)}
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="w-full aspect-square relative select-none">
                {/* Center dot for focus */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-10">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>

                <div className="grid grid-cols-5 gap-1 w-full h-full">
                    {grid.map((val, i) => {
                        // Logic for "is already clicked" visual state
                        // Logic for "is already clicked" visual state
                        let isDone = false
                        const isGorbovRed = gameType === "gorbov" && gridColors[i] === "red"
                        const isGorbovBlack = gameType === "gorbov" && gridColors[i] === "black"

                        if (gameType === "gorbov") {
                            // In Gorbov, we have duplicate values (e.g., Red "1" and Black "1")
                            // We need to check if *this specific version* of the value has been cleared.

                            // Iterate through the completed part of the sequence
                            // Even indices in sequence correspond to Black, Odd to Red

                            for (let k = 0; k < nextExpectedIndex; k++) {
                                const seqVal = targetSequence[k]
                                const seqColor = k % 2 === 0 ? "black" : "red"

                                if (seqVal === val && seqColor === gridColors[i]) {
                                    isDone = true
                                    break
                                }
                            }
                        } else {
                            isDone = targetSequence.slice(0, nextExpectedIndex).includes(val)
                        }

                        return (
                            <motion.div
                                key={`${i}-${val}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    backgroundColor: isDone ? "rgba(var(--primary), 0.05)" : "transparent",
                                }}
                                className={cn(
                                    "relative flex items-center justify-center border border-border/50 text-xl sm:text-3xl font-mono font-bold cursor-pointer transition-colors rounded-none hover:bg-muted/50",
                                    isDone && "pointer-events-none border-border/20 text-muted-foreground/20",
                                    // Gorbov colors
                                    !isDone && isGorbovRed && "text-red-500",
                                    !isDone && isGorbovBlack && "text-foreground",
                                    !isDone && gameType !== "gorbov" && "text-foreground"
                                )}
                                onClick={() => handleCellClick(val, i)}
                            >
                                {val}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Game Over Dialog */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Complete</DialogTitle>
                            <DialogDescription>
                                Sequence cleared successfully.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/20 space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Final Time</span>
                        <div className="text-6xl font-bold font-mono text-primary tracking-tighter">
                            {formatTime(currentTime)}<span className="text-lg text-muted-foreground ml-1">s</span>
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" size="lg" onClick={() => setGameState("MENU")} className="w-full gap-2 rounded-none">
                            <Home className="w-4 h-4" />
                            Menu
                        </Button>
                        <Button size="lg" onClick={startNewGame} className="w-full gap-2 rounded-none">
                            <RotateCcw className="w-4 h-4" />
                            Retry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
