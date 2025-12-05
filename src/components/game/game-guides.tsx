"use client"

import { motion } from "framer-motion"

export function SudokuGuide() {
    return (
        <div className="space-y-6">
            {/* Goal Section */}
            <section className="space-y-2">
                <h3 className="text-lg font-bold">The Goal</h3>
                <p className="text-muted-foreground">
                    Fill the grid with numbers so that every row, column, and 3x3 box contains all digits from 1 to 9.
                </p>
            </section>

            {/* Rules Section */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold">The Rules</h3>

                {/* Row Animation */}
                <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-muted/20 rounded-lg">
                    <div className="w-32 h-32 shrink-0 grid grid-cols-9 gap-px bg-border border-2 border-border">
                        {[...Array(81)].map((_, i) => {
                            const row = Math.floor(i / 9)
                            const isTargetRow = row === 4
                            return (
                                <motion.div
                                    key={i}
                                    className="bg-background w-full h-full"
                                    animate={isTargetRow ? { backgroundColor: ["hsl(var(--background))", "hsl(var(--primary)/0.4)", "hsl(var(--background))"] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )
                        })}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">1. Rows</h4>
                        <p className="text-xs text-muted-foreground">Every row must contain the numbers 1 through 9, without repeating any.</p>
                    </div>
                </div>

                {/* Column Animation */}
                <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-muted/20 rounded-lg">
                    <div className="w-32 h-32 shrink-0 grid grid-cols-9 gap-px bg-border border-2 border-border">
                        {[...Array(81)].map((_, i) => {
                            const col = i % 9
                            const isTargetCol = 4
                            return (
                                <motion.div
                                    key={i}
                                    className="bg-background w-full h-full"
                                    animate={col === isTargetCol ? { backgroundColor: ["hsl(var(--background))", "hsl(var(--primary)/0.4)", "hsl(var(--background))"] } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                />
                            )
                        })}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">2. Columns</h4>
                        <p className="text-xs text-muted-foreground">Every column must contain the numbers 1 through 9, without repeating any.</p>
                    </div>
                </div>

                {/* Box Animation */}
                <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-muted/20 rounded-lg">
                    <div className="w-32 h-32 shrink-0 grid grid-cols-9 gap-px bg-border border-2 border-border relative">
                        {/* Box Borders */}
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-foreground/20" />
                            ))}
                        </div>
                        {[...Array(81)].map((_, i) => {
                            const row = Math.floor(i / 9)
                            const col = i % 9
                            const isTargetBox = row >= 3 && row <= 5 && col >= 3 && col <= 5
                            return (
                                <motion.div
                                    key={i}
                                    className="bg-background w-full h-full"
                                    animate={isTargetBox ? { backgroundColor: ["hsl(var(--background))", "hsl(var(--primary)/0.4)", "hsl(var(--background))"] } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />
                            )
                        })}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">3. 3x3 Boxes</h4>
                        <p className="text-xs text-muted-foreground">Each of the nine 3x3 boxes must also contain the numbers 1 through 9, without repeating any.</p>
                    </div>
                </div>
            </section>

            {/* Controls Section */}
            <section className="space-y-2">
                <h3 className="text-lg font-bold">Controls</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li><strong>Select a cell:</strong> Click or tap on any cell on the board.</li>
                    <li><strong>Enter a number:</strong> Use the number pad or your keyboard (1-9).</li>
                    <li><strong>Remove a number:</strong> Press Backspace, Delete, or the &quot;Clear&quot; button.</li>
                    <li><strong>Notes mode:</strong> Toggle &quot;Note&quot; to add pencil marks for possible numbers.</li>
                    <li><strong>Undo:</strong> Press Ctrl/Cmd + Z or use the &quot;Undo&quot; button.</li>
                </ul>
            </section>

            {/* History Section */}
            <section className="space-y-2 pt-4 border-t">
                <h3 className="text-lg font-bold">History</h3>
                <p className="text-xs text-muted-foreground">
                    The modern Sudoku was most likely designed anonymously by Howard Garns, a 74-year-old retired architect and freelance puzzle constructor from Connersville, Indiana, and first published in 1979 by Dell Magazines as Number Place. The puzzle was introduced in Japan by Nikoli in the paper Monthly Nikolist in April 1984 as &quot;Sūji wa dokushin ni kagiru&quot; (Numbers must be single), which also can be abbreviated as &quot;Sudoku&quot;.
                </p>
            </section>
        </div>
    )
}

export function MemoryGuide() {
    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-2 p-2 bg-muted/20 rounded-lg w-32 h-32">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <motion.div
                            key={i}
                            className="rounded bg-primary"
                            animate={{
                                opacity: [0.2, 1, 0.2],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                times: [0, 0.2, 1]
                            }}
                        />
                    ))}
                </div>
            </div>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Watch the pattern of flashing tiles carefully.</li>
                <li>Repeat the pattern by clicking the tiles in the same order.</li>
                <li>The pattern gets longer and faster with each round.</li>
            </ul>
        </div>
    )
}

export function ConundraGuide() {
    return (
        <div className="space-y-4">
            <div className="flex justify-center items-center gap-4 py-4">
                <motion.div
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xl border border-primary/20"
                    animate={{ x: [0, 20, 0], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    6
                </motion.div>
                <motion.div
                    className="text-xl font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    ×
                </motion.div>
                <motion.div
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xl border border-primary/20"
                    animate={{ x: [0, -20, 0], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    7
                </motion.div>
                <div className="text-xl font-bold">=</div>
                <motion.div
                    className="w-16 h-12 rounded-lg bg-primary flex items-center justify-center font-bold text-xl text-primary-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
                >
                    42
                </motion.div>
            </div>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Combine the given numbers using basic arithmetic (+, -, ×, ÷).</li>
                <li>Reach the exact target number to win.</li>
                <li>You can use each number only once, but you don't have to use all of them.</li>
            </ul>
        </div>
    )
}
