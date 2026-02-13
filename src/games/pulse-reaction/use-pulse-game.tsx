import { useState, useRef, useCallback, useEffect } from "react"

export type GamePhase = "IDLE" | "WAITING" | "PULSING" | "RESULT" | "COMPLETE"

interface GameState {
    phase: GamePhase
    round: number
    totalRounds: number
    scores: number[] // deviations in ms
    averageScore: number | null
}

const TOTAL_ROUNDS = 5
const PULSE_DURATION = 2000 // Total duration of pulse cycle
const PEAK_TIME = 1000 // Peak happens at middle of cycle (0 -> 1 -> 0)

export function usePulseGame() {
    const [gameState, setGameState] = useState<GameState>({
        phase: "IDLE",
        round: 1,
        totalRounds: TOTAL_ROUNDS,
        scores: [],
        averageScore: null
    })

    const pulseStartTimeRef = useRef<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const animationFrameRef = useRef<number | null>(null)


    // Reset game to initial state
    const resetGame = useCallback(() => {
        setGameState({
            phase: "IDLE",
            round: 1,
            totalRounds: TOTAL_ROUNDS,
            scores: [],
            averageScore: null
        })
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }, [])

    // Use a ref for handleTap to break circular dependency
    const handleTapRef = useRef<(autoFail?: boolean) => void>(() => { })

    // Start a new round - fixed version using ref
    const startRoundFixed = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        setGameState(prev => ({
            ...prev,
            phase: "WAITING"
        }))

        // Random delay before pulse starts (2-5 seconds)
        const delay = Math.random() * 3000 + 2000

        timeoutRef.current = setTimeout(() => {
            setGameState(prev => ({ ...prev, phase: "PULSING" }))
            pulseStartTimeRef.current = Date.now()

            // Auto-fail if no tap within reasonable time
            timeoutRef.current = setTimeout(() => {
                handleTapRef.current(true) // Use ref to avoid dependency
            }, PULSE_DURATION + 500)

        }, delay)
    }, [])

    // Re-implement handleTap to call startRoundFixed
    const handleTapFixed = useCallback((autoFail = false) => {
        if (gameState.phase !== "PULSING") return

        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        const tapTime = Date.now()
        const elapsed = tapTime - pulseStartTimeRef.current
        let deviation = Math.abs(elapsed - PEAK_TIME)

        if (autoFail) deviation = 1000

        const newScores = [...gameState.scores, deviation]
        const isGameComplete = gameState.round >= TOTAL_ROUNDS

        if (isGameComplete) {
            const avg = Math.floor(newScores.reduce((a, b) => a + b, 0) / TOTAL_ROUNDS)
            setGameState(prev => ({
                ...prev,
                scores: newScores,
                averageScore: avg,
                phase: "COMPLETE"
            }))
            fetch("/api/games/pulse-reaction/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score: avg }),
            }).catch(console.error)
        } else {
            setGameState(prev => ({
                ...prev,
                scores: newScores,
                phase: "RESULT"
            }))

            timeoutRef.current = setTimeout(() => {
                setGameState(prev => ({
                    ...prev,
                    round: prev.round + 1
                }))
                startRoundFixed()
            }, 2000)
        }
    }, [gameState.phase, gameState.round, gameState.scores, startRoundFixed])

    const startGame = useCallback(() => {
        setGameState({
            phase: "IDLE",
            round: 1,
            totalRounds: TOTAL_ROUNDS,
            scores: [],
            averageScore: null
        })
        startRoundFixed()
    }, [startRoundFixed])

    // Update the ref again
    useEffect(() => { handleTapRef.current = handleTapFixed }, [handleTapFixed])

    // Cleanup
    // Cleanup
    useEffect(() => {
        const frameId = animationFrameRef.current
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            if (frameId) cancelAnimationFrame(frameId)
        }
    }, [])

    return {
        gameState,
        startGame,
        resetGame,
        handleTap: handleTapFixed
    }
}
