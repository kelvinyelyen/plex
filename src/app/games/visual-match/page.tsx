import { VisualMatchGame } from "@/games/visual-match/game"

export default function VisualMatchPage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <VisualMatchGame />
        </div>
    )
}
