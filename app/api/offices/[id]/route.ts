import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export const runtime = "nodejs"

const OFFICE_ADMINS = ["arfian.agus@ycp.com", "david.ly@ycp.com"]

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!OFFICE_ADMINS.includes(session.user?.email ?? ""))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { name, address, phone, website } = await req.json()
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })

  const existing = await prisma.office.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const office = await prisma.office.update({
    where: { id },
    data: { name, address: address || null, phone: phone || null, website: website || null },
  })
  return NextResponse.json(office)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!OFFICE_ADMINS.includes(session.user?.email ?? ""))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const existing = await prisma.office.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.office.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
