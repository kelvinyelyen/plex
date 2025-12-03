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
    const scores = await prisma.score.findMany({
        take: 20,
        orderBy: {
            score: "asc", // Lower time is better
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
    const gameName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

    return (
        <div className="min-h-screen bg-background py-16 px-8 md:px-16">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex items-end justify-between border-b border-foreground/10 pb-8">
                    <div className="space-y-4">
                        <Link href="/leaderboard">
                            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary font-mono text-xs text-muted-foreground">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                BACK_TO_ARCHIVES
                            </Button>
                        </Link>
                        <h1 className="font-display italic text-5xl md:text-7xl">{gameName}</h1>
                        <p className="font-mono text-sm text-muted-foreground max-w-md">
                            {"// RANKING_DATA"} <br />
                            Top percentile performance metrics for {gameName} protocol.
                        </p>
                    </div>
                    <div className="hidden md:block font-mono text-xs text-muted-foreground text-right">
                        <span>NET.STATUS: ONLINE</span> <br />
                        <span>SYNC_RATE: 100%</span>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="rounded-md border border-foreground/10 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-foreground/5">
                            <TableRow className="hover:bg-transparent border-foreground/10">
                                <TableHead className="w-[100px] font-mono text-xs uppercase tracking-wider text-muted-foreground">Rank</TableHead>
                                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">User</TableHead>
                                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Difficulty</TableHead>
                                <TableHead className="text-right font-mono text-xs uppercase tracking-wider text-muted-foreground">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scores.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground font-mono text-sm">
                                        NO_DATA_FOUND :: BE THE FIRST TO LOG A SCORE
                                    </TableCell>
                                </TableRow>
                            ) : (
                                scores.map((score: Score & { user: User; game: Game }, index: number) => (
                                    <TableRow key={score.id} className="group hover:bg-foreground/5 border-foreground/10 transition-colors">
                                        <TableCell className="font-mono font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-foreground/10">
                                                    <AvatarImage src={score.user.image || ""} />
                                                    <AvatarFallback className="bg-background text-xs font-mono">{score.user.name?.[0] || score.user.username?.[0] || "U"}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-mono text-sm">{score.user.name || score.user.username || "Anonymous"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-muted-foreground uppercase">{score.difficulty}</TableCell>
                                        <TableCell className="text-right font-mono text-sm font-bold">
                                            {Math.floor(score.score / 60)}:{(score.score % 60).toString().padStart(2, '0')}
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
