import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        <div className="container mx-auto py-10 space-y-8">
            <Card className="rounded-none border-border/50">
                <CardHeader>
                    <CardTitle className="font-mono uppercase text-2xl tracking-tight">Profile</CardTitle>
                    <CardDescription className="text-xs">Manage your account settings and view your performance.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20 rounded-none border border-foreground/20">
                        <AvatarImage src={user.image || ""} alt={user.username || user.name || ""} />
                        <AvatarFallback className="rounded-none font-mono text-xl">{user.username?.[0] || user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold font-mono tracking-tight">{user.username || user.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{user.email}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-mono font-bold uppercase tracking-tight">Game Performance</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-none border-border/50 bg-muted/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium font-mono uppercase tracking-wider text-muted-foreground">Total Games</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold font-mono text-primary">{allUserScores.length}</div>
                        </CardContent>
                    </Card>

                    {validMetrics.map((gm) => (
                        <Card key={gm.game.id} className="rounded-none border-border/50 hover:border-primary/50 transition-colors group relative overflow-hidden flex flex-col">
                            <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base font-bold font-mono uppercase tracking-wider">{gm.game.name}</CardTitle>
                                    <a href={`/games/${gm.game.slug}`} className="text-xs font-mono uppercase tracking-widest text-primary hover:underline">
                                        Play &rarr;
                                    </a>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <div className="divide-y divide-border/50">
                                    {gm.metrics.map((m) => (
                                        <div key={m.difficulty} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-xs uppercase tracking-widest font-mono text-muted-foreground w-32">
                                                    {m.difficulty.includes('-') ? m.difficulty.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : m.difficulty}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold font-mono">
                                                        {m.isTimeBased ? (() => {
                                                            let msValue = m.bestScore
                                                            if (gm.game.slug === "sudoku" || gm.game.slug === "conundra") {
                                                                msValue = m.bestScore * 1000
                                                            }
                                                            if (gm.game.slug === "pulse-reaction") {
                                                                return `${msValue}ms`
                                                            }
                                                            const minutes = Math.floor(msValue / 60000)
                                                            const seconds = Math.floor((msValue % 60000) / 1000)
                                                            if (minutes > 0) return `${minutes}min ${seconds}s`
                                                            return `${seconds}s`
                                                        })() : m.bestScore}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-none">
                                                    Rank #{m.rank}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground italic text-right max-w-[140px] truncate">
                                                    {m.rank === 1 ? "Champion!" : m.rank <= 10 ? "Top 10!" : "Keep pushing!"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

