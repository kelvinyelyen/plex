import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import * as z from "zod"

let authConfig;
try {
    authConfig = NextAuth({
        adapter: PrismaAdapter(prisma),
        session: { strategy: "jwt" },
        trustHost: true,
        providers: [
            Google,
            Credentials({
                credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
                },
                authorize: async (credentials) => {
                    const signInSchema = z.object({
                        email: z.string().email(),
                        password: z.string().min(1)
                    });

                    const parsedCredentials = signInSchema.safeParse(credentials);

                    if (!parsedCredentials.success) {
                        console.log("Invalid credentials format");
                        return null;
                    }

                    const { email, password } = parsedCredentials.data;

                    const user = await prisma.user.findUnique({
                        where: {
                            email: email
                        }
                    })

                    if (!user || !user.password) {
                        console.log("User not found or no password")
                        return null
                    }

                    const isPasswordValid = await compare(
                        password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        console.log("Invalid password")
                        return null
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.username,
                        image: user.image,
                    }
                },
            }),
        ],
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    token.id = user.id
                    token.username = user.name
                }
                return token
            },
            async session({ session, token }) {
                if (token && session.user) {
                    session.user.id = token.id as string
                    session.user.name = token.username as string
                }
                return session
            }
        }
    })
} catch {
    console.warn("NextAuth initialization failed (likely due to missing env vars during build). Using mock handlers.")
    authConfig = {
        handlers: { GET: () => { }, POST: () => { } },
        auth: () => { },
        signIn: () => { },
        signOut: () => { },
    } as unknown as ReturnType<typeof NextAuth>
}

export const { handlers, auth, signIn, signOut } = authConfig
