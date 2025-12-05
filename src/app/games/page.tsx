import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-background py-16 px-8 md:px-16">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex items-end justify-between border-b pb-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Games</h1>
                        <p className="text-muted-foreground max-w-md">
                            Choose a game to begin training.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Sudoku Module Card */}
                    <Link href="/games/sudoku" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden rounded-lg">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Logic
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-3 gap-2 w-48 h-48">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-full h-full rounded-sm"
                                        style={{ opacity: Math.random() * 0.5 + 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-bold">Sudoku</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Classic numerical placement puzzle. Optimizes pattern recognition and logical deduction.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Memory Grid Module Card */}
                    <Link href="/games/memory-grid" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden rounded-lg">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Memory
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-4 gap-2 w-48 h-48">
                                {[...Array(16)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-full h-full rounded-sm"
                                        style={{ opacity: Math.random() * 0.5 + 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-bold">Memory Grid</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Visual pattern retention game. Enhances short-term memory and spatial recall.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Conundra Module Card */}
                    <Link href="/games/conundra" className="group relative block h-[400px] border bg-card hover:border-primary/50 transition-colors overflow-hidden rounded-lg">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Math
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="flex gap-4 text-6xl font-bold font-mono">
                                <span>+</span>
                                <span>-</span>
                                <span>×</span>
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="text-3xl font-bold">Conundra</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Arithmetic puzzle challenge. Combine numbers to reach the target.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full">
                                    Play Now
                                </Button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
