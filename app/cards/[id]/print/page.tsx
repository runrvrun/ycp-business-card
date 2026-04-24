import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/app/lib/prisma"
import PrintClient from "./PrintClient"

export const metadata = { title: "Print Card" }

type Params = { params: Promise<{ id: string }> }

export default async function PrintPage({ params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const { id } = await params
  const userId = (session.user as { id: string }).id

  const card = await prisma.businessCard.findFirst({
    where: { id, userId, deletedAt: null },
    include: { template: true },
  })
  if (!card) notFound()

  const cardData = {
    fullName: card.fullName,
    position: card.position,
    division: card.division ?? undefined,
    office: card.office ?? undefined,
    address: card.address ?? undefined,
    email: card.email ?? undefined,
    phone: card.phone ?? undefined,
    mobile: card.mobile ?? undefined,
    website: card.website ?? undefined,
  }

  return <PrintClient svgFile={card.template.svgFile} data={cardData} templateName={card.template.name} />
}
