import { VerbalMemoryGame } from "@/games/verbal-memory/game"

export default function VerbalMemoryPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <VerbalMemoryGame />
        </div>
    )
}
