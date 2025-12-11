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
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full h-full rounded-none transition-all duration-300 border border-transparent",
                // Default state
                "bg-foreground/5 hover:bg-foreground/10",

                // Lit state (showing)
                isLit && "bg-primary border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] scale-105 z-10",

                // Selected state (immediate feedback)
                isSelected && !isCorrect && !isWrong && "bg-primary/50 border-primary/50",

                // Correct state
                isCorrect && "bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105 z-10",

                // Wrong state
                isWrong && "bg-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]",

                // Disabled state
                disabled && !isLit && !isCorrect && !isWrong && "cursor-default hover:bg-foreground/5 opacity-50"
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
        />
    )

}
