import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface GameOverDialogProps {
    open: boolean
    level: number
    onRestart: () => void
    onClose: () => void
    onQuit: () => void
}

import { RotateCcw, Skull, Home } from "lucide-react"

export function GameOverDialog({ open, level, onRestart, onClose, onQuit }: GameOverDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()} modal={false}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                    <div className="p-4 rounded-none bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                        <Skull className="w-8 h-8" />
                    </div>
                    <div className="space-y-1 text-center">
                        <DialogTitle className="text-2xl font-bold">Game Over</DialogTitle>
                        <DialogDescription>
                            Your memory sequence has ended.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-6 flex justify-center">
                    <div className="text-center space-y-1 p-4 bg-muted/50 rounded-none w-full">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Level Reached</span>
                        <div className="text-4xl font-bold text-primary">{level}</div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center pt-2">
                    <Button variant="outline" size="lg" onClick={onQuit} className="w-full sm:w-auto gap-2 rounded-none">
                        <Home className="w-4 h-4" />
                        Quit
                    </Button>
                    <Button size="lg" onClick={onRestart} className="w-full sm:w-auto gap-2 min-w-[140px] rounded-none">
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
