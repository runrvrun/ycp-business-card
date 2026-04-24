import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id

  const cards = await prisma.businessCard.findMany({
    where: { userId, deletedAt: null },
    include: { frontTemplate: true, backTemplate: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(cards)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const body = await req.json()

  const { frontTemplateId, backTemplateId, fullName, position, division, office, address, email, phone, mobile, website } = body

  if (!frontTemplateId || !backTemplateId || !fullName || !position) {
    return NextResponse.json(
      { error: "frontTemplateId, backTemplateId, fullName, and position are required" },
      { status: 400 }
    )
  }

  const card = await prisma.businessCard.create({
    data: {
      userId,
      frontTemplateId,
      backTemplateId,
      fullName,
      position,
      division: division || null,
      office: office || null,
      address: address || null,
      email: email || null,
      phone: phone || null,
      mobile: mobile || null,
      website: website || null,
    },
    include: { frontTemplate: true, backTemplate: true },
  })

  return NextResponse.json(card, { status: 201 })
}
