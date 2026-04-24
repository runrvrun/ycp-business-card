import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/app/lib/prisma"
import Navbar from "@/app/components/Navbar"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import EditCardClient from "./EditCardClient"

export const metadata = { title: "Edit Card" }

type Params = { params: Promise<{ id: string }> }

export default async function EditCardPage({ params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const { id } = await params
  const userId = (session.user as { id: string }).id

  const [card, templates] = await Promise.all([
    prisma.businessCard.findFirst({
      where: { id, userId, deletedAt: null },
      include: { template: true },
    }),
    prisma.template.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  if (!card) notFound()

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/cards/${card.id}`}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">Edit Card</h1>
        </div>
        <EditCardClient card={card} templates={templates} />
      </main>
    </div>
  )
}
