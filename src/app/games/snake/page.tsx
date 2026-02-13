import { SnakeGame } from "@/games/snake/game"

export default function SnakePage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <SnakeGame />
        </div>
    )
}
