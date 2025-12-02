import { cn } from "@/lib/utils"
import { Cell as CellType } from "../types"

interface CellProps {
    cell: CellType
    isSelected: boolean
    isRelated: boolean // Same row, col, or box
    isSameValue: boolean // Same value as selected
    onClick: () => void
}

export function Cell({ cell, isSelected, isRelated, isSameValue, onClick }: CellProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-center text-3xl sm:text-4xl cursor-pointer select-none transition-colors duration-75",
                "border-r border-b border-gray-300 last:border-r-0",
                // Thicker borders for 3x3 boxes
                (cell.col + 1) % 3 === 0 && cell.col !== 8 && "border-r-[3px] border-r-black",
                (cell.row + 1) % 3 === 0 && cell.row !== 8 && "border-b-[3px] border-b-black",
                // Background colors
                isSelected && "bg-blue-200",
                !isSelected && isSameValue && cell.value !== null && "bg-blue-200",
                !isSelected && !isSameValue && isRelated && "bg-blue-50",
                !isSelected && !isSameValue && !isRelated && "bg-white",
                // Text colors
                cell.isFixed ? "font-medium text-black" : "text-blue-600 font-medium",
                cell.isError && "text-red-500 bg-red-100",
            )}
            style={{ width: "100%", height: "100%", aspectRatio: "1/1" }}
        >
            {cell.value !== null ? (
                cell.value
            ) : (
                <div className="grid grid-cols-3 gap-[1px] w-full h-full p-[2px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div
                            key={num}
                            className={cn(
                                "flex items-center justify-center text-[6px] sm:text-[8px] leading-none text-muted-foreground/70",
                                cell.notes.includes(num) ? "opacity-100" : "opacity-0"
                            )}
                        >
                            {num}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
