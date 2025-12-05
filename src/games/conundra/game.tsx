"use client"

import { GameStartScreen } from "@/components/game/start-screen"
import { ConundraGuide } from "@/components/game/game-guides"
import { ConundraAnimation } from "@/components/ui/game-animations"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { generateTarget } from "./generator"
import { Difficulty, GameState } from "./types"
import { CompletionDialog } from "./components/completion-dialog"

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

    const [hasStarted, setHasStarted] = useState(false)

    if (!gameState) return <div>Loading...</div>

    if (!hasStarted) {
        return (
            <GameStartScreen
                title="Conundra"
                description="Combine the given numbers using basic arithmetic operations (+, -, ×, ÷) to reach the target number."
                onStart={() => setHasStarted(true)}
                instructions={<ConundraGuide />}
                icon={<ConundraAnimation />}
            />
        )
    }

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
            <CompletionDialog
                open={isComplete}
                time={timer}
                difficulty={difficulty}
                moves={moves}
                onPlayAgain={() => startNewGame(difficulty)}
            />

            <div className="mb-8 text-center space-y-2">
                <h1 className="text-4xl font-bold">Conundra</h1>
                <p className="text-muted-foreground">Combine numbers to reach the target.</p>
            </div>

            {/* Toolbar */}
            <div className="w-full border rounded-lg bg-background px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Difficulty</span>
                        <Select value={difficulty} onValueChange={(val: string) => startNewGame(val as Difficulty)}>
                            <SelectTrigger className="w-[120px] h-8 border-none shadow-none p-0 text-lg font-bold focus:ring-0 bg-transparent">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-8 w-px bg-border hidden md:block" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Timer</span>
                        <span className="text-lg font-medium">{formatTime(timer)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleUndo} disabled={gameState.history.length <= 1}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Undo
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => startNewGame(difficulty)}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Restart
                    </Button>
                </div>
            </div>

            {/* Game Area */}
            <div className="w-full grid md:grid-cols-2 gap-8">
                {/* Target & Numbers */}
                <div className="space-y-8">
                    <Card className="p-8 flex flex-col items-center justify-center bg-primary/5 border-primary/20">
                        <span className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Target</span>
                        <span className="text-6xl font-bold text-primary">{gameState.target}</span>
                    </Card>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-h-[20rem] sm:min-h-[13rem]">
                        <AnimatePresence>
                            {gameState.numbers.map((num, idx) => (
                                <motion.button
                                    key={`${idx}-${num}`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    onClick={() => handleNumberSelect(idx)}
                                    className={`
                                        h-24 rounded-xl text-3xl font-bold transition-all border
                                        ${selectedIndices.includes(idx)
                                            ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary ring-offset-2 border-primary"
                                            : "bg-card hover:bg-accent border-input shadow-sm"}
                                    `}
                                >
                                    {num}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Operators */}
                <div className="flex flex-col justify-start gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        {["+", "-", "*", "/"].map((op) => (
                            <Button
                                key={op}
                                variant="outline"
                                className="h-20 text-3xl"
                                disabled={selectedIndices.length !== 2}
                                onClick={() => applyOperation(op)}
                            >
                                {op === "*" ? "×" : op === "/" ? "÷" : op}
                            </Button>
                        ))}
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Select two numbers, then an operator.
                    </div>
                </div>
            </div>
        </div>
    )
}
