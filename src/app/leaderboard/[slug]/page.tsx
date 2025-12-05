import { prisma } from "@/lib/prisma"
import { Score, User, Game } from "@prisma/client"
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

export default async function LeaderboardPage({ params }: { params: { slug: string } }) {
    const isTimeBased = params.slug === "sudoku" || params.slug === "conundra"
    const sortOrder = isTimeBased ? "asc" : "desc"

    const scores = await prisma.score.findMany({
        take: 20,
        orderBy: {
            score: sortOrder,
        },
        include: {
            user: true,
            game: true,
        },
        where: {
            game: {
                slug: params.slug
            }
        }
    })

    // Capitalize slug for display
    const gameName = params.slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

    return (
        <div className="min-h-screen bg-background py-16 px-8 md:px-16">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex items-end justify-between border-b pb-8">
                    <div className="space-y-4">
                        <Link href="/leaderboard">
                            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary text-muted-foreground">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Archives
                            </Button>
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{gameName}</h1>
                        <p className="text-muted-foreground max-w-md">
                            Top performance metrics for {gameName}.
                        </p>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[100px] uppercase tracking-wider text-muted-foreground">Rank</TableHead>
                                <TableHead className="uppercase tracking-wider text-muted-foreground">User</TableHead>
                                <TableHead className="uppercase tracking-wider text-muted-foreground">Difficulty</TableHead>
                                <TableHead className="text-right uppercase tracking-wider text-muted-foreground">
                                    {isTimeBased ? "Time" : "Level"}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scores.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                                        No data found. Be the first to log a score!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                scores.map((score: Score & { user: User; game: Game }, index: number) => (
                                    <TableRow key={score.id} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border">
                                                    <AvatarImage src={score.user.image || ""} />
                                                    <AvatarFallback className="bg-background text-xs">{score.user.name?.[0] || score.user.username?.[0] || "U"}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{score.user.name || score.user.username || "Anonymous"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground uppercase">{score.difficulty}</TableCell>
                                        <TableCell className="text-right text-sm font-bold">
                                            {isTimeBased
                                                ? `${Math.floor(score.score / 60)}:${(score.score % 60).toString().padStart(2, '0')}`
                                                : score.score
                                            }
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
