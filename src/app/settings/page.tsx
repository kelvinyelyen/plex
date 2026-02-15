"use client"

import { ModeToggle } from "@/components/layout/mode-toggle"
// import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-mono font-bold uppercase tracking-tighter">Settings</h1>
                <p className="text-muted-foreground text-sm">Manage your app preferences.</p>
            </div>

            <hr className="border-border" />

            <div className="space-y-6">
                <section className="space-y-4">
                    <h2 className="text-lg font-bold font-mono uppercase tracking-wider">Appearance</h2>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="space-y-1">
                            <span className="font-medium">Theme</span>
                            <p className="text-xs text-muted-foreground">Toggle between light and dark mode.</p>
                        </div>
                        <ModeToggle />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold font-mono uppercase tracking-wider">About</h2>
                    <div className="p-4 border rounded-lg bg-card space-y-4">
                        <div>
                            <span className="block font-medium">Version</span>
                            <span className="text-sm text-muted-foreground font-mono">v0.1.0 (Beta)</span>
                        </div>
                        <div>
                            <span className="block font-medium">Purpose</span>
                            <p className="text-sm text-muted-foreground mt-1">
                                Plex is a cognitive calibration tool designed to enhance latency and pattern recognition through competitive frameworks. Built for the <strong>Academic City University community (MPRC)</strong>.
                            </p>
                        </div>
                        <div>
                            <span className="block font-medium">Developer</span>
                            <a href="https://kelvinyelyen.com" target="_blank" className="text-sm text-primary hover:underline font-mono">
                                KELVIN_YELYEN
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
