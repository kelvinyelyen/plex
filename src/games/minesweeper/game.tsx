"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Bomb, Flag, Smile, Frown, RefreshCw, Trophy, Home, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Config
const ROWS = 10
const COLS = 10
const MINES = 15

type CellState = {
    x: number
    y: number
    isMine: boolean
    isRevealed: boolean
    isFlagged: boolean
    neighborBoxCount: number
}

export function MinesweeperGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "WON" | "LOST">("MENU")
    const [grid, setGrid] = useState<CellState[][]>([])
    const [minesLeft, setMinesLeft] = useState(MINES)
    const [time, setTime] = useState(0)

    const router = useRouter()
    const pathname = usePathname()

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (gameState === "PLAYING") {
            interval = setInterval(() => setTime(t => t + 1), 1000)
        }
        return () => clearInterval(interval)
    }, [gameState])

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const initGame = () => {
        const newGrid: CellState[][] = []
        for (let y = 0; y < ROWS; y++) {
            const row: CellState[] = []
            for (let x = 0; x < COLS; x++) {
                row.push({
                    x, y,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborBoxCount: 0
                })
            }
            newGrid.push(row)
        }

        // Place Mines
        let minesPlaced = 0
        while (minesPlaced < MINES) {
            const rx = Math.floor(Math.random() * COLS)
            const ry = Math.floor(Math.random() * ROWS)
            if (!newGrid[ry][rx].isMine) {
                newGrid[ry][rx].isMine = true
                minesPlaced++
            }
        }

        // Calculate Neighbors
        const getNeighbors = (cx: number, cy: number) => {
            const neighbors = []
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue
                    const nx = cx + dx
                    const ny = cy + dy
                    if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
                        neighbors.push(newGrid[ny][nx])
                    }
                }
            }
            return neighbors
        }

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (!newGrid[y][x].isMine) {
                    const neighbors = getNeighbors(x, y)
                    newGrid[y][x].neighborBoxCount = neighbors.filter(n => n.isMine).length
                }
            }
        }

        setGrid(newGrid)
        setMinesLeft(MINES)
        setTime(0)
        setGameState("PLAYING")
    }

    const revealCell = (x: number, y: number) => {
        if (gameState !== "PLAYING") return
        const cell = grid[y][x]
        if (cell.isRevealed || cell.isFlagged) return

        let newGrid = [...grid]

        if (cell.isMine) {
            // BOOM
            revealAllMines(newGrid)
            setGameState("LOST")
        } else {
            // Reveal
            newGrid = floodFill(newGrid, x, y)
            setGrid(newGrid)
            checkWin(newGrid)
        }
    }

    const toggleFlag = (e: React.MouseEvent, x: number, y: number) => {
        e.preventDefault()
        if (gameState !== "PLAYING") return
        const cell = grid[y][x]
        if (cell.isRevealed) return

        const newGrid = [...grid]
        newGrid[y][x].isFlagged = !cell.isFlagged
        setGrid(newGrid)
        setMinesLeft(prev => cell.isFlagged ? prev + 1 : prev - 1)
    }

    const floodFill = (currentGrid: CellState[][], x: number, y: number) => {
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return currentGrid
        if (currentGrid[y][x].isRevealed || currentGrid[y][x].isFlagged) return currentGrid

        currentGrid[y][x].isRevealed = true

        if (currentGrid[y][x].neighborBoxCount === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue
                    floodFill(currentGrid, x + dx, y + dy)
                }
            }
        }
        return currentGrid
    }

    const revealAllMines = (currentGrid: CellState[][]) => {
        currentGrid.forEach(row => row.forEach(cell => {
            if (cell.isMine) cell.isRevealed = true
        }))
        setGrid(currentGrid)
    }

    const checkWin = (currentGrid: CellState[][]) => {
        const revealedCount = currentGrid.flat().filter(c => c.isRevealed).length
        const totalNonMines = (ROWS * COLS) - MINES
        if (revealedCount === totalNonMines) {
            setGameState("WON")
        }
    }

    const getNumberColor = (count: number) => {
        const colors = [
            "text-transparent", // 0
            "text-blue-500",
            "text-green-500",
            "text-red-500",
            "text-purple-500",
            "text-yellow-600",
            "text-cyan-600",
            "text-black",
            "text-gray-500",
        ]
        return colors[count] || "text-gray-500"
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Minesweeper"
                    description="Logic Puzzle. Clear the minefield without detonating a bomb."
                    onStart={() => {
                        initGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>1. Left Click to reveal a tile.</p>
                        <p>2. Right Click (or Long Press) to flag a mine.</p>
                        <p>3. Numbers indicate adjacent mines.</p>
                    </div>}
                    icon={<Bomb className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-lg mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Minesweeper</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between bg-muted/20 p-4 rounded-xl border border-border/50">
                <div className="flex flex-col items-center bg-background/50 p-2 rounded w-20">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Mines</span>
                    <span className="text-xl font-mono font-bold text-red-500">{minesLeft}</span>
                </div>

                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 text-2xl" onClick={initGame}>
                    {gameState === "WON" ? <Smile className="text-green-500" /> :
                        gameState === "LOST" ? <Frown className="text-red-500" /> :
                            <span className="text-yellow-500">●</span>}
                </Button>

                <div className="flex flex-col items-center bg-background/50 p-2 rounded w-20">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
                    <span className="text-xl font-mono font-bold">{time}</span>
                </div>
            </div>

            {/* Grid */}
            <div
                className="grid gap-1 bg-muted/40 p-2 rounded-lg select-none"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`
                }}
                onContextMenu={(e) => e.preventDefault()}
            >
                {grid.map((row, y) =>
                    row.map((cell, x) => (
                        <motion.div
                            key={`${x}-${y}`}
                            className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold rounded cursor-pointer transition-colors shadow-sm",
                                cell.isRevealed
                                    ? (cell.isMine ? "bg-red-500/80" : "bg-background/80")
                                    : "bg-muted hover:brightness-110 active:scale-95 border-b-2 border-r-2 border-muted-foreground/20"
                            )}
                            onClick={() => revealCell(x, y)}
                            onContextMenu={(e) => toggleFlag(e, x, y)}
                            initial={false}
                            animate={{ scale: cell.isRevealed ? 1 : 1 }}
                        >
                            {cell.isRevealed ? (
                                cell.isMine ? <Bomb className="w-5 h-5 text-white animate-pulse" /> :
                                    <span className={getNumberColor(cell.neighborBoxCount)}>
                                        {cell.neighborBoxCount > 0 ? cell.neighborBoxCount : ""}
                                    </span>
                            ) : (
                                cell.isFlagged && <Flag className="w-4 h-4 text-red-500 fill-red-500" />
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            <div className="text-xs text-muted-foreground font-mono">
                Left Click: Reveal • Right Click: Flag
            </div>

            {/* Game Over Dialog */}
            <Dialog open={gameState === "WON" || gameState === "LOST"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className={cn("p-4 rounded-none ring-1", gameState === "WON" ? "bg-primary/10 text-primary ring-primary/20" : "bg-destructive/10 text-destructive ring-destructive/20")}>
                            {gameState === "WON" ? <Trophy className="w-8 h-8" /> : <Frown className="w-8 h-8" />}
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">
                                {gameState === "WON" ? "Mindswept!" : "Boom!"}
                            </DialogTitle>
                            <DialogDescription>
                                {gameState === "WON" ? `Cleared in ${time} seconds.` : "You hit a mine."}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" size="lg" onClick={() => setGameState("MENU")} className="w-full gap-2 rounded-none">
                            <Home className="w-4 h-4" />
                            Menu
                        </Button>
                        <Button size="lg" onClick={initGame} className="w-full gap-2 rounded-none">
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
