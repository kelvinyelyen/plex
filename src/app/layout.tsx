import type { Metadata } from "next"
import { Cormorant_Garamond, Space_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { cn } from "@/lib/utils"

const cormorantGaramond = Cormorant_Garamond({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" })
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "PLEX EXHIBITION",
  description: "A curated collection of digital experiences.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-mono antialiased selection:bg-primary selection:text-white",
        cormorantGaramond.variable,
        spaceMono.variable
      )}>
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
