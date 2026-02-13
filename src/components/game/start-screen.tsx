"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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

interface GameStartScreenProps {
    title: string
    description: string
    onStart: () => void
    instructions: React.ReactNode
    icon?: React.ReactNode
    children?: React.ReactNode
}

export function GameStartScreen({
    title,
    description,
    onStart,
    instructions,
    icon,
    children,
}: GameStartScreenProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-4 text-center space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div className="flex justify-center">
                    <div className="p-4">
                        {icon || <Trophy className="w-12 h-12 text-foreground" />}
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-mono font-bold uppercase tracking-[0.2em]">{title}</h1>
                    <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <Button size="lg" className="w-full sm:w-auto font-mono uppercase text-xs tracking-wider h-12 px-8 rounded-none border border-primary bg-primary text-primary-foreground hover:bg-primary/90" onClick={onStart}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Game
                    </Button>

                    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto font-mono uppercase text-xs tracking-wider h-12 px-8 rounded-none border-border hover:bg-accent">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                How to Play
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[60vh] overflow-y-auto rounded-none border-border">
                            <DialogHeader>
                                <DialogTitle className="font-mono uppercase tracking-widest text-lg">How to Play {title}</DialogTitle>
                                <DialogDescription>
                                    Follow these instructions to master the game.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                {instructions}
                            </div>
                            <div className="flex justify-end">
                                <Button className="font-mono uppercase text-xs tracking-wider rounded-none" onClick={() => setIsOpen(false)}>Got it</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {children && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {children}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
