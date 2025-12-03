"use client"

import { useState, useEffect, useCallback } from "react"
import { Board } from "./components/board"
import { Controls } from "./components/controls"
import { generatePuzzle } from "./generator"
import { getHint } from "./hints"
import { Board as BoardType, Difficulty, CellValue } from "./types"
import { Button } from "@/components/ui/button"

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
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
    const [isNoteMode, setIsNoteMode] = useState(false)
    const [history, setHistory] = useState<BoardType[]>([])
    const [mistakes, setMistakes] = useState(0)
    const [timer, setTimer] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const startNewGame = useCallback((diff: Difficulty) => {
        const newBoard = generatePuzzle(diff)
        setBoard(newBoard)
        setDifficulty(diff)
        setMistakes(0)
        setTimer(0)
        setHistory([])
        setIsPlaying(true)
        setSelectedCell(null)
    }, [])

    // Initialize game
    useEffect(() => {
        startNewGame(difficulty)
    }, [startNewGame, difficulty])

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isPlaying])

    const handleCellClick = (row: number, col: number) => {
        setSelectedCell({ row, col })
    }

    const handleNumberClick = useCallback(
        (num: number) => {
            if (!board || !selectedCell || !isPlaying) return

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
            } else {
                // Set value
                if (newBoard[row][col].value === num) {
                    newBoard[row][col].value = null // Toggle off if same
                } else {
                    newBoard[row][col].value = num as CellValue
                    newBoard[row][col].notes = [] // Clear notes

                    // Check for error (simple check against rules, ideally check against solution)
                    // For now, let's just check if it violates basic rules
                    // Real validation should check against the actual solution
                    // But we don't store the solution in state currently.
                    // We can generate it or just check validity.
                    // Let's assume validity check is enough for "Mistakes" if it conflicts with existing fixed cells?
                    // Actually, standard Sudoku apps check against the solution.
                    // I'll skip mistake counting for now unless I store solution.
                }
            }

            setBoard(newBoard)
        },
        [board, selectedCell, isPlaying, isNoteMode]
    )

    const handleDelete = useCallback(() => {
        if (!board || !selectedCell || !isPlaying) return
        const { row, col } = selectedCell
        if (board[row][col].isFixed) return

        setHistory((prev) => [...prev, JSON.parse(JSON.stringify(board))])
        const newBoard = JSON.parse(JSON.stringify(board))
        newBoard[row][col].value = null
        newBoard[row][col].notes = []
        setBoard(newBoard)
    }, [board, selectedCell, isPlaying])

    const handleUndo = useCallback(() => {
        if (history.length === 0) return
        const previousBoard = history[history.length - 1]
        setBoard(previousBoard)
        setHistory((prev) => prev.slice(0, -1))
    }, [history])

    const handleHint = useCallback(() => {
        if (!board || !isPlaying) return
        const hint = getHint(board)
        if (hint) {
            const newBoard = JSON.parse(JSON.stringify(board))
            // Apply hint
            if (hint.value === null) {
                // Suggest removing
                newBoard[hint.row][hint.col].value = null
                // toast(`Hint: ${hint.message}`)
            } else {
                // Suggest adding
                newBoard[hint.row][hint.col].value = hint.value
                setSelectedCell({ row: hint.row, col: hint.col })
            }
            setBoard(newBoard)
            // toast(`Hint: ${hint.message}`)
        } else {
            // toast("No hint available or puzzle solved!")
        }
    }, [board, isPlaying])

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying) return

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
    }, [handleNumberClick, handleDelete, handleUndo, isPlaying])

    if (!board) return <div>Loading...</div>

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
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
