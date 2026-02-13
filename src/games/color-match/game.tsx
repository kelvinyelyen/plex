"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Palette, RotateCcw, Home, Skull, ArrowLeft, Check, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

const COLORS = [
    { name: "RED", value: "text-red-500", hex: "#ef4444" },
    { name: "BLUE", value: "text-blue-500", hex: "#3b82f6" },
    { name: "GREEN", value: "text-green-500", hex: "#22c55e" },
    { name: "YELLOW", value: "text-yellow-500", hex: "#eab308" },
    { name: "PURPLE", value: "text-purple-500", hex: "#a855f7" },
    { name: "ORANGE", value: "text-orange-500", hex: "#f97316" }, // Added orange
    { name: "BLACK", value: "text-foreground", hex: "#000000" }, // depends on theme
]

export function ColorMatchGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10) // Initial time, maybe refill per correct answer?
    const [currentQuestion, setCurrentQuestion] = useState<{ text: string, color: string, match: boolean, colorClass: string }>({ text: "", color: "", match: false, colorClass: "" })

    // For "Stroop": does the TEXT meaning match the TEXT COLOR?
    // Actually, usually it's "Does the meaning of the word on top match the color of the word on bottom?" 
    // OR "Does the Text match the Color?"
    // Let's go with: Display a word (e.g. "RED") colored in Blue. 
    // Question: Does the meaning match the color? (No)

    // Variant 2 (Common in apps): 
    // Text: "RED" (colored Blue)
    // Text 2: "meaning" 
    // Usually it's: 
    // Top text: "RED" (in black)
    // Bottom text: "BLUE" (in Red)
    // Question: Does the top meaning match the bottom color?

    // Let's do the simple one first: 
    // Word appears. Is the Meaning === Ink Color?

    const router = useRouter()
    const pathname = usePathname()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = () => {
        setScore(0)
        setTimeLeft(60) // 60 seconds survival or time attack
        setGameState("PLAYING")
        nextQuestion()
    }

    const nextQuestion = () => {
        // 50% chance of match
        const isMatch = Math.random() > 0.5

        const meaningIndex = Math.floor(Math.random() * COLORS.length)
        const meaning = COLORS[meaningIndex]

        let colorIndex = meaningIndex
        if (!isMatch) {
            // Pick a different color
            do {
                colorIndex = Math.floor(Math.random() * COLORS.length)
            } while (colorIndex === meaningIndex)
        }

        const color = COLORS[colorIndex]

        setCurrentQuestion({
            text: meaning.name,
            color: color.hex, // hex for inline style or use class? let's use class
            colorClass: color.value,
            match: isMatch
        })
    }

    useEffect(() => {
        if (gameState === "PLAYING") {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState("GAME_OVER")
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [gameState])

    const handleAnswer = (answer: boolean) => {
        if (gameState !== "PLAYING") return

        if (answer === currentQuestion.match) {
            // Correct
            setScore(prev => prev + 150)
            // Add slight time bonus?
            // setTimeLeft(prev => Math.min(prev + 1, 60)) 
            nextQuestion()
        } else {
            // Wrong
            // Penalty? Game Over? standard stroop is time limit with score.
            // Let's do time penalty
            setTimeLeft(prev => Math.max(0, prev - 2))
            // Or immediate fail? 
            // "Lumonisty" style often ends on 3 strikes or time.
            // Let's just do score penalty and shake effect maybe (not implemented yet).
            setScore(prev => Math.max(0, prev - 50))
            nextQuestion()
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState !== "PLAYING") return
        if (e.key === "ArrowLeft") handleAnswer(true) // Yes
        if (e.key === "ArrowRight") handleAnswer(false) // No
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    })

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Color Match"
                    description="Stroop Test. Flexibility & Attention. Does the meaning match the ink color?"
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>A word will appear.</p>
                        <p>If the <span className="font-bold">MEANING</span> matches the <span className="font-bold">COLOR</span>, press <span className="font-bold text-primary">YES</span>.</p>
                        <p>Otherwise, press <span className="font-bold text-destructive">NO</span>.</p>
                        <p>Arrow keys: Left (Yes), Right (No).</p>
                    </div>}
                    icon={<Palette className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Color Match</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
                    <span className={cn("text-2xl font-mono font-bold tabular-nums", timeLeft <= 10 && "text-destructive animate-pulse")}>
                        {timeLeft}s
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {score}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center gap-12 min-h-[300px]">
                <div className="relative flex flex-col items-center justify-center">
                    <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-8">Does it match?</span>

                    <AnimatePresence mode="popLayout">
                        <motion.h1
                            key={currentQuestion.text + currentQuestion.colorClass + score} // change key to force re-render/anim
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className={cn("text-7xl md:text-8xl font-black tracking-tighter uppercase", currentQuestion.colorClass)}
                        >
                            {currentQuestion.text}
                        </motion.h1>
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-24 text-2xl font-black uppercase tracking-widest border-2 hover:bg-primary/10 hover:border-primary"
                        onClick={() => handleAnswer(true)}
                    >
                        <Check className="w-8 h-8 mr-2" /> Yes
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-24 text-2xl font-black uppercase tracking-widest border-2 hover:bg-destructive/10 hover:border-destructive"
                        onClick={() => handleAnswer(false)}
                    >
                        <X className="w-8 h-8 mr-2" /> No
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground font-mono">
                    Press Left Arrow (YES) / Right Arrow (NO)
                </div>
            </div>

            {/* Game Over */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Palette className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Time's Up</DialogTitle>
                            <DialogDescription>
                                Cognitive flexibility assessment complete.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/20 space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Final Score</span>
                        <div className="text-6xl font-bold font-mono text-primary tracking-tighter">
                            {score}
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" size="lg" onClick={() => setGameState("MENU")} className="w-full gap-2 rounded-none">
                            <Home className="w-4 h-4" />
                            Menu
                        </Button>
                        <Button size="lg" onClick={startGame} className="w-full gap-2 rounded-none">
                            <RotateCcw className="w-4 h-4" />
                            Retry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
