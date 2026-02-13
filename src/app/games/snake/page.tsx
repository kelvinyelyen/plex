import { SnakeGame } from "@/games/snake/game"

export default function SnakePage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <SnakeGame />
        </div>
    )
}
