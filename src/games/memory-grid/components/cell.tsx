import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CellProps {
    isLit: boolean
    isSelected: boolean
    isCorrect: boolean
    isWrong: boolean
    onClick: () => void
    disabled: boolean
}

export function Cell({ isLit, isSelected, isCorrect, isWrong, onClick, disabled }: CellProps) {
    return (
        <motion.button
            whileTap={!disabled ? { scale: 0.9 } : undefined}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full h-full rounded-md transition-colors duration-200",
                "bg-secondary/50", // Default state
                isLit && "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]", // Lit state (showing)
                isSelected && !isCorrect && !isWrong && "bg-primary/80", // Selected state (before validation, if needed, or just immediate feedback)
                isCorrect && "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]", // Correct state
                isWrong && "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]", // Wrong state
                disabled && !isLit && !isCorrect && !isWrong && "cursor-default hover:bg-secondary/50"
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
        />
    )
}
