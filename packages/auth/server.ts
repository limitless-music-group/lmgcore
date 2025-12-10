import { database } from "@packages/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    database: prismaAdapter(database, {
        provider: 'postgresql'
    }),
    trustedOrigins: [process.env.CORS_ORIGIN || ""],
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true
        }
    }
})