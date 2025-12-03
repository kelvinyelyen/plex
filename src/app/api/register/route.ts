import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import * as z from "zod"

const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, username, password } = userSchema.parse(body)

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        })

        if (existingEmail) {
            return NextResponse.json(
                { user: null, message: "User with this email already exists" },
                { status: 409 }
            )
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUsername) {
            return NextResponse.json(
                { user: null, message: "User with this username already exists" },
                { status: 409 }
            )
        }

        const hashedPassword = await hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...rest } = newUser

        return NextResponse.json(
            { user: rest, message: "User created successfully" },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { user: null, message: error.issues[0].message },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { user: null, message: "Something went wrong" },
            { status: 500 }
        )
    }
}
