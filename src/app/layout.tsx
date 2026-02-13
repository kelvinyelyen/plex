import React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/layout/mobile-nav"
import { cn } from "@/lib/utils"


export const metadata: Metadata = {
  title: "Plex",
  description: "A curated collection of digital experiences.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plex",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        GeistSans.variable,
        GeistMono.variable
      )}>
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col pb-24 md:pb-0">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <div className="md:hidden">
              <React.Suspense fallback={null}>
                <MobileNav />
              </React.Suspense>
            </div>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
