import { NumberMemoryGame } from "@/games/number-memory/game"

export default function NumberMemoryPage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <NumberMemoryGame />
        </div>
    )
}
