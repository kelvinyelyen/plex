"use client"

import { useState } from "react"
import { GameStartScreen } from "@/components/game/start-screen"
import { MemoryGuide } from "@/components/game/game-guides"
import { MemoryAnimation } from "@/components/ui/game-animations"
import { useMemoryGame } from "./use-memory-game"
import { Grid } from "./components/grid"
import { GameInfo } from "./components/game-info"
import { GameOverDialog } from "./components/game-over-dialog"

export function MemoryGame() {
    const { gameState, startGame, handleCellClick } = useMemoryGame()
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
        <div className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
            <div className="mb-12 text-center space-y-2">
                <h1 className="text-4xl font-bold">Memory Grid</h1>
            </div>

            <GameInfo level={level} lives={lives} />

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
                <div className="text-xs tracking-widest text-muted-foreground uppercase">
                    {phase === "SHOWING" && <span className="text-primary">Watching...</span>}
                    {phase === "INPUT" && <span className="text-foreground">Your Turn</span>}
                    {phase === "VICTORY" && <span className="text-green-500">Correct!</span>}
                    {phase === "GAME_OVER" && <span className="text-destructive">Game Over</span>}
                </div>
            </div>

            <GameOverDialog
                open={phase === "GAME_OVER"}
                level={level}
                onRestart={startGame}
            />
        </div>
    )
}
