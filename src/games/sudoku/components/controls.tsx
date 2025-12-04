import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface ControlsProps {
    onNumberClick: (num: number) => void
    onNoteToggle: () => void
    isNoteMode: boolean
}

export function Controls({
    onNumberClick,
    onNoteToggle,
    isNoteMode,
}: ControlsProps) {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Note Toggle */}
            <div className="flex justify-center">
                <Button
                    variant={isNoteMode ? "default" : "outline"}
                    className={cn(
                        "rounded-full px-6 gap-2 transition-all",
                        isNoteMode ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    )}
                    onClick={onNoteToggle}
                >
                    <Pencil className="h-4 w-4" />
                    <span className="font-medium">Notes {isNoteMode ? "On" : "Off"}</span>
                </Button>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-9 md:grid-cols-3 gap-1 md:gap-2 w-full md:aspect-square">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                        key={num}
                        variant="outline"
                        className="h-12 md:h-full w-full text-xl md:text-3xl font-light hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all duration-200 p-0"
                        onClick={() => onNumberClick(num)}
                    >
                        {num}
                    </Button>
                ))}
            </div>
        </div>
    )
}
