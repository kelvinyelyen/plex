"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSplitDecision, GameMode } from "./use-split-decision"
import { cn } from "@/lib/utils"
import { Activity, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { GameStartScreen } from "@/components/game/start-screen"
import { SplitCompletionDialog } from "./components/completion-dialog"

export function SplitDecisionGame() {
    const { gameState, stats, timeLeft, currentItem, mode, startGame, resetGame, handleAction, config, feedback } = useSplitDecision()
    const [hasSelectedMode, setHasSelectedMode] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setHasSelectedMode(false)
        router.replace(pathname)
        resetGame()
    }

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
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Split Decision"
                    description="Rapid sorting challenge. 30 seconds to sort items. Accuracy is key - errors reduce your score."
                    onStart={() => {
                        setHasSelectedMode(true)
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>Sort the item in the center.</p>
                        <p><span className="text-foreground font-bold">Left Arrow</span> for {config?.leftLabel || "Left Rule"}.</p>
                        <p><span className="text-foreground font-bold">Right Arrow</span> for {config?.rightLabel || "Right Rule"}.</p>
                        <p>Be quick! Items expire if you hesitate.</p>
                    </div>}
                    icon={<Activity className="w-16 h-16 text-primary" />}
                />
            </div>
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
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
                    <h2 className="text-2xl font-mono font-bold uppercase tracking-tight">Select Protocol</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                        {modes.map((m) => (
                            <div
                                key={m.id}
                                onClick={() => startGame(m.id)}
                                className="group cursor-pointer border border-border/50 hover:border-primary/50 bg-card p-6 flex flex-col items-center justify-center transition-all hover:scale-[1.02] rounded-none"
                            >
                                <span className="text-lg font-mono font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{m.label}</span>
                                <span className="text-xs text-muted-foreground mt-2">{m.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8 h-[80vh]">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Split Decision</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
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
                    <span className={cn("text-sm font-mono tabular-nums", timeLeft < 10 && "text-red-500 animate-pulse")}>
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


                {/* Central Item Area */}
                <div className="relative z-10 flex flex-1 items-center justify-center w-full min-h-[300px]">
                    <AnimatePresence mode="popLayout">
                        {currentItem && (
                            <motion.div
                                key={currentItem.id}
                                initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                exit={{
                                    x: feedback === "correct" ? -200 : feedback === "incorrect" ? 200 : 0,
                                    opacity: 0,
                                    scale: 0.5,
                                    filter: "blur(10px)",
                                    rotate: feedback === "correct" ? -15 : feedback === "incorrect" ? 15 : 0
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(e, { offset }) => {
                                    const swipe = offset.x
                                    if (swipe < -100) handleAction("left")
                                    else if (swipe > 100) handleAction("right")
                                }}
                                className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                            >
                                <span className="font-mono text-[10rem] md:text-[14rem] font-bold select-none text-foreground leading-none tracking-tighter drop-shadow-2xl">{currentItem.value}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Rules Footer */}
                <div className="w-full flex justify-between px-8 md:px-24 pb-8 md:pb-16 pointer-events-none">
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Swipe Left</span>
                        <span className="text-xl md:text-2xl font-mono font-bold uppercase tracking-widest text-primary">{config.leftLabel}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Swipe Right</span>
                        <span className="text-xl md:text-2xl font-mono font-bold uppercase tracking-widest text-primary">{config.rightLabel}</span>
                    </div>
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
                score={stats.correct} // Assuming score is correct answers
                mistakes={stats.incorrect} // Assuming mistakes is incorrect answers
                onPlayAgain={() => {
                    // Assuming setGameState and handleQuit are available from useSplitDecision or context
                    // This change implies a different state management or prop structure for CompletionDialog
                    // For now, we'll use the existing resetGame and setHasSelectedMode to approximate the intent
                    resetGame();
                    setHasSelectedMode(true);
                }}
                onClose={() => {
                    resetGame(); // Reset game and go back to menu
                    setHasSelectedMode(true);
                }}
                onQuit={handleQuit} // Assuming handleQuit is defined in the component or hook
            />
        </div>
    )
}
