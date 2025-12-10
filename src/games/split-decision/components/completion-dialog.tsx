import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GameMode } from "../use-split-decision"
import { Activity, Home, RotateCcw } from "lucide-react"

interface SplitCompletionDialogProps {
    open: boolean
    stats: {
        correct: number
        incorrect: number
        missed: number
    }
    mode: GameMode
    onPlayAgain: () => void
    onChangeProtocol: () => void
    onClose: () => void
}

export function SplitCompletionDialog({ open, stats, onPlayAgain, onChangeProtocol, onClose }: SplitCompletionDialogProps) {
    const netScore = Math.max(0, stats.correct - stats.incorrect)

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()} modal={false}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                    <div className="p-4 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div className="space-y-1 text-center">
                        <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">Time&apos;s Up</DialogTitle>
                        <DialogDescription>
                            Sorting protocol complete.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex justify-between items-center font-mono p-3 bg-muted/30 rounded">
                            <span className="text-muted-foreground uppercase tracking-wider text-xs">Correct</span>
                            <span className="font-bold text-lg text-green-500">{stats.correct}</span>
                        </div>
                        <div className="flex justify-between items-center font-mono p-3 bg-muted/30 rounded">
                            <span className="text-muted-foreground uppercase tracking-wider text-xs">Incorrect</span>
                            <span className="font-bold text-lg text-red-500">{stats.incorrect}</span>
                        </div>
                        <div className="col-span-2 flex justify-between items-center font-mono p-3 bg-muted/30 rounded">
                            <span className="text-muted-foreground uppercase tracking-wider text-xs">No Move</span>
                            <span className="font-bold text-lg text-yellow-500">{stats.missed}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg space-y-2 border border-border/50">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Net Score</span>
                        <div className="text-5xl font-bold font-mono text-primary">{netScore}</div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center pt-2">
                    <Button variant="outline" size="lg" onClick={onChangeProtocol} className="w-full sm:w-auto gap-2">
                        <Home className="w-4 h-4" />
                        Protocol
                    </Button>
                    <Button onClick={onPlayAgain} size="lg" className="w-full sm:w-auto min-w-[140px] gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Retry
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
