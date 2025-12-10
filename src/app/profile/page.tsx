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

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            scores: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    if (!user) {
        return <div>User not found</div>
    }

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-none border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-mono uppercase tracking-wider">Total Games Played</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">{user.scores.length}</div>
                    </CardContent>
                </Card>
                {/* Add more metrics as needed */}
            </div>
        </div>
    )
}
