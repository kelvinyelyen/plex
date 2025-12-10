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
        const { score, mode } = body // score is integer count. mode is string.

        // Standardize mode string for UI display
        const modeMap: Record<string, string> = {
            "standard": "Standard",
            "comparison": "Comparison",
            "divisibility": "Divisibility",
            "pattern": "Pattern",
            "advanced": "Advanced"
        }
        const difficultyLabel = modeMap[mode] || "Standard"

        const game = await prisma.game.upsert({
            where: { slug: "split-decision" },
            update: {},
            create: {
                name: "Split Decision",
                slug: "split-decision",
                description: "Rapid attention-switching cognitive test.",
            }
        })

        // High score logic (Higher is better)
        const existingScore = await prisma.score.findFirst({
            where: {
                userId: session.user.id,
                gameId: game.id,
                difficulty: difficultyLabel
            }
        })

        if (existingScore) {
            if (score > existingScore.score) {
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
                    difficulty: difficultyLabel
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[SPLIT_SCORE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
