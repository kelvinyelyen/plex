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
}

export function GameOverDialog({ open, level, onRestart }: GameOverDialogProps) {
    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Game Over</DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        You reached Level {level}!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <div className="text-4xl">💀</div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={onRestart} className="w-full sm:w-auto">
                        Try Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
