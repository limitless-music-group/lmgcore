import { database } from "@packages/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    appName: "LMG Core",
    emailAndPassword: { enabled: true },
    user: {
        additionalFields: {
            role: {
                type: "string" as unknown as ["user", "admin"],
                required: true,
                defaultValue: "user",
                input: false
            },
        },
    },
    plugins: [nextCookies()],
    database: prismaAdapter(database, { provider: "postgresql" })
})