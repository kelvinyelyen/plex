import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Difficulty } from "../types"

import { Trophy, Home } from "lucide-react"

interface CompletionDialogProps {
    open: boolean
    time: number
    difficulty: Difficulty
    moves: number
    onPlayAgain: () => void
    onClose: () => void
    onQuit: () => void
}

export function CompletionDialog({ open, time, difficulty, moves, onPlayAgain, onClose, onQuit }: CompletionDialogProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()} modal={false}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                    <div className="p-4 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div className="space-y-1 text-center">
                        <DialogTitle className="text-2xl font-bold">Target Reached!</DialogTitle>
                        <DialogDescription>
                            Excellent calculation skills.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Time</span>
                        <span className="text-2xl font-bold tabular-nums">{formatTime(time)}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Moves</span>
                        <span className="text-2xl font-bold">{moves}</span>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg space-y-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Difficulty</span>
                        <span className="text-xl font-bold">{difficulty}</span>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center pt-2">
                    <Button variant="outline" size="lg" onClick={onQuit} className="w-full sm:w-auto gap-2">
                        <Home className="w-4 h-4" />
                        Quit
                    </Button>
                    <Button onClick={onPlayAgain} size="lg" className="w-full sm:w-auto min-w-[140px]">
                        Play Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
