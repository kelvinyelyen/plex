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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto relative">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="mb-12 text-center space-y-2">
                <div className="font-mono text-xs text-muted-foreground tracking-[0.2em] uppercase">Protocol: Visual_Recall</div>
                <h1 className="text-5xl md:text-6xl font-display italic font-bold">Memory Grid</h1>
            </div>

            <GameInfo level={level} lives={lives} />

            <div className="relative w-full flex justify-center min-h-[400px] items-center">
                {phase === "IDLE" ? (
                    <div className="flex flex-col items-center gap-8 p-12 bg-background/50 backdrop-blur-sm rounded-xl border border-foreground/10 text-center max-w-md w-full">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-display font-bold">System Ready</h2>
                            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                                Initialize visual pattern retention sequence.
                                <br />
                                Observe. Memorize. Replicate.
                            </p>
                        </div>
                        <Button size="lg" onClick={startGame} className="w-full font-mono uppercase tracking-widest text-xs h-12">
                            Initialize Sequence
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

            <div className="mt-12 h-8 flex items-center justify-center">
                <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    {phase === "SHOWING" && <span className="animate-pulse text-primary">&gt;&gt; RECORDING PATTERN...</span>}
                    {phase === "INPUT" && <span className="text-foreground">&gt;&gt; AWAITING INPUT...</span>}
                    {phase === "VICTORY" && <span className="text-green-500">&gt;&gt; SEQUENCE VERIFIED</span>}
                    {phase === "GAME_OVER" && <span className="text-red-500">&gt;&gt; CRITICAL FAILURE</span>}
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
