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
import { useRouter } from "next/navigation"

interface GameOverDialogProps {
    open: boolean
    onRestart: () => void
}

export function GameOverDialog({ open, onRestart }: GameOverDialogProps) {
    const router = useRouter()

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-destructive">Game Over</DialogTitle>
                    <DialogDescription>
                        You have made 3 mistakes. Better luck next time!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => router.push("/")}>
                        Quit
                    </Button>
                    <Button onClick={onRestart}>
                        Restart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
