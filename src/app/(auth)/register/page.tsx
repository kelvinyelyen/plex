import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { UserAuthForm } from "@/components/auth/user-auth-form"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Create an account",
    description: "Create an account to get started",
}

export default function RegisterPage() {
    return (
        <>
            <Card className="border-none shadow-none sm:border-border/50 sm:shadow-sm rounded-none w-full">
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserAuthForm mode="register" />
                    </Suspense>
                </CardContent>
                <CardFooter>
                    <p className="text-center text-xs text-muted-foreground w-full">
                        <Link
                            href="/login"
                            className="hover:text-primary transition-colors"
                        >
                            Already have an account? Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </>
    )
}
