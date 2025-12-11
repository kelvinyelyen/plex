import { Board as BoardType } from "../types"
import { Cell } from "./cell"
import { motion } from "framer-motion"

interface BoardProps {
    board: BoardType
    selectedCell: { row: number; col: number } | null
    onCellClick: (row: number, col: number) => void
}

export function Board({ board, selectedCell, onCellClick }: BoardProps) {
    const selectedValue = selectedCell
        ? board[selectedCell.row][selectedCell.col].value
        : null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
        >
            <div className="relative grid grid-cols-9 border-2 border-foreground/20 bg-background/30 backdrop-blur-md shadow-2xl mx-auto w-full aspect-square overflow-hidden">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isSelected =
                            selectedCell?.row === rowIndex && selectedCell?.col === colIndex

                        // Check if related (same row, col, or box)
                        const isRelated = selectedCell
                            ? selectedCell.row === rowIndex ||
                            selectedCell.col === colIndex ||
                            (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                                Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3))
                            : false

                        const isSameValue =
                            selectedValue !== null && cell.value === selectedValue

                        return (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                cell={cell}
                                isSelected={isSelected}
                                isRelated={isRelated}
                                isSameValue={isSameValue}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                            />
                        )
                    })
                )}
            </div>
        </motion.div>
    )
}
