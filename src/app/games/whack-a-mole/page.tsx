import { WhackAMoleGame } from "@/games/whack-a-mole/game"

export default function WhackAMolePage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <WhackAMoleGame />
        </div>
    )
}
