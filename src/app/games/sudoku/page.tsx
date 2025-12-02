import { SudokuGame } from "@/games/sudoku/game"

export default function SudokuPage() {
    return (
        <div className="container py-8 md:py-12">
            <div className="flex flex-col items-center space-y-4 text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Sudoku
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Challenge yourself with our classic Sudoku.
                </p>
            </div>
            <SudokuGame />
        </div>
    )
}
