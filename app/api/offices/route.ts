import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(offices)
}

const OFFICE_ADMINS = ["arfian.agus@ycp.com", "david.ly@ycp.com"]

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!OFFICE_ADMINS.includes(session.user?.email ?? ""))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { name, address, phone, website } = await req.json()
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })

  const office = await prisma.office.create({
    data: { name, address: address || null, phone: phone || null, website: website || null },
  })
  return NextResponse.json(office, { status: 201 })
}
