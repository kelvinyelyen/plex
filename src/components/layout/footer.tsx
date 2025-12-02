export function Footer() {
    return (
        <footer className="border-t border-foreground/10 bg-background py-8 px-8 md:px-16">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 border border-foreground/20" />
                    <p>
                        PLEX © 2025
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span>STATUS:</span>
                        <span className="text-green-600">OPERATIONAL</span>
                    </div>

                    <p>
                        ARCHITECT :: {" "}
                        <a
                            href="#"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            KELVIN_YELYEN
                        </a>
                    </p>

                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary transition-colors"
                    >
                        [ SOURCE_CODE ]
                    </a>
                </div>
            </div>
        </footer>
    )
}
