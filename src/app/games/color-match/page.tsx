import { ColorMatchGame } from "@/games/color-match/game"

export default function ColorMatchPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <ColorMatchGame />
        </div>
    )
}
