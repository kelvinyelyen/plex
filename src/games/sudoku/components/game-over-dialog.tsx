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
interface GameOverDialogProps {
    open: boolean
    onRestart: () => void
    onClose: () => void
    onQuit: () => void
}

import { XCircle, RotateCcw, Home } from "lucide-react"

export function GameOverDialog({ open, onRestart, onClose, onQuit }: GameOverDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()} modal={false}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-4 pb-2">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1 text-center">
                        <DialogTitle className="text-2xl font-bold">Game Over</DialogTitle>
                        <DialogDescription>
                            You've reached the maximum number of mistakes.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-6 flex justify-center">
                    <div className="text-center space-y-1 p-4 bg-muted/50 rounded-lg w-full">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Mistakes</span>
                        <div className="text-2xl font-bold text-destructive">3 / 3</div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center">
                    <Button variant="outline" size="lg" onClick={onQuit} className="w-full sm:w-auto gap-2">
                        <Home className="w-4 h-4" />
                        Quit
                    </Button>
                    <Button size="lg" onClick={onRestart} className="w-full sm:w-auto gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
