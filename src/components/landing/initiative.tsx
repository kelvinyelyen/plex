import Image from "next/image"

export function Initiative() {
    return (
        <section className="container py-12 md:py-16">
            <div className="flex flex-col items-center justify-center gap-8 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                    AN INITIATIVE OF
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 w-full max-w-5xl mx-auto">
                    {/* Logo 1 - Academic City University */}
                    <div className="flex-1 flex justify-center md:justify-end px-8 md:px-12">
                        <div className="relative h-24 w-64 md:h-32 md:w-80 opacity-80 hover:opacity-100 transition-opacity">
                            <Image
                                src="/logos/academic-city-new.png"
                                alt="Academic City University Logo"
                                fill
                                className="object-contain dark:hidden"
                            />
                            <Image
                                src="/logos/academic-city-new.png"
                                alt="Academic City University Logo"
                                fill
                                className="object-contain hidden dark:block brightness-0 invert"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-24 md:h-24 md:w-px bg-border/50 shrink-0" />

                    {/* Logo 2 - Maths & Programming Resource Center */}
                    <div className="flex-1 flex justify-center md:justify-start px-8 md:px-12">
                        <div className="relative h-20 w-56 md:h-24 md:w-72 opacity-80 hover:opacity-100 transition-opacity">
                            <Image
                                src="/logos/math-resource-center.png"
                                alt="Maths & Programming Resource Center Logo"
                                fill
                                className="object-contain dark:hidden"
                            />
                            <Image
                                src="/logos/math-resource-center.png"
                                alt="Maths & Programming Resource Center Logo"
                                fill
                                className="object-contain hidden dark:block brightness-0 invert"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
