import { SudokuGame } from "@/games/sudoku/game"

export default function SudokuPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <SudokuGame />
        </div>
    )
}
