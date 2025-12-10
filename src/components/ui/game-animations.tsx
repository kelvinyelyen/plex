"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export const SudokuAnimation = () => {
    const [numbers, setNumbers] = useState<(number | null)[]>([null, 2, null, 4, null, 6, null, 8, null])

    useEffect(() => {
        const interval = setInterval(() => {
            setNumbers(prev => prev.map(n => Math.random() > 0.7 ? (Math.floor(Math.random() * 9) + 1) : n))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid grid-cols-3 gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md">
            {numbers.map((n, i) => (
                <motion.div
                    key={i}
                    className="flex items-center justify-center bg-background rounded text-xs font-bold text-primary border border-border/50"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: n ? 1 : 0.3, scale: n ? 1 : 0.9 }}
                    transition={{ duration: 0.5 }}
                >
                    {n}
                </motion.div>
            ))}
        </div>
    )
}

export const MemoryAnimation = () => {
    const [active, setActive] = useState<number[]>([])

    useEffect(() => {
        const interval = setInterval(() => {
            const newActive = []
            for (let i = 0; i < 3; i++) {
                newActive.push(Math.floor(Math.random() * 9))
            }
            setActive(newActive)
        }, 800)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid grid-cols-3 gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md">
            {[...Array(9)].map((_, i) => (
                <motion.div
                    key={i}
                    className="rounded bg-primary/20"
                    animate={{
                        backgroundColor: active.includes(i) ? "hsl(var(--primary))" : "hsl(var(--muted))",
                        opacity: active.includes(i) ? 1 : 0.2
                    }}
                    transition={{ duration: 0.3 }}
                />
            ))}
        </div>
    )
}

export const LeaderboardAnimation = () => {
    return (
        <div className="flex items-end justify-center gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md">
            {[40, 70, 50, 90, 60].map((h, i) => (
                <motion.div
                    key={i}
                    className="w-3 bg-primary rounded-t-sm"
                    animate={{ height: [`${h}%`, `${h - 20}%`, `${h}%`] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
            ))}
        </div>
    )
}

export const ConundraAnimation = () => {
    return (
        <div className="flex items-center justify-center gap-1 w-24 h-24 p-2 bg-muted/20 rounded-md font-mono text-xs font-bold text-primary">
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            >
                12
            </motion.div>
            <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
                +
            </motion.div>
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            >
                12
            </motion.div>
        </div>
    )
}

export const PulseAnimation = () => {
    return (
        <div className="flex items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md">
            <motion.div
                className="w-12 h-12 bg-primary rounded-full"
                animate={{
                    opacity: [0.1, 1, 0.1],
                    scale: [0.8, 1, 0.8]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    )
}

export const SplitAnimation = () => {
    return (
        <div className="flex items-center justify-center w-24 h-24 p-2 bg-muted/20 rounded-md overflow-hidden relative">
            <motion.div
                className="w-10 h-14 border-2 border-primary bg-background rounded-sm flex items-center justify-center"
                animate={{
                    x: [0, -40, 0, 0, 40, 0], // Center -> Left -> Center -> Center -> Right -> Center
                    opacity: [1, 0, 0, 1, 0, 0, 1],
                    scale: [1, 0.8, 0.8, 1, 0.8, 0.8, 1],
                    rotate: [0, -10, 0, 0, 10, 0, 0]
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.25, 0.5, 0.7, 0.75, 1]
                }}
            >
                <div className="w-1/2 h-0.5 bg-primary/50" />
            </motion.div>

            {/* Left/Right Pulse Indicators */}
            <motion.div
                className="absolute left-1 top-1/2 w-1 h-8 bg-primary/20 rounded-full"
                animate={{ opacity: [0, 1, 0, 0, 0, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.1, 0.3, 1] }}
            />
            <motion.div
                className="absolute right-1 top-1/2 w-1 h-8 bg-primary/20 rounded-full"
                animate={{ opacity: [0, 0, 0, 0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.5, 0.6, 1] }}
            />
        </div>
    )
}
