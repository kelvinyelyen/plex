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

interface CompletionDialogProps {
    open: boolean
    time: number
    difficulty: Difficulty
    moves: number
    onPlayAgain: () => void
}

export function CompletionDialog({ open, time, difficulty, moves, onPlayAgain }: CompletionDialogProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Puzzle Solved!</DialogTitle>
                    <DialogDescription className="text-center">
                        Excellent calculation skills.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Time</span>
                        <span className="text-2xl font-bold">{formatTime(time)}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Moves</span>
                        <span className="text-2xl font-bold">{moves}</span>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Difficulty</span>
                        <span className="text-xl font-bold">{difficulty}</span>
                    </div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={onPlayAgain} className="w-full sm:w-auto">
                        Play Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
