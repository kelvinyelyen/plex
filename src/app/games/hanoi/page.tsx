import { HanoiGame } from "@/games/hanoi/game"

export default function HanoiPage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <HanoiGame />
        </div>
    )
}
