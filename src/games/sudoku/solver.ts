import { Board, CellValue } from "./types"

// Check if placing a value is valid
export function isValid(board: Board, row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x].value === num && x !== col) return false
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col].value === num && x !== row) return false
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j].value === num && (startRow + i !== row || startCol + j !== col)) {
                return false
            }
        }
    }

    return true
}

// Solve the board using backtracking
// Returns true if solvable
export function solve(board: Board): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col].value === null) {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]

                for (const num of nums) {
                    if (isValid(board, row, col, num)) {
                        board[row][col].value = num as CellValue
                        if (solve(board)) return true
                        board[row][col].value = null
                    }
                }
                return false
            }
        }
    }
    return true
}

// Get the solution for a given board (returns a new board)
export function getSolution(board: Board): Board | null {
    // Deep copy the board
    const boardCopy = JSON.parse(JSON.stringify(board))
    if (solve(boardCopy)) {
        return boardCopy
    }
    return null
}
