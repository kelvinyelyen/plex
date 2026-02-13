import { ColorMatchGame } from "@/games/color-match/game"

export default function ColorMatchPage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <ColorMatchGame />
        </div>
    )
}
