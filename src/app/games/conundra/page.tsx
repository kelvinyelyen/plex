import { ConundraGame } from "@/games/conundra/game"

export default function ConundraPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <ConundraGame />
        </div>
    )
}
