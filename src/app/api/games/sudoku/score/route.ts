import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { score, difficulty } = await req.json()

    // Find user
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        return new NextResponse("User not found", { status: 404 })
    }

    // Find or create game
    const game = await prisma.game.upsert({
        where: { slug: "sudoku" },
        update: {},
        create: {
            name: "Sudoku",
            slug: "sudoku",
            description: "Classic Sudoku puzzle game",
        },
    })

    // Create score
    const newScore = await prisma.score.create({
        data: {
            userId: user.id,
            gameId: game.id,
            score: parseInt(score),
            difficulty,
        },
    })

    return NextResponse.json(newScore)
}
