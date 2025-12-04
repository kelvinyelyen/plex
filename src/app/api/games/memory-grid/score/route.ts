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
        const { score } = body

        if (typeof score !== "number") {
            return new NextResponse("Invalid score", { status: 400 })
        }

        // Ensure the game exists in the database
        let game = await prisma.game.findUnique({
            where: { slug: "memory-grid" },
        })

        if (!game) {
            game = await prisma.game.create({
                data: {
                    name: "Memory Grid",
                    slug: "memory-grid",
                    description: "Visual Pattern Recall Game",
                },
            })
        }

        // Find ALL existing scores for this user and game
        const existingScores = await prisma.score.findMany({
            where: {
                userId: session.user.id,
                gameId: game.id,
            },
            orderBy: {
                score: 'desc'
            }
        })

        if (existingScores.length > 0) {
            // Determine the best score among existing and new
            const currentBest = existingScores[0].score
            const newBest = Math.max(currentBest, score)

            // Update the first record to the new best score
            await prisma.score.update({
                where: { id: existingScores[0].id },
                data: { score: newBest },
            })

            // Delete any other duplicate records if they exist
            if (existingScores.length > 1) {
                const idsToDelete = existingScores.slice(1).map(s => s.id)
                await prisma.score.deleteMany({
                    where: {
                        id: { in: idsToDelete }
                    }
                })
            }
        } else {
            await prisma.score.create({
                data: {
                    userId: session.user.id,
                    gameId: game.id,
                    score: score,
                    difficulty: "Normal",
                },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[MEMORY_GRID_SCORE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
