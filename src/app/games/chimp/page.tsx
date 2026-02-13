import { ChimpGame } from "@/games/chimp/game"

export default function ChimpPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <ChimpGame />
        </div>
    )
}
