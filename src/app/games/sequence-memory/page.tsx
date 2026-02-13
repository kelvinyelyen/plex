import { SequenceMemoryGame } from "@/games/sequence-memory/game"

export default function SequenceMemoryPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <SequenceMemoryGame />
        </div>
    )
}
