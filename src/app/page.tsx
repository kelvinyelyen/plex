"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StarterPage() {
  return (
    <main className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-background touch-none">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none -z-10" />

      <div className="container flex flex-col items-center text-center gap-8 z-10 px-4">
        <h1 className="text-5xl font-black font-mono uppercase tracking-tighter sm:text-6xl md:text-7xl leading-[0.9]">
          Calibrate
          <br />
          <span className="text-primary">Your Mind</span>
        </h1>

        <p className="leading-relaxed text-muted-foreground text-sm sm:text-lg max-w-xs sm:max-w-md">
          Enhance cognitive latency and pattern recognition through structured competitive frameworks.
        </p>

        <div className="flex flex-col w-full max-w-xs gap-4 pt-8">
          <Link href="/home" className="w-full">
            <Button
              size="lg"
              className="w-full font-mono uppercase tracking-wider text-sm h-14 font-bold"
            >
              Start Playing
            </Button>
          </Link>

          <Link href="/leaderboard" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full font-mono uppercase tracking-wider text-sm h-14 font-bold"
            >
              View Data
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
