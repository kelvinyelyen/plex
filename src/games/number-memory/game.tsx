"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Hash, RotateCcw, Home, Skull, ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function NumberMemoryGame() {
    const [gameState, setGameState] = useState<"MENU" | "SHOWING" | "INPUT" | "RESULT" | "GAME_OVER">("MENU")
    const [level, setLevel] = useState(1)
    const [currentNumber, setCurrentNumber] = useState("")
    const [userInput, setUserInput] = useState("")
    const [score, setScore] = useState(0)

    // Progress bar for showing time
    const [timeLeft, setTimeLeft] = useState(0)

    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = () => {
        setLevel(1)
        setScore(0)
        startLevel(1)
    }

    const startLevel = (lvl: number) => {
        setGameState("SHOWING")
        setUserInput("")

        // Generate number with length = lvl
        let num = ""
        for (let i = 0; i < lvl; i++) {
            num += Math.floor(Math.random() * 10).toString()
        }
        setCurrentNumber(num)

        // Show time depends on length? Let's say 2s + 0.5s per digit?
        // Or fixed time? 
        // Standard is usually a fixed time roughly proportional to length. 
        // Let's do 1000ms + 500ms * length
        const showTime = 1000 + (lvl * 600)

        setTimeLeft(100)

        // Animate progress bar?
        // Or just setTimeout. framer motion layoutId is cool but let's use simple timeout for logic.

        setTimeout(() => {
            setGameState("INPUT")
            // Focus input next tick
            setTimeout(() => inputRef.current?.focus(), 50)
        }, showTime)
    }

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()

        if (userInput === currentNumber) {
            // Correct
            setScore(prev => prev + (level * 10))
            setGameState("RESULT")
            setTimeout(() => {
                setLevel(prev => {
                    const next = prev + 1
                    startLevel(next)
                    return next
                })
            }, 1000)
        } else {
            setGameState("GAME_OVER")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit()
        }
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Number Memory"
                    description="Digit Span. Memorize the number, then type it back."
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>A number will appear.</p>
                        <p>Memorize it before it disappears.</p>
                        <p>Type the number and press Enter.</p>
                        <p>It gets longer each level.</p>
                    </div>}
                    icon={<Hash className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Number Memory</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Level</span>
                    <span className="text-2xl font-mono font-bold">{level}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {score}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[300px]">
                <AnimatePresence mode="wait">
                    {gameState === "SHOWING" && (
                        <motion.div
                            key="showing"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <h2 className="text-6xl md:text-8xl font-black font-mono tracking-widest text-primary">
                                {currentNumber}
                            </h2>
                            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: (1000 + level * 600) / 1000, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {gameState === "INPUT" && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-sm flex flex-col items-center gap-4"
                        >
                            <span className="text-sm text-muted-foreground font-mono uppercase tracking-widest">What was the number?</span>
                            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                                <Input
                                    ref={inputRef}
                                    value={userInput}
                                    onChange={(e) => {
                                        // Only numbers
                                        if (/^\d*$/.test(e.target.value)) {
                                            setUserInput(e.target.value)
                                        }
                                    }}
                                    className="text-center text-4xl font-mono font-bold h-20 tracking-widest"
                                    autoFocus
                                    autoComplete="off"
                                />
                                <Button size="lg" className="w-full h-12 uppercase tracking-widest font-bold">
                                    Submit <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {gameState === "RESULT" && (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="p-4 rounded-full bg-primary/20 text-primary">
                                <RotateCcw className="w-12 h-12 animate-spin-slow" />
                                {/* Using checkmark icon might be better, but just transitioning */}
                            </div>
                            <h2 className="text-2xl font-bold font-mono text-primary uppercase tracking-widest">Correct</h2>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Game Over */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                            <Skull className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Number Forgotten</DialogTitle>
                            <DialogDescription className="font-mono">
                                <span className="block mb-2">You typed: <span className="text-destructive line-through">{userInput}</span></span>
                                <span className="block">Correct: <span className="text-primary">{currentNumber}</span></span>
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/20 space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Final Score</span>
                        <div className="text-6xl font-bold font-mono text-primary tracking-tighter">
                            {score}
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Reached Level {level}</span>
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
