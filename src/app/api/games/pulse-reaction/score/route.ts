import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { score } = body // Average deviation in ms

        if (typeof score !== "number") {
            return new NextResponse("Invalid score", { status: 400 })
        }

        // Ensure the game exists in the database
        const game = await prisma.game.upsert({
            where: { slug: "pulse-reaction" },
            update: {},
            create: {
                name: "Pulse Reaction",
                slug: "pulse-reaction",
                description: "Cognitive latency test.",
            }
        })

        // Best score logic (Lower is better for latency)
        // Find existing score
        const existingScore = await prisma.score.findFirst({
            where: {
                userId: session.user.id,
                gameId: game.id,
                // No difficulty for this game
            }
        })

        if (existingScore) {
            if (score < existingScore.score) {
                await prisma.score.update({
                    where: { id: existingScore.id },
                    data: { score, createdAt: new Date() }
                })
            }
        } else {
            await prisma.score.create({
                data: {
                    userId: session.user.id,
                    gameId: game.id,
                    score,
                    difficulty: "Normal"
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[PULSE_SCORE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
