import { SchulteGame } from "@/games/schulte/game"

export default function SchultePage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <SchulteGame />
        </div>
    )
}
