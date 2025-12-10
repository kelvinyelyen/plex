import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const scoreSchema = z.object({
    score: z.number(),
    difficulty: z.string(),
    moves: z.number(),
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { score, difficulty } = scoreSchema.parse(body)

        // Ensure Game record exists
        const game = await prisma.game.upsert({
            where: { slug: "conundra" },
            update: {},
            create: {
                name: "Conundra",
                slug: "conundra",
                description: "Arithmetic puzzle challenge."
            }
        })

        // Check for existing score
        const existingScore = await prisma.score.findFirst({
            where: {
                userId: session.user.id,
                gameId: game.id,
                difficulty: difficulty
            }
        })

        if (existingScore) {
            // Only update if new score is lower (better)
            if (score < existingScore.score) {
                await prisma.score.update({
                    where: { id: existingScore.id },
                    data: {
                        score: score,
                        // We could also update moves if we were storing them, but schema limits us.
                        createdAt: new Date() // Update timestamp
                    }
                })
            }
            // If new score is not better, do nothing (or return success without update)
        } else {
            // Create new score
            await prisma.score.create({
                data: {
                    userId: session.user.id,
                    gameId: game.id,
                    score: score, // Time in seconds
                    difficulty,
                },
            })
        }

        return new Response("OK")
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
