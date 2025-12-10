import { PulseReactionGame } from "@/games/pulse-reaction/game"

export const metadata = {
    title: "Pulse Reaction | Plex",
    description: "Test your cognitive latency.",
}

export default function PulseReactionPage() {
    return (
        <div className="container flex-1 py-12">
            <PulseReactionGame />
        </div>
    )
}
