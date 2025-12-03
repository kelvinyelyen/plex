import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/auth/user-auth-form"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default function LoginPage() {
    return (
        <>
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute right-4 top-4 md:right-8 md:top-8"
                )}
            >
                Back to Home
            </Link>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <UserAuthForm mode="login" />
            </Suspense>
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/register"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Don&apos;t have an account? Sign Up
                </Link>
            </p>
        </>
    )
}
