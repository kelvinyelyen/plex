"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const SquarePatternBackground = () => {
    const [squares, setSquares] = useState<{ id: number; x: number; y: number; delay: number }[]>([])

    useEffect(() => {
        // Generate a grid of squares
        const newSquares = []
        const cols = 12
        const rows = 8
        for (let i = 0; i < cols * rows; i++) {
            // Use deterministic values based on index instead of Math.random()
            // This ensures the pattern remains identical across re-renders/navigation
            const randomDelay = ((i * 17) % 500) / 100

            newSquares.push({
                id: i,
                x: (i % cols) * 100 / cols,
                y: Math.floor(i / cols) * 100 / rows,
                delay: randomDelay
            })
        }
        setSquares(newSquares)
    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {squares.map((sq) => (
                <motion.div
                    key={sq.id}
                    className="absolute w-8 h-8 bg-primary/10 border border-primary/20"
                    style={{
                        left: `${sq.x}%`,
                        top: `${sq.y}%`,
                    }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: sq.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="my-32 flex flex-col items-center justify-center relative bg-background overflow-hidden">
            <SquarePatternBackground />
            <div className="container relative z-10 flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
                <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome to Plex
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign up to compete on the leaderboard
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
