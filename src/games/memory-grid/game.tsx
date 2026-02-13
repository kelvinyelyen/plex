"use client"

import { useState } from "react"
import { GameStartScreen } from "@/components/game/start-screen"
import { MemoryGuide } from "@/components/game/game-guides"
import { MemoryAnimation } from "@/components/ui/game-animations"
import { useMemoryGame } from "./use-memory-game"
import { Grid } from "./components/grid"
import { GameOverDialog } from "./components/game-over-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function MemoryGame() {
    const { gameState, startGame, handleCellClick, resetToIdle } = useMemoryGame()
    const { level, lives, gridSize, sequence, playerInput, phase } = gameState

    const [hasStarted, setHasStarted] = useState(false)

    if (!hasStarted) {
        return (
            <GameStartScreen
                title="Memory Grid"
                description="Watch the pattern of flashing tiles and repeat it. The sequence gets longer and faster with each round."
                onStart={() => {
                    setHasStarted(true)
                    startGame()
                }}
                instructions={<MemoryGuide />}
                icon={<MemoryAnimation />}
            />
        )
    }

    return (
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-full flex items-center justify-between mb-6">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Memory Grid</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={() => setHasStarted(false)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Minimal Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50 mb-12">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Level</span>
                    <span className="text-2xl font-mono font-bold">{level}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Lives</span>
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-none transition-all ${i < lives ? "bg-primary" : "bg-muted"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative w-full flex justify-center min-h-[400px] items-center">
                <Grid
                    gridSize={gridSize}
                    sequence={sequence}
                    playerInput={playerInput}
                    phase={phase}
                    onCellClick={handleCellClick}
                />
            </div>

            <div className="mt-12 h-8 flex items-center justify-center">
                <div className="text-sm tracking-widest font-mono uppercase">
                    {phase === "SHOWING" && <span className="text-primary animate-pulse">Watching Pattern...</span>}
                    {phase === "INPUT" && <span className="text-foreground">Your Turn</span>}
                    {phase === "VICTORY" && <span className="text-green-500">Correct!</span>}
                    {phase === "GAME_OVER" && <span className="text-destructive">Game Over</span>}
                </div>
            </div>

            <GameOverDialog
                open={phase === "GAME_OVER"}
                level={level}
                onRestart={startGame}
                onClose={resetToIdle}
                onQuit={() => setHasStarted(false)}
            />
        </div>
    )
}
