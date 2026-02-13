import { HanoiGame } from "@/games/hanoi/game"

export default function HanoiPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <HanoiGame />
        </div>
    )
}
