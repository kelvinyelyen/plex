"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CompletionDialogProps {
    open: boolean
    time: number
    difficulty: string
    mistakes: number
    onPlayAgain: () => void
}

export function CompletionDialog({ open, time, difficulty, mistakes, onPlayAgain }: CompletionDialogProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Puzzle Solved!</DialogTitle>
                    <DialogDescription>
                        Great job! You've completed the {difficulty} puzzle.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <span className="font-bold">Time:</span>
                        <span>{formatTime(time)}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <span className="font-bold">Mistakes:</span>
                        <span className={mistakes > 0 ? "text-red-500" : "text-green-500"}>
                            {mistakes}
                        </span>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onPlayAgain} className="w-full">Play Again</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
