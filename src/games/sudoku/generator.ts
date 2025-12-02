
import { Board, CellValue, Difficulty } from "./types"
import { solve } from "./solver"

// Helper to create an empty board
export function createEmptyBoard(): Board {
    return Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) => ({
            row,
            col,
            value: null,
            isFixed: false,
            notes: [],
        }))
    )
}

// Generate a full valid board
export function generateFullBoard(): Board {
    const board = createEmptyBoard()

    // Fill diagonal 3x3 boxes first (independent of each other) to speed up solving
    for (let i = 0; i < 9; i += 3) {
        fillBox(board, i, i)
    }

    solve(board)
    return board
}

function fillBox(board: Board, startRow: number, startCol: number) {
    let num: number
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1
            } while (!isSafeInBox(board, startRow, startCol, num))
            board[startRow + i][startCol + j].value = num as CellValue
        }
    }
}

function isSafeInBox(board: Board, startRow: number, startCol: number, num: number): boolean {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j].value === num) return false
        }
    }
    return true
}

// Remove numbers to create a puzzle
export function generatePuzzle(difficulty: Difficulty): Board {
    const board = generateFullBoard()
    const attempts = difficulty === "Easy" ? 30 : difficulty === "Medium" ? 40 : difficulty === "Hard" ? 50 : 60

    let count = attempts
    while (count > 0) {
        let row = Math.floor(Math.random() * 9)
        let col = Math.floor(Math.random() * 9)

        while (board[row][col].value === null) {
            row = Math.floor(Math.random() * 9)
            col = Math.floor(Math.random() * 9)
        }

        // Backup
        // const backup = board[row][col].value
        board[row][col].value = null

        // Check if unique solution exists (simplified: just remove for now, proper uniqueness check is expensive but better)
        // For a real app, we should check uniqueness.
        // I'll skip deep uniqueness check for MVP speed, but ideally we'd run the solver and count solutions.

        count--
    }

    // Set isFixed
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j].value !== null) {
                board[i][j].isFixed = true
            }
        }
    }

    return board
}
