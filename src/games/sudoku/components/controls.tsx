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
            <div className="flex justify-center w-full">
                <Button
                    variant={isNoteMode ? "default" : "outline"}
                    className={cn(
                        "w-full h-10 gap-2 transition-all font-mono uppercase tracking-widest text-xs border-foreground/20",
                        isNoteMode ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]" : "hover:bg-foreground/5"
                    )}
                    onClick={onNoteToggle}
                >
                    <Pencil className="h-3 w-3" />
                    <span>{isNoteMode ? "Annotation Mode" : "Entry Mode"}</span>
                </Button>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-9 md:grid-cols-3 gap-2 w-full md:aspect-square">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                        key={num}
                        variant="outline"
                        className="h-12 md:h-full w-full text-xl md:text-2xl font-mono hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-200 p-0 border-foreground/10"
                        onClick={() => onNumberClick(num)}
                    >
                        {num}
                    </Button>
                ))}
            </div>
        </div>
    )
}
