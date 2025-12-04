import { Heart } from "lucide-react"

interface GameInfoProps {
    level: number
    lives: number
}

export function GameInfo({ level, lives }: GameInfoProps) {
    return (
        <div className="flex items-center justify-between w-full max-w-md mb-6 px-4">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Level</span>
                <span className="text-2xl font-mono font-bold">{level}</span>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Lives</span>
                <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                            key={i}
                            className={`w-5 h-5 ${i < lives
                                    ? "fill-red-500 text-red-500"
                                    : "fill-muted text-muted"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
