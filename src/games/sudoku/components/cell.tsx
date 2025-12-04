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
                "relative flex items-center justify-center text-2xl sm:text-3xl cursor-pointer select-none transition-all duration-200",
                "border-r border-b border-foreground/10 last:border-r-0",
                // Thicker borders for 3x3 boxes
                (cell.col + 1) % 3 === 0 && cell.col !== 8 && "border-r-2 border-r-foreground/30",
                (cell.row + 1) % 3 === 0 && cell.row !== 8 && "border-b-2 border-b-foreground/30",

                // Background colors
                isSelected && "bg-primary/20 backdrop-blur-sm",
                !isSelected && isSameValue && cell.value !== null && "bg-primary/10",
                !isSelected && !isSameValue && isRelated && "bg-foreground/5",
                !isSelected && !isSameValue && !isRelated && "hover:bg-foreground/5",

                // Text colors
                cell.isFixed ? "font-bold text-foreground" : "text-primary font-medium",
                cell.isError && "text-red-500 bg-red-500/10",
            )}
            style={{ width: "100%", height: "100%", aspectRatio: "1/1" }}
        >
            {cell.value !== null ? (
                <span className="font-mono">{cell.value}</span>
            ) : (
                <div className="grid grid-cols-3 gap-[1px] w-full h-full p-[2px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div
                            key={num}
                            className={cn(
                                "flex items-center justify-center text-[6px] sm:text-[8px] leading-none font-mono",
                                cell.notes.includes(num) ? "text-muted-foreground opacity-100" : "opacity-0"
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
