import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { state, difficulty, timer } = await req.json()

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

    // Find existing session or create new
    // For simplicity, we'll assume one active session per game per user for now
    // Or we could pass a session ID.
    // Let's just create/update the latest session.

    const existingSession = await prisma.gameSession.findFirst({
        where: {
            userId: user.id,
            gameId: game.id,
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    let gameSession
    if (existingSession) {
        gameSession = await prisma.gameSession.update({
            where: { id: existingSession.id },
            data: {
                state: JSON.stringify(state),
                difficulty,
                timer,
            },
        })
    } else {
        gameSession = await prisma.gameSession.create({
            data: {
                userId: user.id,
                gameId: game.id,
                state: JSON.stringify(state),
                difficulty,
                timer,
            },
        })
    }

    return NextResponse.json(gameSession)
}
