"use client"

import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <Features />
            <br />
            <br />
            <br />
        </div>
    )
}
