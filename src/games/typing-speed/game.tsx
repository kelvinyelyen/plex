"use client"

import { useState, useEffect, Suspense } from "react"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Keyboard, Home, ArrowLeft, RefreshCcw, Users } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { MultiplayerTypingGame } from "./multiplayer"

const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "Adjusting to the new normal requires flexibility and resilience in the face of constant change.",
    "Cognitive processing speed is a key indicator of overall mental acuity and executive function.",
    "Technological advancement accelerates at an exponential rate creating new paradigms in every sector.",
    "Precision and accuracy are paramount when executing complex maneuvers under high pressure conditions.",
    "The intricate dance of neural pathways determines our ability to learn and adapt to novel stimuli."
]

export function TypingSpeedGame() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TypingSpeedGameContent />
        </Suspense>
    )
}

function TypingSpeedGameContent() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [wpm, setWpm] = useState(0)
    const [accuracy, setAccuracy] = useState(100)
    const [currentText, setCurrentText] = useState("")
    const [inputText, setInputText] = useState("")
    const [startTime, setStartTime] = useState(0)
    const [errors, setErrors] = useState(0)

    // Split text into characters for rendering
    const [parsedText, setParsedText] = useState<string[]>([])

    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const startGame = () => {
        const text = SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
        setCurrentText(text)
        setParsedText(text.split(""))
        setInputText("")
        setScore(0) // Reset WPM
        setErrors(0)
        setStartTime(0)
        setGameState("PLAYING")
    }

    // Calculate Stats
    useEffect(() => {
        if (gameState === "PLAYING" && startTime > 0) {
            const interval = setInterval(() => {
                const elapsedMin = (Date.now() - startTime) / 60000
                const words = inputText.length / 5
                const currentWpm = Math.round(words / elapsedMin)
                setWpm(currentWpm || 0)

                // Accuracy
                // naive accuracy: (total chars - errors) / total chars
                // or (correct chars) / (total typed)
                // Let's use standard: (TotalChars - Errors) / TotalChars * 100
                // We track "errors" as uncorrected mistakes? Or just raw mismatches?
                // Let's rely on simple comparison
                // Actually tracking "errors" as they happen is better.
                const acc = Math.max(0, Math.round(((inputText.length - errors) / (inputText.length || 1)) * 100))
                setAccuracy(acc)
            }, 500)
            return () => clearInterval(interval)
        }
    }, [gameState, startTime, inputText, errors])

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState !== "PLAYING") return

        // Prevent default for some keys if needed, but usually we want to allow browser shortcuts (refresh etc).
        // Except maybe Backspace if we want to block it? (Hardcore mode). Standard allows backspace.

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (startTime === 0) setStartTime(Date.now())

            const nextChar = e.key
            const targetChar = currentText[inputText.length]

            if (nextChar !== targetChar) {
                setErrors(prev => prev + 1)
            }

            const newInput = inputText + nextChar
            setInputText(newInput)

            if (newInput === currentText) {
                // Done
                setGameState("GAME_OVER")
            }
        } else if (e.key === "Backspace") {
            setInputText(prev => prev.slice(0, -1))
        }
    }

    // Attach listener
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    })

    const setScore = (val: number) => setWpm(val) // alias for consistency

    const searchParams = useSearchParams()
    const mode = searchParams.get("mode")

    if (mode === "multiplayer") {
        return <MultiplayerTypingGame onBack={() => router.replace(pathname)} />
    }

    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center gap-4">
                <GameStartScreen
                    title="Typing Speed"
                    description="Clerical Speed. Type the text as fast as possible. Efficiency is key."
                    onStart={() => {
                        startGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>A sentence will appear.</p>
                        <p>Type it exactly as shown.</p>
                        <p>Timer starts on first keypress.</p>
                    </div>}
                    icon={<Keyboard className="w-16 h-16 text-primary" />}
                >
                    <Button variant="outline" className="gap-2 w-full sm:w-auto font-mono uppercase text-xs tracking-wider h-12 px-8 rounded-none border-border" onClick={() => router.push(`${pathname}?mode=multiplayer`)}>
                        <Users className="w-4 h-4" />
                        Multiplayer Beta
                    </Button>
                </GameStartScreen>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-3xl mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Typing Speed</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full grid grid-cols-2 border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Accuracy</span>
                    <span className="text-2xl font-mono font-bold tabular-nums text-primary">{accuracy}%</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">WPM</span>
                    <span className="text-2xl font-mono font-bold tabular-nums">
                        {wpm}
                    </span>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 min-h-[300px]">
                <div className="relative w-full p-8 text-2xl md:text-4xl font-mono leading-relaxed tracking-wide bg-muted/10 rounded-xl border border-border/50 shadow-sm break-words whitespace-pre-wrap">
                    {parsedText.map((char, index) => {
                        let status = "pending" // pending, correct, incorrect, current
                        if (index < inputText.length) {
                            status = inputText[index] === char ? "correct" : "incorrect"
                        } else if (index === inputText.length) {
                            status = "current"
                        }

                        return (
                            <span
                                key={index}
                                className={cn(
                                    "transition-colors duration-75",
                                    status === "correct" && "text-primary",
                                    status === "incorrect" && "text-destructive bg-destructive/10 underline decoration-2 decoration-destructive",
                                    status === "current" && "bg-foreground/20 text-foreground animate-pulse rounded-sm",
                                    status === "pending" && "text-muted-foreground/50"
                                )}
                            >
                                {char}
                            </span>
                        )
                    })}
                </div>

                <div className="text-sm text-muted-foreground uppercase tracking-widest animate-pulse">
                    {startTime === 0 ? "Start typing..." : "Go!"}
                </div>
            </div>

            {/* Result */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Keyboard className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Typing Validated</DialogTitle>
                            <DialogDescription>
                                Input speed analysis complete.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/20 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">WPM</span>
                            <div className="text-4xl font-bold font-mono text-foreground tracking-tighter">
                                {wpm}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/20 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Accuracy</span>
                            <div className="text-4xl font-bold font-mono text-foreground tracking-tighter">
                                {accuracy}%
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button variant="outline" size="lg" onClick={() => setGameState("MENU")} className="w-full gap-2 rounded-none">
                            <Home className="w-4 h-4" />
                            Menu
                        </Button>
                        <Button size="lg" onClick={startGame} className="w-full gap-2 rounded-none">
                            <RefreshCcw className="w-4 h-4" />
                            Next Text
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
