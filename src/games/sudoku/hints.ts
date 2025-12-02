import { Board, CellValue } from "./types"
import { isValid, getSolution } from "./solver"

export type HintType = "Single" | "Error" | "Random"

export interface Hint {
    row: number
    col: number
    value: CellValue
    message: string
}

export function getHint(board: Board): Hint | null {
    // 1. Check for errors first
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = board[row][col]
            if (cell.value !== null && !cell.isFixed) {
                // Temporarily remove value to check validity
                const val = cell.value
                cell.value = null
                if (!isValid(board, row, col, val)) {
                    cell.value = val // Restore
                    return {
                        row,
                        col,
                        value: null, // Suggest removing
                        message: "This number is incorrect.",
                    }
                }
                cell.value = val // Restore
            }
        }
    }

    // 2. Find a cell to fill
    // Ideally, we should find a "logical" hint (e.g., naked single), but for now we can use the solver solution
    const solution = getSolution(board)
    if (!solution) return null // Unsolvable

    // Find a random empty cell or the first empty cell
    // Let's try to find a cell with the fewest possibilities (heuristic)
    let bestRow = -1
    let bestCol = -1
    let minOptions = 10

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col].value === null) {
                let options = 0
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) options++
                }

                if (options < minOptions && options > 0) {
                    minOptions = options
                    bestRow = row
                    bestCol = col
                }
            }
        }
    }

    if (bestRow !== -1) {
        return {
            row: bestRow,
            col: bestCol,
            value: solution[bestRow][bestCol].value,
            message: "Try this number.",
        }
    }

    return null
}
