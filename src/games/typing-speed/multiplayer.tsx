"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "Adjusting to the new normal requires flexibility and resilience in the face of constant change.",
    "Cognitive processing speed is a key indicator of overall mental acuity and executive function.",
    "Technological advancement accelerates at an exponential rate creating new paradigms in every sector.",
    "Precision and accuracy are paramount when executing complex maneuvers under high pressure conditions.",
    "The intricate dance of neural pathways determines our ability to learn and adapt to novel stimuli.",
    "Quantum entanglement suggests that particles can remain connected regardless of the distance separating them.",
    "The architectural design of the new library emphasizes sustainable materials and natural lighting.",
    "Understanding the nuances of diplomatic protocol is essential for international relations.",
    "The symphony orchestra performed a mesmerizing rendition of Beethoven's Ninth Symphony.",
    "Artificial intelligence algorithms are becoming increasingly sophisticated in their pattern recognition capabilities.",
    "The Great Barrier Reef is the largest living structure on Earth and is visible from space.",
    "Cryptographic protocols ensure the security and integrity of digital transactions across global networks.",
    "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods.",
    "The concept of neuroplasticity demonstrates the brain's ability to reorganize itself by forming new neural connections.",
    "Sustainable energy solutions are critical for mitigating the long-term impacts of climate change.",
    "The exploration of Mars has provided humanity with unprecedented insights into the geology of the Red Planet.",
    "Effective communication requires not only speaking clearly but also listening with empathy and attention.",
    "The history of civilization is marked by the rise and fall of great empires and the exchange of cultural ideas.",
    "The minimalist design philosophy advocates for simplicity and the elimination of unnecessary elements.",
    "Bioluminescence is a chemical reaction that allows certain living organisms to produce light in the darkness.",
    "The concept of time dilation in relativity theory explains how time passes differently depending on speed.",
    "Global economic interdependence means that financial events in one region can have ripple effects worldwide.",
    "The evolution of language reflects the dynamic nature of human society and the constant influx of new concepts.",
    "Urban planning initiatives aim to create sustainable cities that prioritize public transportation and green spaces.",
    "The discovery of penicillin revolutionized medicine and paved the way for the treatment of bacterial infections.",
    "Deep reinforcement learning has enabled computers to master complex games like Go and Chess.",
    "The psychology of color explores how different hues can influence human emotion and behavior.",
    "Renewable energy technologies such as solar and wind power are essential for a clean energy future.",
    "The intricate ecosystem of a coral reef supports a vast array of marine life forms.",
    "Nanotechnology involves the manipulation of matter on an atomic and molecular scale.",
    "The philosophy of stoicism teaches the development of self-control and fortitude as a means of overcoming emotions.",
    "Virtual reality technology is transforming industries ranging from entertainment to healthcare training.",
    "The conservation of biodiversity is crucial for maintaining the resilience of natural ecosystems.",
    "Historical linguistics studies the development and relationship of languages over time.",
    "The Doppler effect explains the change in frequency of a wave in relation to an observer.",
    "Cybersecurity measures are vital for protecting sensitive information in an increasingly digital world.",
    "The art of storytelling has been a fundamental part of human culture for thousands of years."
]

type PlayerState = {
    id: string
    wpm: number
    progress: number
    isReady: boolean
    username: string
    isFinished: boolean
    finishTime: number
}

