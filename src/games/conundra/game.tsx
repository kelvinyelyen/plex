"use client"

import { GameStartScreen } from "@/components/game/start-screen"
import { ConundraGuide } from "@/components/game/game-guides"
import { ConundraAnimation } from "@/components/ui/game-animations"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { toast } from "sonner"
import { generateTarget } from "./generator"
import { Difficulty, GameState } from "./types"
import { CompletionDialog } from "./components/completion-dialog"
import { cn } from "@/lib/utils"

export function ConundraGame() {
    const [difficulty, setDifficulty] = useState<Difficulty>("Medium")
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [selectedIndices, setSelectedIndices] = useState<number[]>([])
    const [timer, setTimer] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [moves, setMoves] = useState(0)

    const startNewGame = useCallback((diff: Difficulty) => {
        const { target, numbers } = generateTarget(diff)
        setGameState({
            target,
            numbers,
            history: [numbers],
            expression: ""
        })
        setDifficulty(diff)
        setTimer(0)
        setMoves(0)
        setIsPlaying(true)
        setIsComplete(false)
        setSelectedIndices([])
    }, [])

    useEffect(() => {
        startNewGame(difficulty)
    }, [startNewGame, difficulty])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying && !isComplete) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isPlaying, isComplete])

    const handleNumberSelect = (index: number) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(prev => prev.filter(i => i !== index))
        } else {
            if (selectedIndices.length < 2) {
                setSelectedIndices(prev => [...prev, index])
            } else {
                // Replace the first selected if 2 are already selected (optional, or just block)
                // Better UX: Allow only 2. If clicking 3rd, ignore or replace oldest?
                // Let's stick to max 2.
                toast.error("Select an operator to combine numbers")
            }
        }
    }

    const handleGameComplete = useCallback(async (finalMoves: number) => {
        setIsComplete(true)
        setIsPlaying(false)
        toast.success("Target Reached!")

        try {
            await fetch("/api/games/conundra/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    score: timer,
                    difficulty,
                    moves: finalMoves
                }),
            })
            toast.success("Score saved!")
        } catch (error) {
            console.error("Failed to save score:", error)
            toast.error("Failed to save score")
        }
    }, [timer, difficulty])

    const applyOperation = (op: string) => {
        if (!gameState || selectedIndices.length !== 2) return

        const [idx1, idx2] = selectedIndices
        const val1 = gameState.numbers[idx1]
        const val2 = gameState.numbers[idx2]
        let result = 0

        switch (op) {
            case "+": result = val1 + val2; break
            case "-": result = Math.abs(val1 - val2); break
            case "*": result = val1 * val2; break
            case "/":
                if (val2 === 0 || val1 % val2 !== 0) {
                    toast.error("Invalid division")
                    return
                }
                result = val1 / val2
                break
        }

        const newNumbers = gameState.numbers.filter((_, i) => i !== idx1 && i !== idx2)
        newNumbers.push(result)

        const newMoves = moves + 1
        setMoves(newMoves)

        setGameState(prev => ({
            ...prev!,
            numbers: newNumbers,
            history: [...prev!.history, prev!.numbers]
        }))
        setSelectedIndices([])

        if (newNumbers.length === 1 && newNumbers[0] === gameState.target) {
            handleGameComplete(newMoves)
        } else if (newNumbers.length === 1 && newNumbers[0] !== gameState.target) {
            toast.error("Failed to reach target. Try undoing.")
        }
    }

    const handleUndo = () => {
        if (!gameState || gameState.history.length === 0) return
        const previousNumbers = gameState.history[gameState.history.length - 1]
        setGameState(prev => ({
            ...prev!,
            numbers: previousNumbers,
            history: prev!.history.slice(0, -1)
        }))
        setSelectedIndices([])
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const router = useRouter()
    const pathname = usePathname()
    const [hasStarted, setHasStarted] = useState(false)

    const handleQuit = () => {
        setHasStarted(false)
        router.replace(pathname)
    }

    if (!gameState) return <div>Loading...</div>

    if (!hasStarted) {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Conundra"
                    description="Combine the given numbers using basic arithmetic operations (+, -, ×, ÷) to reach the target number."
                    onStart={() => {
                        setHasStarted(true)
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<ConundraGuide />}
                    icon={<ConundraAnimation />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-4xl mx-auto gap-8">
            <CompletionDialog
                open={isComplete}
                time={timer}
                difficulty={difficulty}
                moves={moves}
                onPlayAgain={() => startNewGame(difficulty)}
                onClose={() => setIsComplete(false)}
                onQuit={handleQuit}
            />

            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Conundra</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Minimal Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="font-mono text-sm hover:bg-transparent px-0 h-auto py-0 rounded-none">
                            {difficulty} <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => startNewGame("Easy")}>Easy</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => startNewGame("Medium")}>Medium</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => startNewGame("Hard")}>Hard</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => startNewGame("Expert")}>Expert</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="font-mono text-sm tabular-nums tracking-wider">
                    {formatTime(timer)}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleUndo} disabled={gameState.history.length <= 1} className="font-mono text-xs uppercase rounded-none">
                        Undo
                    </Button>
                    <div className="h-4 w-px bg-border/50" />
                    <Button variant="ghost" size="sm" onClick={() => startNewGame(difficulty)} className="font-mono text-xs uppercase rounded-none">
                        Restart
                    </Button>
                </div>
            </div>

            {/* Game Area */}
            <div className="w-full grid md:grid-cols-2 gap-12 items-start">
                {/* Target & Numbers */}
                <div className="space-y-8">
                    <div className="p-4 md:p-8 flex flex-col items-center justify-center border rounded-none bg-muted/20">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">Target</span>
                        <span className="text-6xl font-mono font-bold tracking-tighter">{gameState.target}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-[14rem] content-start">
                        <AnimatePresence mode="popLayout">
                            {gameState.numbers.map((num, idx) => (
                                <motion.button
                                    layout
                                    key={`${idx}-${num}`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    onClick={() => handleNumberSelect(idx)}
                                    className={cn(
                                        "h-16 md:h-24 rounded-none text-3xl font-mono font-bold transition-all border",
                                        selectedIndices.includes(idx)
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background hover:bg-muted border-border"
                                    )}
                                >
                                    {num}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Operators */}
                <div className="flex flex-col justify-start gap-6">
                    <div className="grid grid-cols-2 gap-3">
                        {["+", "-", "*", "/"].map((op) => (
                            <Button
                                key={op}
                                variant="outline"
                                className="h-16 md:h-24 text-4xl font-mono hover:bg-muted/50 transition-colors rounded-none"
                                disabled={selectedIndices.length !== 2}
                                onClick={() => applyOperation(op)}
                            >
                                {op === "*" ? "×" : op === "/" ? "÷" : op}
                            </Button>
                        ))}
                    </div>
                    <div className="text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
                        {selectedIndices.length === 0 ? "Select 1st Number" : selectedIndices.length === 1 ? "Select 2nd Number" : "Select Operator"}
                    </div>
                </div>
            </div>
        </div>
    )
}
