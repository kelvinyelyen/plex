"use client"

import { useState } from "react"
import { GameStartScreen } from "@/components/game/start-screen"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { usePulseGame } from "./use-pulse-game"
import { cn } from "@/lib/utils"
import { PulseCompletionDialog } from "./components/completion-dialog"

export function PulseReactionGame() {
    const { gameState, startGame, resetGame, handleTap } = usePulseGame()
    const { phase, round, totalRounds, scores, averageScore } = gameState
    const [hasStarted, setHasStarted] = useState(false)

    if (!hasStarted) {
        return (
            <GameStartScreen
                title="Pulse Reaction"
                description="A test of cognitive latency. Tap exactly when the circle reaches peak brightness."
                onStart={() => {
                    setHasStarted(true)
                    startGame()
                }}
                instructions={<div className="space-y-2 text-sm text-muted-foreground p-4 bg-muted/20 rounded-none border border-border/50">
                    <p>1. Wait for the circle to pulse.</p>
                    <p>2. It will brighten and fade.</p>
                    <p>3. Tap/Click EXACTLY when it is brightest.</p>
                </div>}
                icon={<div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse" />}
            />
        )
    }

    return (
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full min-h-[60vh]">
            <div className="w-full text-left mb-6">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Pulse Reaction</span>
            </div>

            {/* Minimal Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50 mb-12">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Round</span>
                    <span className="text-2xl font-mono font-bold">{round} / {totalRounds}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Avg Dev</span>
                    <span className="text-2xl font-mono font-bold">
                        {scores.length > 0
                            ? `${Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length)} ms`
                            : "--"}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="relative w-full flex-1 flex flex-col items-center justify-center gap-12">

                {/* Result Message for previous round */}
                <div className="h-8">
                    {(phase === "RESULT" || phase === "COMPLETE") && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xl font-mono font-bold uppercase tracking-wider"
                        >
                            {phase === "COMPLETE" ? "Sequence Complete" : `Deviation: ${scores[scores.length - 1]}ms`}
                        </motion.div>
                    )}
                </div>

                {/* The Pulse Circle */}
                {phase !== "COMPLETE" && (
                    <div
                        className="relative w-64 h-64 flex items-center justify-center cursor-pointer tap-highlight-transparent"
                        onClick={() => handleTap()}
                    >
                        {/* Static Ring */}
                        <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />

                        {/* Pulse Ring */}
                        <motion.div
                            className="w-full h-full bg-primary rounded-full"
                            initial={{ opacity: 0.1, scale: 0.8 }}
                            animate={
                                phase === "PULSING"
                                    ? {
                                        opacity: [0.1, 1, 0.1],
                                        scale: [0.8, 1, 0.8]
                                    }
                                    : { opacity: 0.1, scale: 0.8 }
                            }
                            transition={
                                phase === "PULSING"
                                    ? {
                                        duration: 2,
                                        times: [0, 0.5, 1], // Peak at 1.0s (0.5 of 2s)
                                        ease: "easeInOut"
                                    }
                                    : { duration: 0.2 }
                            }
                        />

                        {/* Center Fixation */}
                        <div className="absolute w-2 h-2 bg-primary rounded-full" />
                    </div>
                )}

                <PulseCompletionDialog
                    open={phase === "COMPLETE"}
                    averageScore={averageScore || 0}
                    onPlayAgain={startGame}
                    onClose={() => { }} // Can't really close it without action
                    onQuit={() => setHasStarted(false)}
                />


                <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest min-h-[20px]">
                    {phase === "WAITING" && "Focus..."}
                    {phase === "PULSING" && "TAP AT PEAK"}
                </div>
            </div>
        </div>
    )
}
