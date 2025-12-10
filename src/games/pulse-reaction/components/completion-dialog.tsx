import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Activity, Home, RotateCcw } from "lucide-react"

interface PulseCompletionDialogProps {
    open: boolean
    averageScore: number
    onPlayAgain: () => void
    onClose: () => void
    onQuit: () => void
}

export function PulseCompletionDialog({ open, averageScore, onPlayAgain, onClose, onQuit }: PulseCompletionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()} modal={false}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                    <div className="p-4 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div className="space-y-1 text-center">
                        <DialogTitle className="text-2xl font-bold">Sequence Complete</DialogTitle>
                        <DialogDescription>
                            Your cognitive latency results are ready.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-6 flex justify-center">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg space-y-2 w-full">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Final Precision</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold font-mono text-primary">{averageScore}</span>
                            <span className="text-sm font-mono text-muted-foreground">ms</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center pt-2">
                    <Button variant="outline" size="lg" onClick={onQuit} className="w-full sm:w-auto gap-2">
                        <Home className="w-4 h-4" />
                        Quit
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
