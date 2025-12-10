import { SplitDecisionGame } from "@/games/split-decision/game"

export const metadata = {
    title: "Split Decision | Plex",
    description: "Train your attention-switching capacity.",
}

export default function SplitDecisionPage() {
    return (
        <div className="container flex-1 py-12">
            <SplitDecisionGame />
        </div>
    )
}