export function MultiplayerTypingGame() {
    const [gameState, setGameState] = useState<"LOBBY" | "PLAYING" | "GAME_OVER">("LOBBY")
    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")
    const [players, setPlayers] = useState<Record<string, PlayerState>>({})
    const [playerId, setPlayerId] = useState("")
    // Game State
    const [text, setText] = useState("")
    const [input, setInput] = useState("")
    const [startTime, setStartTime] = useState(0)

    // Channel Ref
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channelRef = useRef<any>(null)

    useEffect(() => {
        // Init unique ID for this session
        const id = Math.random().toString(36).substring(7)
        setPlayerId(id)
    }, [])

    const createRoom = () => {
        if (!username) return toast.error("Enter a username first")
        const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
        setRoomId(newRoomId)
        joinChannel(newRoomId)
    }

    const joinRoom = () => {
        if (!username) return toast.error("Enter a username first")
        if (!roomId) return toast.error("Enter a room ID")
        joinChannel(roomId)
    }

    const joinChannel = (room: string) => {
        const channel = supabase.channel(`room:${room}`, {
            config: {
                presence: {
                    key: playerId,
                },
            },
        })

        channelRef.current = channel

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState()
                const newPlayers: Record<string, PlayerState> = {}

                Object.keys(newState).forEach(key => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const presence = newState[key][0] as any
                    newPlayers[key] = {
                        id: key,
                        username: presence.username,
                        wpm: presence.wpm || 0,
                        progress: presence.progress || 0,
                        isReady: presence.isReady || false,
                        isFinished: presence.isFinished || false,
                        finishTime: presence.finishTime || 0
                    }
                })
                setPlayers(newPlayers)
            })
            .on('broadcast', { event: 'game_start' }, ({ payload }) => {
                setText(payload.text)
                setStartTime(Date.now())
                setGameState("PLAYING")
                setInput("")
            })
            .on('broadcast', { event: 'game_update' }, () => {
                // Handle other events if needed
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Send initial presence
                    await channel.track({
                        username,
                        wpm: 0,
                        progress: 0,
                        isReady: false,
                        isFinished: false,
                        finishTime: 0
                    })
                }
            })
    }

    const toggleReady = async () => {
        if (!channelRef.current) return
        const current = players[playerId] || {}
        await channelRef.current.track({
            username,
            wpm: current.wpm,
            progress: current.progress,
            isReady: !current.isReady,
            isFinished: current.isFinished || false,
            finishTime: current.finishTime || 0
        })
    }

    const startGame = async () => {
        const selectedText = SENTENCES[Math.floor(Math.random() * SENTENCES.length)]

        // Broadcast to others
        await channelRef.current.send({
            type: 'broadcast',
            event: 'game_start',
            payload: { text: selectedText }
        })

        // Initialize locally for host
        setText(selectedText)
        setStartTime(Date.now())
        setGameState("PLAYING")
        setInput("")
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState !== "PLAYING") return

        // Ignore modifier keys
        if (e.ctrlKey || e.metaKey || e.altKey) return

        if (e.key === "Backspace") {
            setInput(prev => prev.slice(0, -1))
            return
        }

        if (e.key.length !== 1) return

        const nextChar = e.key
        const currentLength = input.length

        // Optional: Block incorrect input? Or allow it and mark red?
        // Game.tsx allows it. Let's filter for now to match game.tsx logic if we want,
        // or just append. Let's append.

        const newInput = input + nextChar
        setInput(newInput)

        // Calculate stats
        const progress = Math.min(100, Math.round((newInput.length / text.length) * 100))
        const elapsedMin = (Date.now() - startTime) / 60000
        const wpm = Math.round((newInput.length / 5) / elapsedMin) || 0

        const isFinished = newInput === text
        const finishTime = isFinished ? Date.now() - startTime : 0

        if (channelRef.current) {
            channelRef.current.track({
                username,
                wpm,
                progress,
                isReady: true,
                isFinished,
                finishTime
            })
        }

        if (isFinished) {
            setGameState("GAME_OVER")
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [gameState, input, startTime, text, username])

    // Check for Game Over (all players finished) - disable auto game over for everyone
    // We now just show game over for self when finished
    // useEffect(() => {
    //     if (gameState !== "PLAYING") return

    //     const allPlayers = Object.values(players)
    //     if (allPlayers.length > 0 && allPlayers.every(p => p.isFinished)) {
    //         setGameState("GAME_OVER")
    //     }
    // }, [players, gameState])

    const resetGame = async () => {
        if (!channelRef.current) return

        // Reset local self
        await channelRef.current.track({
            username,
            wpm: 0,
            progress: 0,
            isReady: false,
            isFinished: false,
            finishTime: 0
        })

        // We don't change gameState to LOBBY immediately for everyone unless we broadcast it?
        // But the previous flow puts us in LOBBY when we join.
        // Let's just reset local state to LOBBY
        setGameState("LOBBY")
    }

    // Unsubscribe on unmount
    useEffect(() => {
        return () => {
            if (channelRef.current) supabase.removeChannel(channelRef.current)
        }
    }, [])

    if (gameState === "LOBBY") {
        return (
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mx-auto min-h-[calc(100vh-14rem)]">

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold font-mono tracking-widest text-primary uppercase">Multiplayer Lobby</h1>
                    <p className="text-muted-foreground">Race against friends in real-time.</p>
                </div>

                {!channelRef.current ? (
                    <Card className="w-full bg-muted/10 border-border/50">
                        <CardHeader>
                            <CardTitle>Join or Create</CardTitle>
                            <CardDescription>Enter a username to get started</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Room ID"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                />
                                <Button onClick={joinRoom}>Join</Button>
                            </div>

                            <Button variant="outline" className="w-full" onClick={createRoom}>
                                Create New Room
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="w-full bg-muted/10 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Room: {roomId}</span>
                                <Button variant="ghost" size="icon" onClick={() => {
                                    navigator.clipboard.writeText(roomId)
                                    toast.success("Copied Room ID")
                                }}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {Object.values(players).map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", p.isReady ? "bg-green-500" : "bg-red-500")} />
                                            <span className="font-mono">{p.username} {p.id === playerId && "(You)"}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{p.isReady ? "READY" : "WAITING"}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className={cn("w-full", players[playerId]?.isReady ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}
                                    onClick={toggleReady}
                                >
                                    {players[playerId]?.isReady ? "Not Ready" : "Ready Up"}
                                </Button>
                                {/* Only show start if everyone ready? Or just allow any execution */}
                                <Button className="w-full" variant="secondary" onClick={startGame} disabled={Object.values(players).length < 2}>
                                    Start Game
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }

    if (gameState === "GAME_OVER") {
        const sortedPlayers = Object.values(players).sort((a, b) => {
            if (a.isFinished && b.isFinished) return a.finishTime - b.finishTime
            if (a.isFinished) return -1
            if (b.isFinished) return 1
            return b.wpm - a.wpm
        })

        return (
            <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mx-auto min-h-[calc(100vh-14rem)]">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold font-mono tracking-tighter text-primary uppercase">Game Over</h1>
                    <p className="text-muted-foreground">Final Standings</p>
                </div>

                <Card className="w-full bg-muted/10 border-border/50">
                    <CardContent className="p-0">
                        {sortedPlayers.map((p, i) => (
                            <div key={p.id} className={cn("flex items-center justify-between p-4 border-b border-border/50 last:border-0", p.id === playerId && "bg-primary/5")}>
                                <div className="flex items-center gap-4">
                                    <div className="font-mono text-xl font-bold text-muted-foreground w-6">#{i + 1}</div>
                                    <div className="flex flex-col">
                                        <div className="font-mono font-bold flex items-center gap-2">
                                            {p.username}
                                            {p.id === playerId && <span className="text-[10px] bg-primary/20 text-primary px-1 rounded">YOU</span>}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {p.isFinished ? `${(p.finishTime / 1000).toFixed(2)}s` : "DNF"}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-2xl font-mono font-bold">
                                    {p.wpm} <span className="text-xs font-normal text-muted-foreground">WPM</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Button size="lg" className="w-full" onClick={resetGame}>
                    Back to Lobby
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
            {/* Header / Progress Bars */}
            <div className="w-full grid gap-4">
                {Object.values(players).map(p => (
                    <div key={p.id} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-mono text-muted-foreground">
                            <span>{p.username}</span>
                            <span>{p.wpm} WPM</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className={cn("h-full", p.id === playerId ? "bg-primary" : "bg-muted-foreground")}
                                initial={{ width: 0 }}
                                animate={{ width: `${p.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative w-full p-8 text-2xl md:text-3xl font-mono leading-relaxed bg-muted/10 rounded-xl border border-border/50 break-words whitespace-pre-wrap">
                {text.split("").map((char, i) => {
                    let className = "text-muted-foreground/50"
                    if (i < input.length) {
                        className = input[i] === char ? "text-primary" : "text-destructive"
                    }

                    // Cursor
                    const isCurrent = i === input.length

                    return (
                        <span key={i} className={cn(className, isCurrent && "bg-primary/20 animate-pulse")}>
                            {char}
                        </span>
                    )
                })}
            </div>

            <div className="text-sm text-muted-foreground uppercase tracking-widest animate-pulse">
                {gameState === "PLAYING" ? "Type the text above..." : "Waiting to start..."}
            </div>
        </div>
    )
}
