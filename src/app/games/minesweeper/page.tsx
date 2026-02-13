import { MinesweeperGame } from "@/games/minesweeper/game"

export default function MinesweeperPage() {
    return (
        <div className="container min-h-screen bg-background py-8 flex flex-col">
            <MinesweeperGame />
        </div>
    )
}
