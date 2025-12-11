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
        <>
            {/* Mobile View */}
            <div className="grid grid-cols-5 gap-1 w-full md:hidden">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                        key={num}
                        variant="outline"
                        className="aspect-square w-full text-2xl font-mono hover:bg-primary/10 hover:text-primary border-border/50 transition-all duration-200 p-0 rounded-none"
                        onClick={() => onNumberClick(num)}
                    >
                        {num}
                    </Button>
                ))}
                <Button
                    variant={isNoteMode ? "secondary" : "ghost"}
                    className={cn(
                        "aspect-square w-full gap-2 transition-all font-mono uppercase tracking-widest text-xs border border-transparent rounded-none",
                        isNoteMode && "bg-secondary"
                    )}
                    onClick={onNoteToggle}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex flex-col gap-4 w-full">
                <div className="grid grid-cols-3 gap-2 w-full aspect-square">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Button
                            key={num}
                            variant="outline"
                            className="h-full w-full text-2xl font-mono hover:bg-primary/10 hover:text-primary border-border/50 transition-all duration-200 p-0 rounded-none"
                            onClick={() => onNumberClick(num)}
                        >
                            {num}
                        </Button>
                    ))}
                </div>

                <Button
                    variant={isNoteMode ? "secondary" : "ghost"}
                    className={cn(
                        "w-full h-12 gap-2 transition-all font-mono uppercase tracking-widest text-xs rounded-none",
                        isNoteMode && "bg-secondary"
                    )}
                    onClick={onNoteToggle}
                >
                    <Pencil className="h-4 w-4" />
                    <span>{isNoteMode ? "Notes On" : "Notes Off"}</span>
                </Button>
            </div>
        </>
    )
}
