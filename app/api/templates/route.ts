import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const type = req.nextUrl.searchParams.get("type") as "FRONT" | "BACK" | null

  const templates = await prisma.template.findMany({
    where: {
      isActive: true,
      ...(type ? { type } : {}),
    },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(templates)
}
