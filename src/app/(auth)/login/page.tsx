import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default function LoginPage() {
    return (
        <>
            <Card className="border-none shadow-none sm:border sm:shadow-sm">
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserAuthForm mode="login" />
                    </Suspense>
                </CardContent>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground w-full">
                        <Link
                            href="/register"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Don&apos;t have an account? Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </>
    )
}
