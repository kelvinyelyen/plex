import { ChimpGame } from "@/games/chimp/game"

export default function ChimpPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <ChimpGame />
        </div>
    )
}
