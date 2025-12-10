import { Github } from "lucide-react"


export function Footer() {
    return (
        <footer className="relative z-50 border-t py-6 md:py-0 bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-xs leading-loose text-muted-foreground md:text-left font-mono">
                        {"// BUILT_BY"}{" "}
                        <a
                            href="https://kelvinyelyen.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium hover:text-foreground transition-colors"
                        >
                            KELVIN_YELYEN
                        </a>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/kelvinyelyen/plex"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider"
                    >
                        <Github className="h-3 w-3" />
                        Source
                    </a>
                </div>
            </div>
        </footer>
    )
}
