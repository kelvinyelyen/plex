"use client"

import { GameStartScreen } from "@/components/game/start-screen"
import { SudokuGuide } from "@/components/game/game-guides"
import { SudokuAnimation } from "@/components/ui/game-animations"

import { useState, useEffect, useCallback } from "react"
import { Board } from "./components/board"
import { Controls } from "./components/controls"
import { generatePuzzle } from "./generator"
import { getHint } from "./hints"
import { Board as BoardType, Difficulty, CellValue } from "./types"
import { Button } from "@/components/ui/button"
import { CompletionDialog } from "./components/completion-dialog"
import { GameOverDialog } from "./components/game-over-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function SudokuGame() {
    const router = useRouter()
    const pathname = usePathname()
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

    const [hasStarted, setHasStarted] = useState(false)

    if (!board) return <div>Loading...</div>

    if (!hasStarted) {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Sudoku"
                    description="Fill the 9x9 grid with digits so that each column, each row, and each of the nine 3x3 subgrids that compose the grid contain all of the digits from 1 to 9."
                    onStart={() => {
                        setHasStarted(true)
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<SudokuGuide />}
                    icon={<SudokuAnimation />}
                />
            </div>
        )
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleQuit = () => {
        setHasStarted(false)
        router.replace(pathname)
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-5xl mx-auto gap-8">
            <CompletionDialog
                open={isComplete}
                time={timer}
                difficulty={difficulty}
                mistakes={mistakes}
                onPlayAgain={() => startNewGame(difficulty)}
                onClose={() => setIsComplete(false)}
                onQuit={handleQuit}
            />
            <GameOverDialog
                open={isGameOver}
                onRestart={() => startNewGame(difficulty)}
                onClose={() => setIsGameOver(false)}
                onQuit={handleQuit}
            />

            <div className="w-full max-w-4xl flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Sudoku</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Minimal Header */}
            <div className="w-full max-w-4xl flex items-center justify-between border-b pb-4 border-border/50">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="font-mono text-sm hover:bg-transparent px-0 h-auto py-0">
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

                <div className={cn("font-mono text-sm", mistakes >= 3 ? "text-destructive" : "text-muted-foreground")}>
                    Mistakes: {mistakes}/3
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-start justify-center gap-12 w-full">
                {/* Board */}
                <div className="w-full max-w-xl">
                    <Board
                        board={board}
                        selectedCell={selectedCell}
                        onCellClick={handleCellClick}
                    />
                </div>

                {/* Controls Side */}
                <div className="w-full md:max-w-[280px] flex flex-col gap-8 self-center md:self-start md:pt-4">
                    <Controls
                        onNumberClick={handleNumberClick}
                        onNoteToggle={() => setIsNoteMode(!isNoteMode)}
                        isNoteMode={isNoteMode}
                    />

                    <div className="flex justify-between gap-2">
                        <Button variant="outline" size="sm" onClick={handleUndo} disabled={history.length === 0} className="flex-1 font-mono text-xs uppercase tracking-wider rounded-none">
                            Undo
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDelete} className="flex-1 font-mono text-xs uppercase tracking-wider rounded-none">
                            Clear
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleHint}
                            disabled={hintsUsed >= 3}
                            className="flex-1 font-mono text-xs uppercase tracking-wider rounded-none"
                        >
                            Hint
                        </Button>
                    </div>

                    <div className="h-px bg-border/50 w-full my-2" />

                    <Button
                        className="w-full rounded-none"
                        variant="outline"
                        onClick={() => startNewGame(difficulty)}
                    >
                        New Game
                    </Button>
                </div>
            </div>
        </div>
    )
}
