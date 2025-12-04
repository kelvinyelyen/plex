"use client"

import { useState, useEffect, useCallback } from "react"
import { Lightbulb } from "lucide-react"
import { Board } from "./components/board"
import { Controls } from "./components/controls"
import { generatePuzzle } from "./generator"
import { getHint } from "./hints"
import { Board as BoardType, Difficulty, CellValue } from "./types"
import { Button } from "@/components/ui/button"
import { CompletionDialog } from "./components/completion-dialog"
import { GameOverDialog } from "./components/game-over-dialog"
import { InstructionsDialog } from "./components/instructions-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SudokuGame() {
    const [difficulty, setDifficulty] = useState<Difficulty>("Easy")
    const [board, setBoard] = useState<BoardType | null>(null)
    const [solution, setSolution] = useState<BoardType | null>(null)
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
    const [isNoteMode, setIsNoteMode] = useState(false)
    const [history, setHistory] = useState<BoardType[]>([])
    const [mistakes, setMistakes] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [hintsUsed, setHintsUsed] = useState(0)

    const startNewGame = useCallback((diff: Difficulty) => {
        const { puzzle, solution } = generatePuzzle(diff)
        setBoard(puzzle)
        setSolution(solution)
        setDifficulty(diff)
        setMistakes(0)
        setTimer(0)
        setHistory([])
        setIsPlaying(true)
        setIsComplete(false)
        setIsGameOver(false)
        setHintsUsed(0)
        setSelectedCell(null)
    }, [])

    // Initialize game
    useEffect(() => {
        startNewGame(difficulty)
    }, [startNewGame, difficulty])

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying && !isComplete && !isGameOver) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isPlaying, isComplete, isGameOver])

    const handleCellClick = (row: number, col: number) => {
        setSelectedCell({ row, col })
    }

    const checkCompletion = useCallback((currentBoard: BoardType) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentBoard[i][j].value === null) return false
                // We assume if it's filled and mistakes are checked on entry, it's correct.
                // But strictly we should check against solution if we allow filling without checking.
                // In this implementation, we check on entry, so if it's filled, it's correct (unless we allow wrong moves).
                // Let's verify against solution to be safe.
                if (solution && currentBoard[i][j].value !== solution[i][j].value) return false
            }
        }
        return true
    }, [solution])

    const handleGameComplete = useCallback(async () => {
        setIsPlaying(false)
        setIsComplete(true)

        try {
            await fetch("/api/games/sudoku/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    score: timer,
                    difficulty,
                }),
            })
            toast.success("Score saved!")
        } catch (error) {
            console.error("Failed to save score:", error)
            toast.error("Failed to save score")
        }
    }, [timer, difficulty])

    const handleNumberClick = useCallback(
        (num: number) => {
            if (!board || !selectedCell || !isPlaying || !solution || isGameOver) return

            const { row, col } = selectedCell
            const cell = board[row][col]

            if (cell.isFixed) return

            const newBoard = JSON.parse(JSON.stringify(board)) as BoardType

            // Save to history before modifying
            setHistory((prev) => [...prev, JSON.parse(JSON.stringify(board))])

            if (isNoteMode) {
                // Toggle note
                if (newBoard[row][col].notes.includes(num)) {
                    newBoard[row][col].notes = newBoard[row][col].notes.filter((n) => n !== num)
                } else {
                    newBoard[row][col].notes = [...newBoard[row][col].notes, num]
                }
                setBoard(newBoard)
            } else {
                // Set value
                if (newBoard[row][col].value === num) {
                    newBoard[row][col].value = null // Toggle off if same
                    setBoard(newBoard)
                } else {
                    // Check for mistake
                    if (solution[row][col].value !== num) {
                        const newMistakes = mistakes + 1
                        setMistakes(newMistakes)

                        if (newMistakes >= 3) {
                            setIsGameOver(true)
                            setIsPlaying(false)
                            toast.error("Game Over! Too many mistakes.")
                        } else {
                            toast.error("Incorrect move!")
                        }
                        return
                    }

                    newBoard[row][col].value = num as CellValue
                    newBoard[row][col].notes = [] // Clear notes
                    setBoard(newBoard)

                    if (checkCompletion(newBoard)) {
                        handleGameComplete()
                    }
                }
            }
        },
        [board, selectedCell, isPlaying, isNoteMode, solution, checkCompletion, handleGameComplete, mistakes, isGameOver]
    )

    const handleDelete = useCallback(() => {
        if (!board || !selectedCell || !isPlaying || isGameOver) return
        const { row, col } = selectedCell
        if (board[row][col].isFixed) return

        setHistory((prev) => [...prev, JSON.parse(JSON.stringify(board))])
        const newBoard = JSON.parse(JSON.stringify(board))
        newBoard[row][col].value = null
        newBoard[row][col].notes = []
        setBoard(newBoard)
    }, [board, selectedCell, isPlaying, isGameOver])

    const handleUndo = useCallback(() => {
        if (history.length === 0 || isGameOver) return
        const previousBoard = history[history.length - 1]
        setBoard(previousBoard)
        setHistory((prev) => prev.slice(0, -1))
    }, [history, isGameOver])

    const handleHint = useCallback(() => {
        if (!board || !isPlaying || !solution || isGameOver) return
        if (hintsUsed >= 3) {
            toast.error("No more reveals available!")
            return
        }
        const hint = getHint(board)
        if (hint) {
            const newBoard = JSON.parse(JSON.stringify(board))
            // Apply hint
            if (hint.value === null) {
                // Suggest removing (shouldn't happen if we block mistakes, but possible if we change logic)
                newBoard[hint.row][hint.col].value = null
            } else {
                // Suggest adding
                // Use solution to be sure
                const correctValue = solution[hint.row][hint.col].value
                newBoard[hint.row][hint.col].value = correctValue
                setSelectedCell({ row: hint.row, col: hint.col })
            }
            setBoard(newBoard)
            setHintsUsed(prev => prev + 1)

            if (checkCompletion(newBoard)) {
                handleGameComplete()
            }
        }
    }, [board, isPlaying, solution, checkCompletion, handleGameComplete, isGameOver, hintsUsed])

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying || isGameOver) return

            if (e.key >= "1" && e.key <= "9") {
                handleNumberClick(parseInt(e.key))
            } else if (e.key === "Backspace" || e.key === "Delete") {
                handleDelete()
            } else if ((e.metaKey || e.ctrlKey) && e.key === "z") {
                handleUndo()
            } else if (e.key === "ArrowUp") {
                setSelectedCell(prev => prev ? { ...prev, row: Math.max(0, prev.row - 1) } : { row: 0, col: 0 })
            } else if (e.key === "ArrowDown") {
                setSelectedCell(prev => prev ? { ...prev, row: Math.min(8, prev.row + 1) } : { row: 0, col: 0 })
            } else if (e.key === "ArrowLeft") {
                setSelectedCell(prev => prev ? { ...prev, col: Math.max(0, prev.col - 1) } : { row: 0, col: 0 })
            } else if (e.key === "ArrowRight") {
                setSelectedCell(prev => prev ? { ...prev, col: Math.min(8, prev.col + 1) } : { row: 0, col: 0 })
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleNumberClick, handleDelete, handleUndo, isPlaying, isGameOver])

    if (!board) return <div>Loading...</div>

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto relative min-h-screen p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <CompletionDialog
                open={isComplete}
                time={timer}
                difficulty={difficulty}
                mistakes={mistakes}
                onPlayAgain={() => startNewGame(difficulty)}
            />
            <GameOverDialog
                open={isGameOver}
                onRestart={() => startNewGame(difficulty)}
            />

            <div className="mb-8 text-center space-y-2">
                <div className="font-mono text-xs text-muted-foreground tracking-[0.2em] uppercase">Protocol: Logic_Matrix</div>
                <h1 className="text-5xl md:text-6xl font-display italic font-bold">Sudoku</h1>
            </div>

            {/* HUD Toolbar */}
            <div className="w-full max-w-4xl border-y border-foreground/10 bg-background/50 backdrop-blur-sm px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-0 z-40">
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Difficulty</span>
                        <Select
                            value={difficulty}
                            onValueChange={(val: string) => startNewGame(val as Difficulty)}
                        >
                            <SelectTrigger className="w-[120px] h-8 border-none shadow-none p-0 text-xl font-display font-bold italic focus:ring-0 bg-transparent hover:bg-transparent">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-8 w-px bg-foreground/10 hidden md:block" />

                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Timer</span>
                        <span className="text-xl font-mono font-medium">{formatTime(timer)}</span>
                    </div>

                    <div className="h-8 w-px bg-foreground/10 hidden md:block" />

                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Mistakes</span>
                        <div className="flex items-center gap-1 h-7">
                            <span className={cn("text-xl font-mono font-medium", mistakes >= 3 ? "text-red-500" : "")}>
                                {mistakes}/3
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <Button variant="outline" size="sm" onClick={handleUndo} disabled={history.length === 0} className="font-mono text-xs uppercase tracking-wider border-foreground/20 hover:bg-foreground/5">
                        <span className="hidden sm:inline">Undo</span>
                        <span className="sm:hidden">↩</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete} className="font-mono text-xs uppercase tracking-wider border-foreground/20 hover:bg-foreground/5">
                        <span className="hidden sm:inline">Clear</span>
                        <span className="sm:hidden">⌫</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleHint}
                        disabled={hintsUsed >= 3}
                        className="border-foreground/20 hover:bg-foreground/5 relative"
                        title="Reveal Hint"
                    >
                        <Lightbulb className="h-4 w-4" />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {3 - hintsUsed}
                        </span>
                    </Button>
                    <div className="h-4 w-px bg-foreground/10 mx-2" />
                    <InstructionsDialog />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-16 w-full max-w-6xl">
                {/* Board */}
                <div className="w-full max-w-xl mx-auto lg:mx-0">
                    <Board
                        board={board}
                        selectedCell={selectedCell}
                        onCellClick={handleCellClick}
                    />
                </div>

                {/* Controls */}
                <div className="w-full max-w-sm mx-auto lg:mx-0 flex flex-col gap-8 pt-4">
                    <div className="bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-display font-bold italic text-lg">Input Control</h3>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                Status: {isNoteMode ? "ANNOTATION" : "ENTRY"}
                            </div>
                        </div>

                        <Controls
                            onNumberClick={handleNumberClick}
                            onNoteToggle={() => setIsNoteMode(!isNoteMode)}
                            isNoteMode={isNoteMode}
                        />
                    </div>

                    <Button
                        className="w-full h-12 font-mono uppercase tracking-widest text-xs border border-foreground/20"
                        variant="outline"
                        onClick={() => startNewGame(difficulty)}
                    >
                        Initialize New Matrix
                    </Button>
                </div>
            </div>
        </div>
    )
}
