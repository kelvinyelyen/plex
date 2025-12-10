"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSplitDecision, GameMode } from "./use-split-decision"
import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"
import { GameStartScreen } from "@/components/game/start-screen"
import { SplitCompletionDialog } from "./components/completion-dialog"

export function SplitDecisionGame() {
    const { gameState, stats, timeLeft, currentItem, mode, startGame, resetGame, handleAction, config, feedback } = useSplitDecision()
    const [hasSelectedMode, setHasSelectedMode] = useState(false)

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== "PLAYING") return
            if (e.key === "ArrowLeft") handleAction("left")
            if (e.key === "ArrowRight") handleAction("right")
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [gameState, handleAction])

    if (gameState === "MENU" && !hasSelectedMode) {
        return (
            <GameStartScreen
                title="Split Decision"
                description="Rapid sorting challenge. 30 seconds to sort items. Accuracy is key - errors reduce your score."
                onStart={() => {
                    setHasSelectedMode(true)
                }}
                instructions={<div className="space-y-2 text-sm text-muted-foreground">
                    <p>Sort the item in the center.</p>
                    <p><span className="text-foreground font-bold">Left Arrow</span> for {config?.leftLabel || "Left Rule"}.</p>
                    <p><span className="text-foreground font-bold">Right Arrow</span> for {config?.rightLabel || "Right Rule"}.</p>
                    <p>Be quick! Items expire if you hesitate.</p>
                </div>}
                icon={<Activity className="w-16 h-16 text-primary" />}
            />
        )
    }

    if (gameState === "MENU" && hasSelectedMode) {
        // Mode Selection Screen
        const modes: { id: GameMode; label: string; desc: string }[] = [
            { id: "standard", label: "Standard", desc: "Even vs Odd" },
            { id: "comparison", label: "Comparison", desc: "< 50 vs > 50" },
            { id: "divisibility", label: "Divisibility", desc: "Mult 5 vs Other" },
            { id: "pattern", label: "Pattern", desc: "Has 7 vs No 7" },
            { id: "advanced", label: "Advanced", desc: "Prime vs Mult 3" },
        ]

        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
                <h2 className="text-2xl font-mono font-bold uppercase tracking-tight">Select Protocol</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                    {modes.map((m) => (
                        <div
                            key={m.id}
                            onClick={() => startGame(m.id)}
                            className="group cursor-pointer border border-border/50 hover:border-primary/50 bg-card p-6 flex flex-col items-center justify-center transition-all hover:scale-[1.02]"
                        >
                            <span className="text-lg font-mono font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{m.label}</span>
                            <span className="text-xs text-muted-foreground mt-2">{m.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-8 h-[80vh]">
            <div className="w-full text-left">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Split Decision</span>
            </div>

            {/* Minimal Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50 z-20 bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Stats</span>
                    <div className="flex gap-4 font-mono text-sm">
                        <span className="text-green-500">✓ {stats.correct}</span>
                        <span className="text-red-500">✗ {stats.incorrect}</span>
                        <span className="text-yellow-500">Ø {stats.missed}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
                    <span className={cn("text-3xl font-mono font-bold tabular-nums", timeLeft < 10 && "text-red-500 animate-pulse")}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Mode</span>
                    <span className="font-mono font-bold text-sm uppercase">{mode}</span>
                </div>
            </div>

            <div className="relative w-full flex-1 flex flex-col items-center justify-center">
                {/* Rules Overlay Indicators (Background) */}
                {/* Minimal Side Indicators */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 md:px-24 pointer-events-none z-0">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                        <span className="text-4xl">←</span>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">{config.leftLabel}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 opacity-30">
                        <span className="text-4xl">→</span>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">{config.rightLabel}</span>
                    </div>
                </div>

                {/* Central Item Area */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                    <AnimatePresence mode="popLayout">
                        {currentItem && (
                            <motion.div
                                key={currentItem.id}
                                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{
                                    x: feedback === "correct" ? -200 : feedback === "incorrect" ? 200 : 0,
                                    opacity: 0,
                                    scale: 0.8,
                                    rotate: feedback === "correct" ? -10 : feedback === "incorrect" ? 10 : 0
                                }}
                                className="w-64 h-80 bg-card border-4 border-primary flex items-center justify-center shadow-2xl rounded-xl relative overflow-hidden"
                            >
                                <span className="font-mono text-7xl font-bold">{currentItem.value}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls overlay for touch */}
            <div className="absolute bottom-0 w-full h-1/3 flex z-30 opacity-0 pointer-events-none md:pointer-events-none">
                {/* Visual cues for touch could go here, but kept invisible for clean look */}
                <div className="w-1/2 h-full cursor-pointer pointer-events-auto" onClick={() => handleAction("left")} />
                <div className="w-1/2 h-full cursor-pointer pointer-events-auto" onClick={() => handleAction("right")} />
            </div>

            {/* Game Over Overlay */}
            {/* Game Over Dialog */}
            <SplitCompletionDialog
                open={gameState === "GAME_OVER"}
                stats={stats}
                mode={mode}
                onPlayAgain={() => startGame(mode)}
                onChangeProtocol={() => {
                    resetGame()
                    setHasSelectedMode(true)
                }}
                onClose={() => { }} // Block closing without action if desired, or allow reset
            />
        </div>
    )
}
