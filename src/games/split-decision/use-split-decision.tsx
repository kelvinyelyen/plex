import { useState, useRef, useCallback, useEffect } from "react"

export type GameState = "MENU" | "PLAYING" | "GAME_OVER"

export type GameMode = "standard" | "comparison" | "divisibility" | "pattern" | "advanced"

export interface GameStats {
    correct: number
    incorrect: number
    missed: number
}

interface ModeConfig {
    name: string
    leftLabel: string
    rightLabel: string
    checkLeft: (n: number) => boolean
    checkRight: (n: number) => boolean
    generator: () => number
}

// Helpers
const isPrime = (num: number) => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
}

const MODES: Record<GameMode, ModeConfig> = {
    standard: {
        name: "Standard",
        leftLabel: "Even",
        rightLabel: "Odd",
        checkLeft: (n) => n % 2 === 0,
        checkRight: (n) => n % 2 !== 0,
        generator: () => Math.floor(Math.random() * 99) + 1
    },
    comparison: {
        name: "Comparison",
        leftLabel: "< 50",
        rightLabel: "> 50",
        checkLeft: (n) => n < 50,
        checkRight: (n) => n > 50,
        generator: () => {
            let n = Math.floor(Math.random() * 99) + 1
            while (n === 50) n = Math.floor(Math.random() * 99) + 1
            return n
        }
    },
    divisibility: {
        name: "Divisibility",
        leftLabel: "Mult 5",
        rightLabel: "Other",
        checkLeft: (n) => n % 5 === 0,
        checkRight: (n) => n % 5 !== 0,
        generator: () => Math.floor(Math.random() * 99) + 1
    },
    pattern: {
        name: "Pattern",
        leftLabel: "Has 7",
        rightLabel: "No 7",
        checkLeft: (n) => n.toString().includes('7'),
        checkRight: (n) => !n.toString().includes('7'),
        generator: () => Math.floor(Math.random() * 99) + 1
    },
    advanced: {
        name: "Advanced",
        leftLabel: "Prime",
        rightLabel: "Mult 3",
        checkLeft: (n) => isPrime(n),
        checkRight: (n) => !isPrime(n) && n % 3 === 0,
        generator: () => {
            while (true) {
                const n = Math.floor(Math.random() * 99) + 2
                if (isPrime(n)) return n
                if (n % 3 === 0) return n
            }
        }
    }
}

const GAME_DURATION = 30 // 30 seconds Time Attack
const ITEM_TIMEOUT = 3000 // 3 seconds per item to act

export function useSplitDecision() {
    const [gameState, setGameState] = useState<GameState>("MENU")
    const [stats, setStats] = useState<GameStats>({ correct: 0, incorrect: 0, missed: 0 })
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
    const [mode, setMode] = useState<GameMode>("standard")
    const [currentItem, setCurrentItem] = useState<{ value: number, id: number } | null>(null)
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | "missed" | null>(null)

    // Refs
    const stateRef = useRef({ gameState, currentItem, mode, stats })
    stateRef.current = { gameState, currentItem, mode, stats }

    const requestRef = useRef<number>()
    const lastTick = useRef<number>(0)
    const itemSpawnTime = useRef<number>(0)

    const spawnItem = useCallback(() => {
        const config = MODES[stateRef.current.mode]
        const newItem = {
            value: config.generator(),
            id: Date.now() + Math.random()
        }
        setCurrentItem(newItem)
        itemSpawnTime.current = Date.now()
        setFeedback(null)
    }, [])

    const startGame = useCallback((selectedMode: GameMode) => {
        setMode(selectedMode)
        setStats({ correct: 0, incorrect: 0, missed: 0 })
        setTimeLeft(GAME_DURATION)
        setGameState("PLAYING")
        lastTick.current = Date.now()

        // Spawn first item
        // Need to do this inside the loop or immediately? 
        // Immediately is fine, logic loop will pick it up
        spawnItem()
    }, [spawnItem])

    const endGame = useCallback(() => {
        setGameState("GAME_OVER")
        const finalStats = stateRef.current.stats
        // Score = Correct - Incorrect (Prevent negative score? Or allow it to show how bad they did?)
        // User requested fairness against spamming. 200 correct - 200 incorrect = 0.
        const finalScore = Math.max(0, finalStats.correct - finalStats.incorrect)

        fetch("/api/games/split-decision/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score: finalScore, mode: stateRef.current.mode }),
        }).catch(err => console.error("Failed to submit score:", err))
    }, [])

    const resetGame = useCallback(() => {
        setGameState("MENU")
        setFeedback(null)
        setStats({ correct: 0, incorrect: 0, missed: 0 })
        setCurrentItem(null)
    }, [])

    const handleAction = useCallback((direction: "left" | "right") => {
        if (stateRef.current.gameState !== "PLAYING" || !stateRef.current.currentItem) return

        const { value } = stateRef.current.currentItem
        const config = MODES[stateRef.current.mode]
        let isCorrect = false

        if (direction === "left") isCorrect = config.checkLeft(value)
        else isCorrect = config.checkRight(value)

        setStats(prev => ({
            ...prev,
            correct: prev.correct + (isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (isCorrect ? 0 : 1)
        }))

        setFeedback(isCorrect ? "correct" : "incorrect")

        // Small delay for feedback or immediate? 
        // Immediate feels snappier.
        spawnItem()
    }, [spawnItem])

    const updateGame = useCallback(() => {
        if (stateRef.current.gameState !== "PLAYING") return

        const now = Date.now()
        const dt = now - lastTick.current

        // Update timer (approximate)
        if (dt >= 1000) {
            setTimeLeft(prev => {
                const next = prev - 1
                if (next <= 0) {
                    setTimeout(endGame, 0)
                    return 0
                }
                return next
            })
            lastTick.current = now
        }

        // Check Item Timeout
        if (stateRef.current.currentItem && (now - itemSpawnTime.current > ITEM_TIMEOUT)) {
            // Missed!
            setStats(prev => ({ ...prev, missed: prev.missed + 1 }))
            setFeedback("missed")
            spawnItem()
        }

        requestRef.current = requestAnimationFrame(updateGame)
    }, [endGame, spawnItem])

    useEffect(() => {
        if (gameState === "PLAYING") {
            lastTick.current = Date.now()
            itemSpawnTime.current = Date.now()
            requestRef.current = requestAnimationFrame(updateGame)
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [gameState, updateGame])

    return {
        gameState,
        stats,
        timeLeft,
        currentItem,
        mode,
        startGame,
        resetGame,
        handleAction,
        config: MODES[mode],
        feedback
    }
}
