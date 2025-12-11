
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { score } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const game = await prisma.game.findUnique({
            where: { slug: "chimp" }
        })

        if (!game) {
            return new NextResponse("Game not found", { status: 404 })
        }

        // Check if score exists
        const existingScore = await prisma.score.findFirst({
            where: {
                userId: user.id,
                gameId: game.id
            }
        })

        if (existingScore) {
            // Update if higher (Chimp is score based, so higher is better)
            if (score > existingScore.score) {
                const updated = await prisma.score.update({
                    where: { id: existingScore.id },
                    data: { score }
                })
                return NextResponse.json(updated)
            }
            return NextResponse.json(existingScore)
        }

        // Create new score
        const newScore = await prisma.score.create({
            data: {
                userId: user.id,
                gameId: game.id,
                score,
                difficulty: "Standard" // No difficulty levels for Chimp
            }
        })

        return NextResponse.json(newScore)

    } catch (error) {
        console.error("Error saving score:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
