import { SplitDecisionGame } from "@/games/split-decision/game"

export const metadata = {
    title: "Split Decision | Plex",
    description: "Train your attention-switching capacity.",
}

export default function SplitDecisionPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <SplitDecisionGame />
        </div>
    )
}
