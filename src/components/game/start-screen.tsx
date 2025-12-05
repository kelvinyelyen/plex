"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, HelpCircle, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"

interface GameStartScreenProps {
    title: string
    description: string
    onStart: () => void
    instructions: React.ReactNode
    icon?: React.ReactNode
}

export function GameStartScreen({
    title,
    description,
    onStart,
    instructions,
    icon,
}: GameStartScreenProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto p-4 text-center space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="flex justify-center">
                    <div className="p-6 rounded-2xl bg-primary/5 ring-1 ring-primary/20">
                        {icon || <Trophy className="w-16 h-16 text-primary" />}
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12 gap-2" onClick={onStart}>
                        <Play className="w-5 h-5" />
                        Start Game
                    </Button>

                    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-12 gap-2">
                                <HelpCircle className="w-5 h-5" />
                                How to Play
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[60vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>How to Play {title}</DialogTitle>
                                <DialogDescription>
                                    Follow these instructions to master the game.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                {instructions}
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setIsOpen(false)}>Got it</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </motion.div>
        </div>
    )
}
