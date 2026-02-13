import { VerbalMemoryGame } from "@/games/verbal-memory/game"

export default function VerbalMemoryPage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <VerbalMemoryGame />
        </div>
    )
}
