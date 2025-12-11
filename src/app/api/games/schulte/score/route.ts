import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

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
        where: { slug: "schulte" },
        update: {},
        create: {
            name: "Schulte Table",
            slug: "schulte",
            description: "Focus Training",
        },
    })

    // Create score
    // Check for existing score
    const existingScore = await prisma.score.findFirst({
        where: {
            userId: user.id,
            gameId: game.id,
            difficulty: difficulty,
        },
    })

    let finalScore;

    if (existingScore) {
        // Lower score (time in ms) is better
        if (parseInt(score) < existingScore.score) {
            finalScore = await prisma.score.update({
                where: { id: existingScore.id },
                data: { score: parseInt(score) },
            })
        } else {
            finalScore = existingScore
        }
    } else {
        finalScore = await prisma.score.create({
            data: {
                userId: user.id,
                gameId: game.id,
                score: parseInt(score),
                difficulty,
            },
        })
    }

    return NextResponse.json(finalScore)
}
