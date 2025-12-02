export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert"

export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null

export interface Cell {
    row: number
    col: number
    value: CellValue
    isFixed: boolean // True if part of the initial puzzle
    notes: number[] // For note-taking mode
    isError?: boolean // For validation
}

export type Board = Cell[][]

export interface GameState {
    board: Board
    difficulty: Difficulty
    mistakes: number
    timer: number // in seconds
    isComplete: boolean
    history: Board[] // For undo/redo
}
