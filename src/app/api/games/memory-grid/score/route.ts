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

        await prisma.score.create({
            data: {
                userId: session.user.id,
                gameId: game.id,
                score: score,
                difficulty: "Normal", // Memory Grid doesn't have difficulty selection yet, just progressive levels
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[MEMORY_GRID_SCORE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
