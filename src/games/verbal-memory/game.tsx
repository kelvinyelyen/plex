"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { BookOpen, RotateCcw, Home, Skull, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Extended word list
const WORD_LIST = [
    "House", "Tree", "Car", "Apple", "Book", "Computer", "Phone", "Key", "Shoe", "Chair",
    "Table", "Mouse", "Keyboard", "Screen", "Bottle", "Water", "Light", "Dark", "Sun", "Moon",
    "Star", "Cloud", "Rain", "Snow", "Fire", "Ice", "Earth", "Wind", "Road", "River",
    "Mountain", "Ocean", "Sand", "Rock", "Paper", "Pen", "Pencil", "Eraser", "School", "Work",
    "Game", "Play", "Stop", "Go", "Fast", "Slow", "Big", "Small", "Hot", "Cold",
    "Happy", "Sad", "Angry", "Fear", "Love", "Hate", "Friend", "Enemy", "Family", "Home",
    "City", "Country", "World", "Universe", "Time", "Space", "Life", "Death", "War", "Peace",
    "Music", "Art", "Science", "Math", "History", "Language", "Code", "Data", "Web", "Net"
]

export function VerbalMemoryGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [currentWord, setCurrentWord] = useState("")
    const [seenWords, setSeenWords] = useState<Set<string>>(new Set())
    const [isSeen, setIsSeen] = useState(false) // Whether current word is actually seen

    // Game logic state
    const [roundCount, setRoundCount] = useState(0)

    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = () => {
        setScore(0)
        setLives(3)
        setSeenWords(new Set())
        setRoundCount(0)
        setGameState("PLAYING")
        nextWord(new Set())
    }

    const nextWord = (currentSeen: Set<string>) => {
        // Algorithm:
        // As game progresses, increase chance of showing a seen word (to test memory).
        // Early game: mostly new words.

        let showSeen = Math.random() > 0.6 // 40% chance of seen word

        // Force new word if no seen words yet
        if (currentSeen.size === 0) showSeen = false

        // Force seen word if we have too many seen words? 
        // nah, let's keep it random but weighted.

        let word = ""

        if (showSeen) {
            // Pick a random seen word
            const seenArray = Array.from(currentSeen)
            word = seenArray[Math.floor(Math.random() * seenArray.length)]
            setIsSeen(true)
        } else {
            // Pick a random new word
            // Naive approach: random from list until not in seen
            do {
                word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
            } while (currentSeen.has(word))
            setIsSeen(false)
        }

        setCurrentWord(word)
    }

    const handleAnswer = (userSaysSeen: boolean) => {
        if (gameState !== "PLAYING") return

        const correct = userSaysSeen === isSeen

        if (correct) {
            setScore(prev => prev + 1)

            // If it was a NEW word, add to seen list
            const newSeen = new Set(seenWords)
            if (!isSeen) {
                newSeen.add(currentWord)
                setSeenWords(newSeen)
            }

            nextWord(newSeen)
        } else {
            setLives(prev => {
                const next = prev - 1
                if (next <= 0) {
                    setGameState("GAME_OVER")
                    // Save score
                } else {
                    // Continue with next word?
                    // Usually yes.
                    // If they got it wrong, do we add it to seen? 
                    // If it was NEW and they said SEEN -> It is now SEEN mentally? 
                    // Technically it was displayed, so yes it is now seen for future?
                    // Let's assume yes, it is now in the "seen" pile because it was just shown.
                    const newSeen = new Set(seenWords)
                    newSeen.add(currentWord)
                    setSeenWords(newSeen)
                    nextWord(newSeen)
                }
                return next
            })
        }
    }

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== "PLAYING") return
            if (e.key === "ArrowLeft") handleAnswer(true) // Seen
            if (e.key === "ArrowRight") handleAnswer(false) // New
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    })

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Verbal Memory"
                    description="Word Retention. Identify if a word has appeared before."
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>Words appear one by one.</p>
                        <p>If you've seen the word in this game, click <span className="font-bold text-primary">SEEN</span>.</p>
                        <p>If it's a new word, click <span className="font-bold text-foreground">NEW</span>.</p>
                        <p>3 Strikes and you're out.</p>
                    </div>}
                    icon={<BookOpen className="w-16 h-16 text-primary" />}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-2xl mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Verbal Memory</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Lives</span>
                    <div className="flex gap-1" key={lives}> {/* key forces re-render for animation */}
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className={cn("w-3 h-3 rounded-full transition-colors", i < lives ? "bg-primary" : "bg-muted/30")} />
                        ))}
                    </div>
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
                <AnimatePresence mode="popLayout">
                    <motion.h1
                        key={currentWord + score + lives}
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -20 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter"
                    >
                        {currentWord}
                    </motion.h1>
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <Button
                        size="lg"
                        className="h-20 text-xl font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleAnswer(true)}
                    >
                        <Eye className="w-6 h-6 mr-2" /> SEEN
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        className="h-20 text-xl font-mono uppercase tracking-widest"
                        onClick={() => handleAnswer(false)}
                    >
                        <EyeOff className="w-6 h-6 mr-2" /> NEW
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground font-mono">
                    Left Arrow (SEEN) / Right Arrow (NEW)
                </div>
            </div>

            {/* Game Over */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                            <Skull className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Memory Full</DialogTitle>
                            <DialogDescription>
                                Vocabulary retention limit reached.
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
