import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const allGames = await prisma.game.findMany()
    const allUserScores = await prisma.score.findMany({
        where: { userId: session.user.id },
        include: { game: true }
    })

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })

    if (!user) {
        return <div>User not found</div>
    }

    // Process scores to find best per game/difficulty
    const gameMetrics = await Promise.all(allGames.map(async (game) => {
        const gameScores = allUserScores.filter(s => s.gameId === game.id)
        if (gameScores.length === 0) return null

        // Group by difficulty
        const difficulties = Array.from(new Set(gameScores.map(s => s.difficulty)))

        const difficultyMetrics = await Promise.all(difficulties.map(async (difficulty) => {
            const scoresForDiff = gameScores.filter(s => s.difficulty === difficulty)

            // Determine best score logic
            const isTimeBased = ["sudoku", "conundra", "pulse-reaction", "schulte"].includes(game.slug)

            const bestScoreFn = (a: number, b: number) => isTimeBased ? a - b : b - a
            const bestScoreVal = scoresForDiff.map(s => s.score).sort(bestScoreFn)[0]

            // Calculate Rank
            // Rank = count of global scores better than this score + 1
            const betterScoresCount = await prisma.score.count({
                where: {
                    gameId: game.id,
                    difficulty: difficulty,
                    score: isTimeBased ? { lt: bestScoreVal } : { gt: bestScoreVal }
                }
            })
            const rank = betterScoresCount + 1

            return {
                difficulty,
                bestScore: bestScoreVal,
                rank,
                isTimeBased
            }
        }))

        return {
            game,
            metrics: difficultyMetrics
        }
    }))

    const validMetrics = gameMetrics.filter((m): m is NonNullable<typeof m> => m !== null)

    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-mono font-bold uppercase tracking-tighter">Profile</h1>
                <p className="text-muted-foreground text-sm">Manage your account and view performance.</p>
            </div>

            <hr className="border-border" />

            <div className="space-y-6">
                <section className="space-y-4">
                    <h2 className="text-lg font-bold font-mono uppercase tracking-wider">User Details</h2>
                    <div className="flex items-center space-x-4 p-4 border rounded-lg bg-card">
                        <Avatar className="h-16 w-16 border border-foreground/10">
                            <AvatarImage src={user.image || ""} alt={user.username || user.name || ""} />
                            <AvatarFallback className="font-mono text-lg">{user.username?.[0] || user.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold font-mono tracking-tight">{user.username || user.name}</h3>
                            <p className="text-sm text-muted-foreground font-mono">{user.email}</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold font-mono uppercase tracking-wider">Performance</h2>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Total Games Stat */}
                        <div className="p-4 border rounded-lg bg-card flex flex-col justify-between h-full">
                            <span className="text-xs font-medium font-mono uppercase tracking-wider text-muted-foreground">Total Games Played</span>
                            <div className="text-4xl font-bold font-mono text-primary mt-2">{allUserScores.length}</div>
                        </div>

                        {validMetrics.map((gm) => (
                            <div key={gm.game.id} className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors flex flex-col justify-between group">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold font-mono uppercase tracking-wider">{gm.game.name}</span>
                                    <a href={`/games/${gm.game.slug}`} className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                        Play &rarr;
                                    </a>
                                </div>

                                <div className="space-y-3">
                                    {gm.metrics.map((m) => (
                                        <div key={m.difficulty} className="flex items-center justify-between text-sm">
                                            <span className="text-xs uppercase tracking-wider font-mono text-muted-foreground">
                                                {m.difficulty}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-bold">
                                                    {m.isTimeBased ? (() => {
                                                        let msValue = m.bestScore
                                                        // Handle specific game conversions if needed, assuming logic from before was correct for stored values
                                                        if (gm.game.slug === "sudoku" || gm.game.slug === "conundra") {
                                                            msValue = m.bestScore * 1000
                                                        }
                                                        if (gm.game.slug === "pulse-reaction") {
                                                            return `${msValue}ms`
                                                        }
                                                        const minutes = Math.floor(msValue / 60000)
                                                        const seconds = Math.floor((msValue % 60000) / 1000)
                                                        if (minutes > 0) return `${minutes}m ${seconds}s`
                                                        return `${seconds}s`
                                                    })() : m.bestScore}
                                                </span>
                                                <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                                                    #{m.rank}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

