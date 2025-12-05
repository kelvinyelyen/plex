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
        const { score, difficulty, moves } = scoreSchema.parse(body)

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

        await prisma.score.create({
            data: {
                userId: session.user.id,
                gameId: game.id,
                score: score, // Time in seconds
                difficulty,
                // Metadata is not in schema, so we can't save moves unless we add it to schema or ignore it.
                // The schema showed: score Int, difficulty String. No metadata.
                // We'll just save score and difficulty for now.
            },
        })

        return new Response("OK")
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
