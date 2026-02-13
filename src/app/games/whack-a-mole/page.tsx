import { WhackAMoleGame } from "@/games/whack-a-mole/game"

export default function WhackAMolePage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <WhackAMoleGame />
        </div>
    )
}
