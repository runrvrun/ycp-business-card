import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export const runtime = "nodejs"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const userId = (session.user as { id: string }).id

  const card = await prisma.businessCard.findFirst({
    where: { id, userId, deletedAt: null },
    include: { template: true },
  })

  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(card)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const userId = (session.user as { id: string }).id

  const existing = await prisma.businessCard.findFirst({
    where: { id, userId, deletedAt: null },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const { templateId, fullName, position, division, office, address, email, phone, mobile, website } = body

  const card = await prisma.businessCard.update({
    where: { id },
    data: {
      templateId: templateId ?? existing.templateId,
      fullName: fullName ?? existing.fullName,
      position: position ?? existing.position,
      division: division !== undefined ? division || null : existing.division,
      office: office !== undefined ? office || null : existing.office,
      address: address !== undefined ? address || null : existing.address,
      email: email !== undefined ? email || null : existing.email,
      phone: phone !== undefined ? phone || null : existing.phone,
      mobile: mobile !== undefined ? mobile || null : existing.mobile,
      website: website !== undefined ? website || null : existing.website,
    },
    include: { template: true },
  })

  return NextResponse.json(card)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const userId = (session.user as { id: string }).id

  const existing = await prisma.businessCard.findFirst({
    where: { id, userId, deletedAt: null },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.businessCard.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
