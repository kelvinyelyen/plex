import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"

export type GamePhase = "IDLE" | "SHOWING" | "INPUT" | "GAME_OVER" | "VICTORY"

interface GameState {
    level: number
    lives: number
    gridSize: number
    sequence: number[]
    playerInput: number[]
    phase: GamePhase
    showingIndex: number // Index of the sequence currently being shown
}

// Difficulty Scaling (Pure function, moved outside hook)
const getDifficulty = (level: number) => {
    if (level === 1) return { gridSize: 2, sequenceLength: 1, showTime: 800 }
    if (level === 2) return { gridSize: 3, sequenceLength: 2, showTime: 1200 }
    if (level === 3) return { gridSize: 4, sequenceLength: 3, showTime: 1600 }
    if (level === 4) return { gridSize: 5, sequenceLength: 5, showTime: 2400 }

    // Level 5+ (Challenge Mode)
    const baseGrid = Math.min(7, 5 + Math.floor((level - 4) / 2)) // Cap at 7x7 for now
    const totalCells = baseGrid * baseGrid
    const sequenceLength = Math.floor(totalCells * 0.4) // 40% of grid
    // More generous time for larger sequences: ~500ms per cell in sequence, capped at reasonable max
    const showTime = Math.min(5000, Math.max(2000, sequenceLength * 500))

    return { gridSize: baseGrid, sequenceLength, showTime }
}

export function useMemoryGame() {
    const [gameState, setGameState] = useState<GameState>({
        level: 1,
        lives: 5,
        gridSize: 2,
        sequence: [],
        playerInput: [],
        phase: "IDLE",
        showingIndex: -1,
    })

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const startLevel = useCallback((level: number) => {
        const { gridSize, sequenceLength } = getDifficulty(level)
        const totalCells = gridSize * gridSize

        // Generate random sequence
        const availableIndices = Array.from({ length: totalCells }, (_, i) => i)
        // Shuffle and take N
        for (let i = availableIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }
        const sequence = availableIndices.slice(0, sequenceLength)

        setGameState(prev => ({
            ...prev,
            level,
            gridSize,
            sequence,
            playerInput: [],
            phase: "SHOWING",
            showingIndex: -1 // Not used for simultaneous
        }))

        // Show time
        const { showTime } = getDifficulty(level)
        timerRef.current = setTimeout(() => {
            setGameState(prev => ({ ...prev, phase: "INPUT" }))
        }, showTime)

    }, [])

    const startGame = useCallback(() => {
        setGameState({
            level: 1,
            lives: 5,
            gridSize: 2,
            sequence: [],
            playerInput: [],
            phase: "IDLE",
            showingIndex: -1,
        })
        // Small delay before starting first level
        setTimeout(() => startLevel(1), 500)
    }, [startLevel])

    const handleCellClick = useCallback((index: number) => {
        setGameState(prev => {
            if (prev.phase !== "INPUT") return prev

            // Check if already clicked
            if (prev.playerInput.includes(index)) return prev

            // Check if correct
            if (prev.sequence.includes(index)) {
                const newInput = [...prev.playerInput, index]

                // Check if level complete
                if (newInput.length === prev.sequence.length) {
                    // Victory for this level
                    toast.success("Correct!")
                    setTimeout(() => startLevel(prev.level + 1), 1000)
                    return { ...prev, playerInput: newInput, phase: "VICTORY" }
                }

                return { ...prev, playerInput: newInput }
            } else {
                // Wrong click
                const newLives = prev.lives - 1
                if (newLives <= 0) {
                    // Submit score
                    fetch("/api/games/memory-grid/score", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ score: prev.level }),
                    }).catch(err => console.error("Failed to submit score:", err))

                    return { ...prev, lives: 0, phase: "GAME_OVER" }
                } else {
                    toast.error("Wrong cell! Lost a life.")
                    return { ...prev, lives: newLives }
                }
            }
        })
    }, [startLevel])

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const resetToIdle = useCallback(() => {
        setGameState({
            level: 1,
            lives: 5,
            gridSize: 2,
            sequence: [],
            playerInput: [],
            phase: "IDLE",
            showingIndex: -1,
        })
    }, [])

    return {
        gameState,
        startGame,
        handleCellClick,
        resetToIdle
    }
}
