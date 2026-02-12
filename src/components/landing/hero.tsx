import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="hidden lg:flex container relative flex-col lg:flex-row my-10 lg:my-20 py-2 md:py-6 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none -z-10" />

            {/* Left Panel - Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-0 lg:p-8 z-10">
                <div className="flex flex-col items-start gap-4 lg:gap-6 max-w-xl">
                    <h1 className="text-3xl font-mono font-bold uppercase tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-left">
                        Calibrate
                        <br />
                        Your Mind
                    </h1>
                    <p className="leading-relaxed text-muted-foreground text-sm sm:text-lg sm:leading-6 text-left">
                        Enhance cognitive latency and pattern recognition through structured competitive frameworks.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                        <Link href="/games" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto rounded-none font-mono uppercase tracking-wider text-xs h-12 px-8">
                                Start Playing
                            </Button>
                        </Link>
                        <Link href="/leaderboard" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-none font-mono uppercase tracking-wider text-xs h-12 px-8">
                                View Data
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Panel - Visualization */}
            <div className="hidden lg:flex w-full lg:w-1/2 relative overflow-hidden items-center justify-center z-10">

                {/* Central Node Graphic */}
                <div className="relative w-64 h-64 md:w-96 md:h-96">
                    {/* Rotating Rings */}
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 border border-foreground/20 rounded-full"
                            style={{ padding: i * 20 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20 - i * 5, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                        >
                            <div className="w-2 h-2 bg-foreground rounded-full absolute top-0 left-1/2 -translate-x-1/2 -mt-1" />
                        </motion.div>
                    ))}

                    {/* Core Pulse */}
                    <motion.div
                        className="absolute inset-0 m-auto w-32 h-32 bg-primary/10 rounded-full border border-primary/30 backdrop-blur-sm flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Brain className="w-12 h-12 text-primary" />
                    </motion.div>

                    {/* Floating Data Points */}
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={`node-${i}`}
                            className="absolute w-24 h-8 bg-background border border-foreground/10 flex items-center justify-center text-[10px] font-mono shadow-sm"
                            style={{
                                top: `${20 + i * 20}%`,
                                left: i % 2 === 0 ? '-20%' : '80%'
                            }}
                            initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.2 }}
                        >
                            NODE_0{i + 1} :: OK
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    )
}
