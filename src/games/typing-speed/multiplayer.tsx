"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Copy, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "Adjusting to the new normal requires flexibility.",
    "Cognitive processing speed is a key indicator.",
    "Technological advancement accelerates daily.",
]

type PlayerState = {
    id: string
    wpm: number
    progress: number
    isReady: boolean
    username: string
}

export function MultiplayerTypingGame({ onBack }: { onBack: () => void }) {
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
                        isReady: presence.isReady || false
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
                        isReady: false
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
            isReady: !current.isReady
        })
    }

    const startGame = async () => {
        const selectedText = SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
        await channelRef.current.send({
            type: 'broadcast',
            event: 'game_start',
            payload: { text: selectedText }
        })
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInput(val)

        // Calculate progress
        const progress = Math.min(100, Math.round((val.length / text.length) * 100))

        // Calculate WPM
        const elapsedMin = (Date.now() - startTime) / 60000
        const wpm = Math.round((val.length / 5) / elapsedMin) || 0

        // Broadcast update
        if (channelRef.current) {
            channelRef.current.track({
                username,
                wpm,
                progress,
                isReady: true // Locked in
            })
        }

        if (val === text) {
            // Finished
            // Could trigger game over for self
        }
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

            {/* Game Text */}
            <div className="w-full p-8 text-2xl font-mono leading-relaxed bg-muted/10 rounded-xl border border-border/50">
                {text.split("").map((char, i) => {
                    let color = "text-muted-foreground/50"
                    if (i < input.length) {
                        color = input[i] === char ? "text-primary" : "text-destructive"
                    }
                    return <span key={i} className={color}>{char}</span>
                })}
            </div>

            <Input
                autoFocus
                value={input}
                onChange={handleInput}
                className="text-center text-xl font-mono h-16 tracking-widest"
                placeholder="Type here..."
            />
        </div>
    )
}
