interface GameInfoProps {
    level: number
    lives: number
}

export function GameInfo({ level, lives }: GameInfoProps) {
    return (
        <div className="flex items-center justify-between w-full max-w-md mb-8 border-y border-foreground/10 py-4 bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col px-4 border-r border-foreground/10 w-1/2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Current Level</span>
                <span className="text-3xl font-display font-bold italic">
                    {level.toString().padStart(2, '0')}
                </span>
            </div>

            <div className="flex flex-col items-end px-4 w-1/2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">System Integrity</span>
                <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i < lives
                                ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                : "bg-foreground/10"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
