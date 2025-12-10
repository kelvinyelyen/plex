"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

interface UserNavProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export function UserNav({ user }: UserNavProps) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <div className="relative h-8 flex items-center gap-2 rounded-full cursor-pointer hover:bg-muted/50 transition-colors pl-0 pr-2 md:pl-0 md:pr-0">
                    <Avatar className="h-8 w-8 ring-1 ring-border/50">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block font-medium font-mono text-xs uppercase tracking-wider pr-2">{user.name}</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <a href="/profile" className="w-full cursor-pointer">
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <a href="/leaderboard" className="w-full cursor-pointer">
                            Metrics
                            <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                        </a>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
