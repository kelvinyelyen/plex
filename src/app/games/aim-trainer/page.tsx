import { AimTrainerGame } from "@/games/aim-trainer/game"

export default function AimTrainerPage() {
    return (
        <div className="container flex flex-col items-center justify-start min-h-[calc(100vh-10rem)] pt-8 pb-8">
            <AimTrainerGame />
        </div>
    )
}
