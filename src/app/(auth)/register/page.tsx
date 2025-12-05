import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Create an account",
    description: "Create an account to get started",
}

export default function RegisterPage() {
    return (
        <>
            <Card className="border-none shadow-none sm:border sm:shadow-sm">
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserAuthForm mode="register" />
                    </Suspense>
                </CardContent>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground w-full">
                        <Link
                            href="/login"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Already have an account? Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </>
    )
}
