"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Disc, RotateCcw, Home, ArrowLeft, Trophy } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Disk colors/sizes
const DISKS = [
    { id: 1, width: "w-8", color: "bg-red-500" },
    { id: 2, width: "w-12", color: "bg-orange-500" },
    { id: 3, width: "w-16", color: "bg-yellow-500" },
    { id: 4, width: "w-20", color: "bg-green-500" },
    { id: 5, width: "w-24", color: "bg-blue-500" },
    { id: 6, width: "w-28", color: "bg-indigo-500" }, // For hard mode?
    { id: 7, width: "w-32", color: "bg-violet-500" },
]

type TowerId = 0 | 1 | 2

export function HanoiGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "WON">("MENU")
    const [numDisks, setNumDisks] = useState(3)
    const [towers, setTowers] = useState<number[][]>([[], [], []])
    const [selectedTower, setSelectedTower] = useState<TowerId | null>(null)
    const [moves, setMoves] = useState(0)

    // Optimal moves: 2^n - 1
    const optimalMoves = Math.pow(2, numDisks) - 1

    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = (disks: number = 3) => {
        setNumDisks(disks)
        // Initialize tower 0 with disks [disks, disks-1, ... 1]
        // Larger ID = Larger Disk
        const initialTower = Array.from({ length: disks }, (_, i) => disks - i)
        setTowers([initialTower, [], []])
        setMoves(0)
        setSelectedTower(null)
        setGameState("PLAYING")
    }

    const handleTowerClick = (towerIdx: TowerId) => {
        if (gameState !== "PLAYING") return

        // If no tower selected, select this one (if it has disks)
        if (selectedTower === null) {
            if (towers[towerIdx].length > 0) {
                setSelectedTower(towerIdx)
            }
        } else {
            // A tower is already selected. Try to move to the clicked tower.
            if (selectedTower === towerIdx) {
                // Deselect if clicking same tower
                setSelectedTower(null)
            } else {
                moveDisk(selectedTower, towerIdx)
            }
        }
    }

    const moveDisk = (from: TowerId, to: TowerId) => {
        const sourceTower = [...towers[from]]
        const destTower = [...towers[to]]

        if (sourceTower.length === 0) return // Should not happen given logic

        const diskToMove = sourceTower[sourceTower.length - 1]
        const topDestDisk = destTower.length > 0 ? destTower[destTower.length - 1] : 999

        // Valid move: Destination empty OR top disk larger than moving disk
        if (diskToMove < topDestDisk) {
            // Execute move
            sourceTower.pop()
            destTower.push(diskToMove)

            const newTowers = [...towers]
            newTowers[from] = sourceTower
            newTowers[to] = destTower

            setTowers(newTowers)
            setMoves(prev => prev + 1)
            setSelectedTower(null)

            // Check Win Condition: All disks on Tower 2 (index 2)
            // Or Tower 1? Standard is usually last peg.
            if (destTower.length === numDisks && to !== 0) {
                setGameState("WON")
            }
        } else {
            // Invalid move
            // Maybe shake animation?
            setSelectedTower(null)
        }
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Tower of Hanoi"
                    description="Classic Logic Puzzle. Move the stack to the last peg."
                    onStart={() => {
                        startGame(3) // Default to 3 for ease, or adding difficulty selector?
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>1. Move all disks to the third peg.</p>
                        <p>2. Move one disk at a time.</p>
                        <p>3. Larger disks cannot be placed on smaller disks.</p>
                    </div>}
                    icon={<Disc className="w-16 h-16 text-primary" />}
                />

                <div className="mt-8 flex gap-4">
                    <Button variant="outline" onClick={() => { startGame(3); router.replace(`${pathname}?mode=play`) }}>Msg (3)</Button>
                    <Button variant="outline" onClick={() => { startGame(4); router.replace(`${pathname}?mode=play`) }}>Avg (4)</Button>
                    <Button variant="outline" onClick={() => { startGame(5); router.replace(`${pathname}?mode=play`) }}>Hrd (5)</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-3xl mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Tower of Hanoi</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Optimal</span>
                    <span className="text-2xl font-mono font-bold text-muted-foreground">{optimalMoves}</span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Disks</span>
                    <span className="text-xl font-mono font-bold">{numDisks}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Moves</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {moves}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex items-end justify-center gap-4 md:gap-12 w-full h-64">
                    {[0, 1, 2].map((towerIndex) => (
                        <div
                            key={towerIndex}
                            className={cn(
                                "relative w-1/3 h-full flex flex-col items-center justify-end group cursor-pointer rounded-xl transition-colors",
                                selectedTower === towerIndex ? "bg-primary/10" : "hover:bg-muted/10"
                            )}
                            onClick={() => handleTowerClick(towerIndex as TowerId)}
                        >
                            {/* Pole */}
                            <div className="absolute bottom-0 w-2 h-48 bg-muted-foreground/30 rounded-t-full" />

                            {/* Base */}
                            <div className="absolute bottom-0 w-full h-2 bg-muted-foreground/30 rounded-full" />

                            {/* Disks */}
                            {/* Render disks floating if selected? */}
                            <div className="z-10 flex flex-col-reverse items-center justify-end mb-2 gap-1 w-full">
                                <AnimatePresence>
                                    {towers[towerIndex].map((diskSize, index) => {
                                        const isTop = index === towers[towerIndex].length - 1
                                        const isSelected = selectedTower === towerIndex && isTop

                                        // Find disk props
                                        // diskSize is an integer 1..N
                                        // map to width?
                                        // We can calculate width percentage or use tailwind classes
                                        // 3 disks: 33%, 66%, 100%
                                        // 5 disks: 20%, 40%, 60%, 80%, 100%
                                        const widthPercent = 30 + (diskSize / numDisks) * 70

                                        return (
                                            <motion.div
                                                key={diskSize}
                                                layoutId={`disk-${diskSize}`}
                                                initial={false}
                                                animate={{
                                                    y: isSelected ? -20 : 0,
                                                    boxShadow: isSelected ? "0px 10px 20px rgba(0,0,0,0.2)" : "none"
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className={cn(
                                                    "h-8 rounded-md bg-primary border border-primary-foreground/20 shadow-sm",
                                                    // Dynamic width
                                                )}
                                                style={{ width: `${widthPercent}%` }}
                                            >
                                                {/* Maybe put number on disk? */}
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-sm text-muted-foreground font-mono">
                    {selectedTower !== null
                        ? "Select destination peg..."
                        : "Select a disk to move..."}
                </div>
            </div>

            {/* Win Dialog */}
            <Dialog open={gameState === "WON"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Puzzle Solved</DialogTitle>
                            <DialogDescription>
                                Well done.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/20 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Moves</span>
                            <div className="text-4xl font-bold font-mono text-foreground tracking-tighter">
                                {moves}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/20 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Optimal</span>
                            <div className="text-4xl font-bold font-mono text-muted-foreground tracking-tighter">
                                {optimalMoves}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" size="lg" onClick={() => setGameState("MENU")} className="w-full gap-2 rounded-none">
                            <Home className="w-4 h-4" />
                            Menu
                        </Button>
                        <Button size="lg" onClick={() => startGame(numDisks)} className="w-full gap-2 rounded-none">
                            <RotateCcw className="w-4 h-4" />
                            Replay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
