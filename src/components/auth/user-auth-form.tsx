"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

const userAuthSchema = z.object({
    username: z.string().min(3).optional(),
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
})

type FormData = z.infer<typeof userAuthSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    mode?: "login" | "register"
}

export function UserAuthForm({ className, mode = "login", ...props }: UserAuthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userAuthSchema),
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    async function onSubmit(data: FormData) {
        setIsLoading(true)

        if (mode === "register") {
            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: data.username,
                        email: data.email.toLowerCase(),
                        password: data.password,
                    }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.message)
                }

                toast.success("Account created successfully. Please log in.")
                router.push("/login")

            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error("Something went wrong")
                }
            } finally {
                setIsLoading(false)
            }
        } else {
            try {
                const signInResult = await signIn("credentials", {
                    email: data.email.toLowerCase(),
                    password: data.password,
                    redirect: false,
                    callbackUrl: searchParams?.get("from") || "/",
                })

                console.log("Sign in result:", signInResult)

                if (signInResult?.error) {
                    if (signInResult.error === "CredentialsSignin") {
                        toast.error("Invalid email or password")
                    } else {
                        toast.error("Your sign in request failed. Please try again.")
                    }
                    return
                }

                toast.success("Logged in successfully")
                router.refresh()
                router.push("/")
            } catch (error) {
                console.error("Login error:", error)
                toast.error("Something went wrong during sign in")
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    {mode === "register" && (
                        <div className="grid gap-1 space-y-2 mb-2">
                            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground" htmlFor="username">
                                Username
                            </Label>
                            <Input
                                id="username"
                                placeholder="USERNAME"
                                type="text"
                                autoCapitalize="none"
                                autoCorrect="off"
                                disabled={isLoading || isGoogleLoading}
                                className="rounded-none font-mono placeholder:text-muted-foreground/50"
                                {...register("username")}
                            />
                            {errors?.username && (
                                <p className="px-1 text-xs text-red-600 font-mono">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="grid gap-1 space-y-2 mb-2">
                        <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="NAME@EXAMPLE.COM"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading || isGoogleLoading}
                            className="font-mono placeholder:text-muted-foreground/50"
                            {...register("email")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600 font-mono">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-1 space-y-2 mb-4">
                        <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="PASSWORD"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading || isGoogleLoading}
                            className="font-mono placeholder:text-muted-foreground/50"
                            {...register("password")}
                        />
                        {errors?.password && (
                            <p className="px-1 text-xs text-red-600 font-mono">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <Button disabled={isLoading} className="font-mono uppercase tracking-wider text-xs h-10">
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {mode === "register" ? "Sign Up with Email" : "Sign In with Email"}
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-mono text-[10px] tracking-widest">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button
                variant="outline"
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => {
                    setIsGoogleLoading(true)
                    signIn("google")
                }}
                className="font-mono uppercase tracking-wider text-xs h-10"
            >
                {isGoogleLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
        </div>
    )
}
