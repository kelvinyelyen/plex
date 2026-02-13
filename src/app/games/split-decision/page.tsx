import { SplitDecisionGame } from "@/games/split-decision/game"

export const metadata = {
    title: "Split Decision | Plex",
    description: "Train your attention-switching capacity.",
}

export default function SplitDecisionPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <SplitDecisionGame />
        </div>
    )
}
