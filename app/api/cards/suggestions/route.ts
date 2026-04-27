import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export const runtime = "nodejs"

const AUTOCOMPLETE_FIELDS = ["position", "division", "office", "address", "email", "email2", "phone", "mobile", "whatsapp", "website"] as const

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id

  const cards = await prisma.businessCard.findMany({
    where: { userId, deletedAt: null },
    select: {
      position: true,
      division: true,
      office: true,
      address: true,
      email: true,
      email2: true,
      phone: true,
      mobile: true,
      whatsapp: true,
      website: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const suggestions: Record<string, string[]> = {}
  for (const field of AUTOCOMPLETE_FIELDS) {
    const seen = new Set<string>()
    for (const card of cards) {
      const val = card[field]
      if (val && !seen.has(val)) {
        seen.add(val)
      }
    }
    suggestions[field] = [...seen]
  }

  return NextResponse.json(suggestions)
}
