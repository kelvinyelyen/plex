"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, Brain, Zap } from "lucide-react"

export function Hero() {
    return (
        <section className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden border-b border-foreground/10">
            {/* Left Panel - Control Interface */}
            <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative border-r border-foreground/10 bg-background z-10">

                {/* Technical Header */}
                <div className="absolute top-8 left-8 md:top-16 md:left-16 flex items-center gap-4 text-xs font-mono text-muted-foreground tracking-widest">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span>SYS.ONLINE</span>
                    </div>
                    <span>{"//"}</span>
                    <span>V.2.0.4</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 mt-12"
                >
                    <h1 className="font-display italic text-6xl md:text-8xl leading-[0.9] text-foreground">
                        Calibrate
                        <br />
                        <span className="not-italic font-light text-muted-foreground">Your Mind.</span>
                    </h1>

                    <p className="font-mono text-sm md:text-base text-muted-foreground max-w-md leading-relaxed border-l-2 border-primary/50 pl-6">
                        :: INITIATE PROTOCOL <br />
                        Enhance cognitive latency and pattern recognition through structured competitive frameworks.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/games">
                            <Button size="lg" className="w-full sm:w-auto">
                                <Zap className="w-4 h-4 mr-2" />
                                INITIATE
                            </Button>
                        </Link>
                        <Link href="/leaderboard">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <Activity className="w-4 h-4 mr-2" />
                                ANALYSIS
                            </Button>
                        </Link>
                    </div>
                </motion.div>


            </div>

            {/* Right Panel - Visualization */}
            <div className="w-full lg:w-1/2 relative bg-[#EAE8E0] overflow-hidden flex items-center justify-center min-h-[50vh] lg:min-h-auto">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

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

                {/* Corner Accents */}
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-foreground/20" />
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-foreground/20" />
            </div>
        </section>
    )
}
