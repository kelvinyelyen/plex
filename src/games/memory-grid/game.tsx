"use client"

import { useMemoryGame } from "./use-memory-game"
import { Grid } from "./components/grid"
import { GameInfo } from "./components/game-info"
import { GameOverDialog } from "./components/game-over-dialog"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function MemoryGame() {
    const { gameState, startGame, handleCellClick } = useMemoryGame()
    const { level, lives, gridSize, sequence, playerInput, phase } = gameState

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 font-serif">Memory Grid</h1>

            <GameInfo level={level} lives={lives} />

            <div className="relative w-full flex justify-center">
                {phase === "IDLE" ? (
                    <div className="flex flex-col items-center gap-6 p-12 bg-card rounded-xl shadow-lg border text-center">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Ready to play?</h2>
                            <p className="text-muted-foreground max-w-xs">
                                Memorize the pattern of lit cells, then repeat it. The grid gets larger and faster as you progress!
                            </p>
                        </div>
                        <Button size="lg" onClick={startGame} className="gap-2 text-lg px-8">
                            <Play className="w-5 h-5" />
                            Start Game
                        </Button>
                    </div>
                ) : (
                    <Grid
                        gridSize={gridSize}
                        sequence={sequence}
                        playerInput={playerInput}
                        phase={phase}
                        onCellClick={handleCellClick}
                    />
                )}
            </div>

            <div className="mt-8 text-sm text-muted-foreground text-center h-6">
                {phase === "SHOWING" && "Watch the pattern..."}
                {phase === "INPUT" && "Repeat the pattern!"}
                {phase === "VICTORY" && "Level Complete!"}
            </div>

            <GameOverDialog
                open={phase === "GAME_OVER"}
                level={level}
                onRestart={startGame}
            />
        </div>
    )
}
