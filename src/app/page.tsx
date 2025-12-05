"use client"

import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Initiative } from "@/components/landing/initiative"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <Initiative />
    </div>
  )
}
