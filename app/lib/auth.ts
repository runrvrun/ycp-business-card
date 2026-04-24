import { type AuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          scope: "openid profile email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "azure-ad") {
        if (!user.email) return false
        let existing = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, deletedAt: true },
        })
        if (existing?.deletedAt) return "/auth/error?error=UserNotFound"
        if (!existing) {
          existing = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
            },
            select: { id: true, deletedAt: true },
          })
        }
        ;(user as { id?: string }).id = existing.id
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? user.id
        token.role = (user as { role?: string }).role ?? "USER"
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        token.role = dbUser?.role ?? "USER"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        ;(session.user as { id?: string; role?: string }).id = token.id as string
        ;(session.user as { id?: string; role?: string }).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
}
