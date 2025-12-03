"use client"

import { useState, useEffect, useCallback } from "react"
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

            if (checkCompletion(newBoard)) {
                handleGameComplete()
            }
        }
    }, [board, isPlaying, solution, checkCompletion, handleGameComplete, isGameOver])

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
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
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

            {/* Toolbar */}
            <div className="w-full border-b bg-card px-4 py-2 flex items-center justify-between sticky top-14 z-40 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Difficulty</span>
                        <Select
                            value={difficulty}
                            onValueChange={(val: string) => startNewGame(val as Difficulty)}
                        >
                            <SelectTrigger className="w-[100px] h-8 border-none shadow-none p-0 text-base font-serif font-bold focus:ring-0">
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
                    <div className="h-8 w-px bg-border mx-2" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Timer</span>
                        <span className="text-base font-mono font-medium">{formatTime(timer)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleUndo} disabled={history.length === 0} className="text-muted-foreground hover:text-foreground">
                        Undo
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground hover:text-foreground">
                        Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleHint} className="text-muted-foreground hover:text-foreground">
                        Reveal
                    </Button>
                    <div className="h-4 w-px bg-border mx-1" />
                    <InstructionsDialog />
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-12 w-full p-6 md:p-10">
                {/* Board */}
                <div className="w-full flex-1">
                    <Board
                        board={board}
                        selectedCell={selectedCell}
                        onCellClick={handleCellClick}
                    />
                </div>

                {/* Controls */}
                <div className="w-full max-w-[300px] flex flex-col gap-8 pt-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-serif text-xl font-bold">Controls</h3>
                            <div className="text-xs font-medium text-muted-foreground">
                                Mistakes: <span className={mistakes >= 3 ? "text-destructive" : ""}>{mistakes}/3</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Select a cell and tap a number to fill it in.
                        </p>
                    </div>

                    <Controls
                        onNumberClick={handleNumberClick}
                        onNoteToggle={() => setIsNoteMode(!isNoteMode)}
                        isNoteMode={isNoteMode}
                    />

                    <Button
                        className="w-full h-12 font-serif text-lg"
                        onClick={() => startNewGame(difficulty)}
                    >
                        New Puzzle
                    </Button>
                </div>
            </div>
        </div>
    )
}
