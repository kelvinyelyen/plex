import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

let authConfig;
try {
    authConfig = NextAuth({
        adapter: PrismaAdapter(prisma),
        providers: [
            Google,
            Credentials({
                credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
                },
                authorize: async () => {
                    // Add logic here to look up the user from the credentials supplied
                    // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
                    // if (user) {
                    //   return user
                    // } else {
                    //   return null
                    // }
                    return null
                },
            }),
        ],
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
