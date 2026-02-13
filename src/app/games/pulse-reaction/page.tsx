import { PulseReactionGame } from "@/games/pulse-reaction/game"

export const metadata = {
    title: "Pulse Reaction | Plex",
    description: "Test your cognitive latency.",
}

export default function PulseReactionPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <PulseReactionGame />
        </div>
    )
}
