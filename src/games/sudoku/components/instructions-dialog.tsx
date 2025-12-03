"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function InstructionsDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">How to play</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif font-bold text-center mb-4">How to Play Sudoku</DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    {/* History Section */}
                    <section className="space-y-2">
                        <h3 className="text-lg font-bold font-serif">History</h3>
                        <p className="text-sm text-muted-foreground">
                            The modern Sudoku was most likely designed anonymously by Howard Garns, a 74-year-old retired architect and freelance puzzle constructor from Connersville, Indiana, and first published in 1979 by Dell Magazines as Number Place (the earliest known examples of modern Sudoku).
                        </p>
                        <p className="text-sm text-muted-foreground">
                            The puzzle was introduced in Japan by Nikoli in the paper Monthly Nikolist in April 1984 as &quot;Sūji wa dokushin ni kagiru&quot; (Numbers must be single), which also can be abbreviated as &quot;Sudoku&quot;.
                        </p>
                    </section>

                    {/* Goal Section */}
                    <section className="space-y-2">
                        <h3 className="text-lg font-bold font-serif">The Goal</h3>
                        <p className="text-muted-foreground">
                            Fill the grid with numbers so that every row, column, and 3x3 box contains all digits from 1 to 9.
                        </p>
                    </section>

                    {/* Rules Section with Animations */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-bold font-serif">The Rules</h3>

                        {/* Rule 1: Rows */}
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <div className="w-48 h-48 shrink-0 bg-muted/20 rounded-lg p-2 flex items-center justify-center">
                                <div className="grid grid-cols-9 gap-0.5 w-full aspect-square bg-border border-2 border-border">
                                    {Array.from({ length: 81 }).map((_, i) => {
                                        const row = Math.floor(i / 9)
                                        const isTargetRow = row === 4
                                        return (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "bg-background w-full h-full flex items-center justify-center text-[8px] font-bold transition-colors duration-500",
                                                    isTargetRow && "animate-highlight-row bg-primary/20"
                                                )}
                                            >
                                                {isTargetRow ? (i % 9) + 1 : ""}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold">1. Rows</h4>
                                <p className="text-sm text-muted-foreground">
                                    Every row must contain the numbers 1 through 9, without repeating any.
                                </p>
                            </div>
                        </div>

                        {/* Rule 2: Columns */}
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <div className="w-48 h-48 shrink-0 bg-muted/20 rounded-lg p-2 flex items-center justify-center">
                                <div className="grid grid-cols-9 gap-0.5 w-full aspect-square bg-border border-2 border-border">
                                    {Array.from({ length: 81 }).map((_, i) => {
                                        const col = i % 9
                                        const isTargetCol = col === 4
                                        return (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "bg-background w-full h-full flex items-center justify-center text-[8px] font-bold transition-colors duration-500",
                                                    isTargetCol && "animate-highlight-col bg-primary/20"
                                                )}
                                            >
                                                {isTargetCol ? Math.floor(i / 9) + 1 : ""}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold">2. Columns</h4>
                                <p className="text-sm text-muted-foreground">
                                    Every column must contain the numbers 1 through 9, without repeating any.
                                </p>
                            </div>
                        </div>

                        {/* Rule 3: Boxes */}
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <div className="w-48 h-48 shrink-0 bg-muted/20 rounded-lg p-2 flex items-center justify-center">
                                <div className="grid grid-cols-9 gap-0.5 w-full aspect-square bg-border border-2 border-border relative">
                                    {/* Thick borders for boxes */}
                                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                                        {Array.from({ length: 9 }).map((_, i) => (
                                            <div key={i} className="border border-foreground/20" />
                                        ))}
                                    </div>

                                    {Array.from({ length: 81 }).map((_, i) => {
                                        const row = Math.floor(i / 9)
                                        const col = i % 9
                                        // Center box is rows 3-5, cols 3-5
                                        const isTargetBox = row >= 3 && row <= 5 && col >= 3 && col <= 5

                                        // Calculate number for box (1-9)
                                        let num = ""
                                        if (isTargetBox) {
                                            const boxRow = row - 3
                                            const boxCol = col - 3
                                            num = (boxRow * 3 + boxCol + 1).toString()
                                        }

                                        return (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "bg-background w-full h-full flex items-center justify-center text-[8px] font-bold transition-colors duration-500",
                                                    isTargetBox && "animate-highlight-box bg-primary/20"
                                                )}
                                            >
                                                {num}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold">3. 3x3 Boxes</h4>
                                <p className="text-sm text-muted-foreground">
                                    Each of the nine 3x3 boxes must contain the numbers 1 through 9, without repeating any.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Controls Section */}
                    <section className="space-y-2">
                        <h3 className="text-lg font-bold font-serif">Controls</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li><strong>Select a cell:</strong> Click or tap on any cell on the board.</li>
                            <li><strong>Enter a number:</strong> Use the number pad or your keyboard (1-9).</li>
                            <li><strong>Remove a number:</strong> Press Backspace, Delete, or the  &quot;Clear&quot; button.</li>
                            <li><strong>Notes mode:</strong> Toggle &quot;Note&quot; to add pencil marks for possible numbers.</li>
                            <li><strong>Undo:</strong> Press Ctrl/Cmd + Z or use the &quot;Undo&quot; button.</li>
                        </ul>
                    </section>

                    {/* Gameplay Section */}
                    <section className="space-y-2">
                        <h3 className="text-lg font-bold font-serif">Gameplay</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li><strong>Goal:</strong> Fill the board with numbers 1-9 such that each row, column, and 3x3 box contains all numbers from 1 to 9 without repetition.</li>
                            <li><strong>Winning:</strong> Successfully complete the puzzle by following the rules.</li>
                        </ul>
                    </section>

                </div>

                <style jsx global>{`
                    @keyframes highlight-row {
                        0%, 100% { background-color: hsl(var(--background)); color: transparent; }
                        50% { background-color: hsl(var(--primary) / 0.2); color: hsl(var(--foreground)); }
                    }
                    @keyframes highlight-col {
                        0%, 100% { background-color: hsl(var(--background)); color: transparent; }
                        50% { background-color: hsl(var(--primary) / 0.2); color: hsl(var(--foreground)); }
                    }
                    @keyframes highlight-box {
                        0%, 100% { background-color: hsl(var(--background)); color: transparent; }
                        50% { background-color: hsl(var(--primary) / 0.2); color: hsl(var(--foreground)); }
                    }
                    .animate-highlight-row {
                        animation: highlight-row 3s infinite;
                    }
                    .animate-highlight-col {
                        animation: highlight-col 3s infinite;
                        animation-delay: 1s;
                    }
                    .animate-highlight-box {
                        animation: highlight-box 3s infinite;
                        animation-delay: 2s;
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    )
}
