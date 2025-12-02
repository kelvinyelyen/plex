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

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Game</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No scores yet. Be the first to play!
                                </TableCell>
                            </TableRow>
                        ) : (
                            scores.map((score: Score & { user: User; game: Game }, index: number) => (
                                <TableRow key={score.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={score.user.image || ""} />
                                            <AvatarFallback>{score.user.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        {score.user.name || "Anonymous"}
                                    </TableCell>
                                    <TableCell>{score.game.name}</TableCell>
                                    <TableCell>{score.difficulty}</TableCell>
                                    <TableCell className="text-right">
                                        {Math.floor(score.score / 60)}:{(score.score % 60).toString().padStart(2, '0')}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
