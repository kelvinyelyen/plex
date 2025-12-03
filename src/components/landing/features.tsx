"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const exhibits = [
    {
        id: "001",
        title: "Play",
        subtitle: "Sudoku Logic Framework",
        href: "/games/sudoku",
        // Abstract representation of Sudoku
        visual: (
            <div className="w-full h-full grid grid-cols-3 gap-4 p-8">
                {[...Array(9)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                        className="bg-black/10 w-full h-full"
                    />
                ))}
            </div>
        )
    },
    {
        id: "002",
        title: "Hierarchy",
        subtitle: "ACity Campus Ranking System",
        href: "/leaderboard",
        // Abstract representation of Ranking
        visual: (
            <div className="w-full h-full flex items-end justify-center gap-4 p-12">
                {[40, 80, 60, 90, 50].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className="w-8 bg-primary/20"
                    />
                ))}
            </div>
        )
    },
    {
        id: "003",
        title: "Network",
        subtitle: "Community Protocol",
        href: "/register",
        // Abstract representation of Network
        visual: (
            <div className="w-full h-full relative p-8">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute border border-black/10 rounded-full"
                        style={{
                            top: '50%',
                            left: '50%',
                            width: `${(i + 1) * 20}%`,
                            height: `${(i + 1) * 20}%`,
                            x: '-50%',
                            y: '-50%'
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-2 h-2 bg-primary rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
                    </motion.div>
                ))}
            </div>
        )
    }
]

export function Features() {
    const [activeExhibit, setActiveExhibit] = useState<number | null>(null)

    return (
        <section className="min-h-screen flex flex-col lg:flex-row relative bg-background">

            {/* Left Panel - Visual Preview Area */}
            <div className="w-full lg:w-1/2 relative bg-[#EAE8E0] hidden lg:flex items-center justify-center overflow-hidden">
                {/* Grid Background to match Hero */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="relative w-full h-full p-16 flex items-center justify-center">
                    <div className="relative w-full max-w-lg aspect-square border border-foreground/10 bg-background/50 backdrop-blur-sm">
                        {activeExhibit !== null ? (
                            <motion.div
                                key={activeExhibit}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full"
                            >
                                {exhibits[activeExhibit].visual}
                            </motion.div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground tracking-widest">
                                SELECT AN EXHIBIT
                            </div>
                        )}

                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-foreground" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-foreground" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-foreground" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-foreground" />
                    </div>
                </div>
            </div>

            {/* Right Panel - Catalog List */}
            <div className="w-full lg:w-1/2 p-8 md:p-16 border-r border-foreground/10">
                <div className="space-y-0 max-w-xl">
                    <div className="border-b border-foreground/10 pb-4 mb-8 flex justify-between items-end">
                        <h2 className="font-display italic text-4xl">Catalog</h2>
                        <span className="font-mono text-xs text-muted-foreground">VOL. 1</span>
                    </div>

                    {exhibits.map((exhibit, index) => (
                        <Link
                            key={index}
                            href={exhibit.href}
                            onMouseEnter={() => setActiveExhibit(index)}
                            onMouseLeave={() => setActiveExhibit(null)}
                            className="group block border-b border-foreground/5 py-12 relative"
                        >
                            <div className="flex items-baseline gap-8">
                                <span className="font-mono text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    {exhibit.id}
                                </span>
                                <div className="space-y-2">
                                    <h3 className="font-display text-5xl md:text-6xl group-hover:italic transition-all duration-300">
                                        {exhibit.title}
                                    </h3>
                                    <p className="font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                        {exhibit.subtitle}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </section>
    )
}
