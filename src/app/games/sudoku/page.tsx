import { SudokuGame } from "@/games/sudoku/game"

export default function SudokuPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <SudokuGame />
        </div>
    )
}
