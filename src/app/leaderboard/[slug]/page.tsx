import { prisma } from "@/lib/prisma"
import { Score, User, Game, Prisma } from "@prisma/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function LeaderboardPage({ params, searchParams }: { params: { slug: string }, searchParams: { difficulty?: string } }) {
    const isTimeBased = params.slug === "sudoku" || params.slug === "conundra" || params.slug === "pulse-reaction" || params.slug === "schulte"
    const sortOrder = isTimeBased ? "asc" : "desc"
    const currentDifficulty = searchParams.difficulty



    const whereClause: Prisma.ScoreWhereInput = {
        game: {
            slug: params.slug
        }
    }

    if (currentDifficulty && currentDifficulty !== "All") {
        whereClause.difficulty = currentDifficulty
    }

    const scores = await prisma.score.findMany({
        take: 20,
        orderBy: {
            score: sortOrder,
        },
        include: {
            user: true,
            game: true,
        },
        where: whereClause
    })

    // Capitalize slug for display
    const gameName = params.slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

    // Determine available difficulties based on game type
    let difficulties: string[] = []

    if (params.slug === "memory-grid" || params.slug === "pulse-reaction" || params.slug === "chimp") {
        difficulties = []
    } else if (params.slug === "split-decision") {
        difficulties = ["All", "Standard", "Comparison", "Divisibility", "Pattern", "Advanced"]
    } else if (params.slug === "schulte") {
        difficulties = [
            "All",
            "digits-direct", "digits-reverse", "digits-random",
            "letters-direct", "letters-reverse", "letters-random",
            "gorbov"
        ]
    } else {
        difficulties = ["Easy", "Medium", "Hard", "Expert"]
    }

    return (
        <div className="container min-h-screen bg-background py-16">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-8 gap-8">
                    <div className="space-y-4">
                        <Link href="/leaderboard">
                            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary text-muted-foreground font-mono uppercase text-xs tracking-wider rounded-none">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Return to Archives
                            </Button>
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-mono font-bold uppercase tracking-tight">{gameName}</h1>
                        <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                            Top performance metrics for {gameName}.
                        </p>
                    </div>
                </div>

                {/* Difficulty Filter - Only show if there are difficulties */}
                {difficulties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {difficulties.map((diff) => (
                            <Link key={diff} href={diff === "All" ? `/leaderboard/${params.slug}` : `/leaderboard/${params.slug}?difficulty=${diff}`}>
                                <Button
                                    variant={(!currentDifficulty && diff === "All") || currentDifficulty === diff ? "default" : "outline"}
                                    className="rounded-none font-mono uppercase text-xs h-8 px-4 border-foreground/20 hover:border-foreground/50"
                                >
                                    {diff.includes('-') ? diff.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : diff}
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Leaderboard Table */}
                <div className="rounded-none border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-b border-border/50">
                                <TableHead className="w-[100px] uppercase tracking-wider text-muted-foreground font-mono text-xs h-12">Rank</TableHead>
                                <TableHead className="uppercase tracking-wider text-muted-foreground font-mono text-xs">User</TableHead>
                                <TableHead className="uppercase tracking-wider text-muted-foreground font-mono text-xs">
                                    {difficulties.length > 0 ? "Difficulty" : ""}
                                </TableHead>
                                <TableHead className="text-right uppercase tracking-wider text-muted-foreground font-mono text-xs">
                                    {isTimeBased ? (params.slug === "pulse-reaction" ? "Reaction Time" : "Time") : "Level"}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scores.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground font-mono text-sm uppercase tracking-widest">
                                        NO DATA FOUND
                                    </TableCell>
                                </TableRow>
                            ) : (
                                scores.map((score: Score & { user: User; game: Game }, index: number) => (
                                    <TableRow key={score.id} className="group hover:bg-muted/50 transition-colors border-b border-border/50">
                                        <TableCell className="font-mono font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 rounded-none border border-border/50">
                                                    <AvatarImage src={score.user.image || ""} />
                                                    <AvatarFallback className="bg-background text-xs font-mono rounded-none">{score.user.name?.[0] || score.user.username?.[0] || "U"}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium font-mono uppercase tracking-wider">{score.user.name || score.user.username || "Anonymous"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground uppercase font-mono tracking-wider">
                                            {difficulties.length > 0 ? (
                                                score.difficulty.includes('-')
                                                    ? score.difficulty.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                                    : score.difficulty
                                            ) : ""}
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-bold font-mono">
                                            {isTimeBased ? (() => {
                                                // Sudoku stores in seconds
                                                if (params.slug === "sudoku") {
                                                    return `${Math.floor(score.score / 60)}:${(score.score % 60).toString().padStart(2, '0')}`
                                                }
                                                // Schulte and others in ms (now including Pulse)
                                                // Schulte: mm:ss.SS

                                                const totalSeconds = Math.floor(score.score / 1000)
                                                const mins = Math.floor(totalSeconds / 60)
                                                const secs = totalSeconds % 60
                                                const ms = Math.floor((score.score % 1000) / 10) // show 2 digits for ms

                                                return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
                                            })() : score.score}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
