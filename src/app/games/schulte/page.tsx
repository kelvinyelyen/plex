import { SchulteGame } from "@/games/schulte/game"

export default function SchultePage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <SchulteGame />
        </div>
    )
}
