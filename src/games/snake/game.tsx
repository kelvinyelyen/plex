"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameStartScreen } from "@/components/game/start-screen"
import { Button } from "@/components/ui/button"
import { Home, RotateCcw, ArrowLeft, Skull } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Config
const GRID_SIZE = 20
const INITIAL_SPEED = 150
const SPEED_INCREMENT = 2

type Point = { x: number, y: number }
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

export function SnakeGame() {
    const [gameState, setGameState] = useState<"MENU" | "PLAYING" | "GAME_OVER">("MENU")
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
    const [food, setFood] = useState<Point>({ x: 15, y: 10 })
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [speed, setSpeed] = useState(INITIAL_SPEED)

    // UseRef for direction to prevent multiple direction changes in one tick (suicide)
    const directionRef = useRef<Direction>("RIGHT")
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

    const router = useRouter()
    const pathname = usePathname()

    const handleQuit = () => {
        setGameState("MENU")
        router.replace(pathname)
    }

    const initGame = () => {
        setSnake([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
        setFood(generateFood([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]))
        directionRef.current = "RIGHT"
        setScore(0)
        setSpeed(INITIAL_SPEED)
        setGameState("PLAYING")
    }

    const generateFood = (currentSnake: Point[]) => {
        let newFood: Point
        let isCollision
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            }
            isCollision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
        } while (isCollision)
        return newFood
    }

    const gameOver = useCallback(() => {
        setGameState("GAME_OVER")
        if (score > highScore) setHighScore(score)
        if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }, [score, highScore])

    const moveSnake = useCallback(() => {
        setSnake(prevSnake => {
            const head = { ...prevSnake[0] }

            switch (directionRef.current) {
                case "UP": head.y -= 1; break;
                case "DOWN": head.y += 1; break;
                case "LEFT": head.x -= 1; break;
                case "RIGHT": head.x += 1; break;
            }

            // Check Wall Collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                gameOver()
                return prevSnake
            }

            // Check Self Collision
            if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameOver()
                return prevSnake
            }

            const newSnake = [head, ...prevSnake]

            // Check Food Collision
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 1)
                setSpeed(s => Math.max(50, s - SPEED_INCREMENT))
                setFood(generateFood(newSnake))
                // Don't pop tail
            } else {
                newSnake.pop()
            }

            return newSnake
        })
    }, [food, gameOver])

    // Game Loop
    useEffect(() => {
        if (gameState === "PLAYING") {
            gameLoopRef.current = setInterval(moveSnake, speed)
        } else {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
        }
    }, [gameState, moveSnake, speed])

    // Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    if (directionRef.current !== "DOWN") directionRef.current = "UP"
                    break
                case "ArrowDown":
                    if (directionRef.current !== "UP") directionRef.current = "DOWN"
                    break
                case "ArrowLeft":
                    if (directionRef.current !== "RIGHT") directionRef.current = "LEFT"
                    break
                case "ArrowRight":
                    if (directionRef.current !== "LEFT") directionRef.current = "RIGHT"
                    break
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    // Prevent scrolling with arrow keys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }
        window.addEventListener("keydown", handleKeyDown, false);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    if (gameState === "MENU") {
        return (
            <div className="w-full min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center">
                <GameStartScreen
                    title="Snake"
                    description="Classic Arcade. Eat food to grow. Don't hit the walls."
                    onStart={() => {
                        initGame()
                        router.replace(`${pathname}?mode=play`)
                    }}
                    instructions={<div className="space-y-2 text-sm text-muted-foreground">
                        <p>1. Use Arrow Keys to change direction.</p>
                        <p>2. Eat the white square to grow.</p>
                        <p>3. Avoid hitting walls or your own tail.</p>
                    </div>}
                    icon={<div className="flex gap-1">
                        <div className="w-4 h-4 bg-primary rounded-sm" />
                        <div className="w-4 h-4 bg-primary/50 rounded-sm" />
                        <div className="w-4 h-4 bg-primary/20 rounded-sm" />
                    </div>}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start w-full max-w-lg mx-auto gap-8 h-full">
            <div className="w-full flex items-center justify-between">
                <span className="text-sm font-mono font-bold tracking-[0.2em] text-muted-foreground uppercase">Snake</span>
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={handleQuit}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b pb-4 border-border/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Best</span>
                    <span className="text-2xl font-mono font-bold text-muted-foreground">{highScore}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
                    <span className="text-4xl font-mono font-bold tabular-nums text-primary">
                        {score}
                    </span>
                </div>
            </div>

            {/* Game Board */}
            <div
                className="relative bg-muted/20 border-2 border-primary/20 rounded-lg overflow-hidden shadow-2xl shadow-primary/5"
                style={{
                    width: "min(90vw, 400px)",
                    height: "min(90vw, 400px)",
                }}
            >
                {/* Grid Overlay (Optional, consistent with others?) */}
                <div
                    className="absolute inset-0 grid pointer-events-none opacity-10"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
                >
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-foreground/20" />
                    ))}
                </div>

                {/* Snake & Food container - Using Percentages for responsive board */}
                <div className="absolute inset-0">
                    <AnimatePresence>
                        {/* Food */}
                        <motion.div
                            key="food"
                            className="absolute bg-foreground shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-sm"
                            style={{
                                width: `${100 / GRID_SIZE}%`,
                                height: `${100 / GRID_SIZE}%`,
                                left: `${(food.x / GRID_SIZE) * 100}%`,
                                top: `${(food.y / GRID_SIZE) * 100}%`,
                            }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        />

                        {/* Snake */}
                        {snake.map((segment, i) => (
                            <motion.div
                                key={`${i}-${segment.x}-${segment.y}`} // Key changes on move? No, key should be index for smooth movement or unique ID?
                                // Actually, for snake, simple div is often better than framer motion for performance at speed
                                className={cn(
                                    "absolute rounded-sm",
                                    i === 0 ? "bg-primary z-10" : "bg-primary/80 z-0"
                                )}
                                style={{
                                    width: `${100 / GRID_SIZE}%`,
                                    height: `${100 / GRID_SIZE}%`,
                                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls Hint */}
            <div className="grid grid-cols-3 gap-2 max-w-[200px] w-full md:hidden opacity-50">
                <div />
                <Button variant="outline" size="icon" onClick={() => { if (directionRef.current !== "DOWN") directionRef.current = "UP" }}><ArrowLeft className="rotate-90" /></Button>
                <div />
                <Button variant="outline" size="icon" onClick={() => { if (directionRef.current !== "RIGHT") directionRef.current = "LEFT" }}><ArrowLeft /></Button>
                <Button variant="outline" size="icon" onClick={() => { if (directionRef.current !== "UP") directionRef.current = "DOWN" }}><ArrowLeft className="-rotate-90" /></Button>
                <Button variant="outline" size="icon" onClick={() => { if (directionRef.current !== "LEFT") directionRef.current = "RIGHT" }}><ArrowLeft className="rotate-180" /></Button>
            </div>

            <div className="hidden md:block text-xs text-muted-foreground font-mono">
                Use Arrow Keys to move
            </div>

            {/* Game Over Dialog */}
            <Dialog open={gameState === "GAME_OVER"} onOpenChange={() => { }} modal={false}>
                <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                        <div className="p-4 rounded-none bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                            <Skull className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">
                                Game Over
                            </DialogTitle>
                            <DialogDescription>
                                The snake bit the dust.
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
                        <Button size="lg" onClick={initGame} className="w-full gap-2 rounded-none">
                            <RotateCcw className="w-4 h-4" />
                            Replay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
