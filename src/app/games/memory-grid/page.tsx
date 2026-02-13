import { MemoryGame } from "@/games/memory-grid/game"

export default function MemoryGridPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <MemoryGame />
        </div>
    )
}
