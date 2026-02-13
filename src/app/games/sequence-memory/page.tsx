import { SequenceMemoryGame } from "@/games/sequence-memory/game"

export default function SequenceMemoryPage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <SequenceMemoryGame />
        </div>
    )
}
