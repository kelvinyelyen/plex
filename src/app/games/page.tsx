import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-background py-16 px-8 md:px-16">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex items-end justify-between border-b border-foreground/10 pb-8">
                    <div className="space-y-2">
                        <h1 className="font-display italic text-5xl md:text-7xl">Modules</h1>
                        <p className="font-mono text-sm text-muted-foreground max-w-md">
                            {"// SELECT_PROTOCOL"} <br />
                            Choose a cognitive training framework to begin calibration.
                        </p>
                    </div>
                    <div className="hidden md:block font-mono text-xs text-muted-foreground text-right">
                        <span>SYS.STATUS: READY</span> <br />
                        <span>AVAILABLE_MODULES: 01</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Sudoku Module Card */}
                    <Link href="/games/sudoku" className="group relative block h-[400px] border border-foreground/10 bg-background hover:border-foreground/30 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="font-mono text-xs text-muted-foreground">
                                MOD_01 :: LOGIC
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        {/* Abstract Visual */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-3 gap-2 w-48 h-48">
                                {[...Array(9)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-foreground w-full h-full"
                                        style={{ opacity: Math.random() * 0.5 + 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer / Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
                            <h2 className="font-display text-3xl font-bold">Sudoku</h2>
                            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                                Classic numerical placement framework. Optimizes pattern recognition and logical deduction pathways.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono text-xs uppercase tracking-widest">
                                    Initialize
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Memory Grid Module Card */}
                    <Link href="/games/memory-grid" className="group relative block h-[400px] border border-foreground/10 bg-background hover:border-foreground/30 transition-colors overflow-hidden">
                        {/* Card Header */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                            <div className="font-mono text-xs text-muted-foreground">
                                MOD_02 :: MEMORY
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
                            <h2 className="font-display text-3xl font-bold">Memory Grid</h2>
                            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                                Visual pattern retention protocol. Enhances short-term memory and spatial recall capabilities.
                            </p>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full font-mono text-xs uppercase tracking-widest">
                                    Initialize
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Placeholder for Future Modules */}
                    <div className="h-[400px] border border-foreground/5 bg-foreground/5 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <p className="font-mono text-xs text-muted-foreground">MOD_02 :: LOCKED</p>
                            <p className="font-display italic text-xl text-muted-foreground/50">Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
