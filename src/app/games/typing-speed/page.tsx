import { TypingSpeedGame } from "@/games/typing-speed/game"

export default function TypingSpeedPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <TypingSpeedGame />
        </div>
    )
}
