import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/app/lib/prisma"
import Navbar from "@/app/components/Navbar"
import Link from "next/link"
import { Pencil, Printer, ChevronLeft } from "lucide-react"
import CardPreview from "@/app/components/CardPreview"

export const metadata = { title: "View Card" }

type Params = { params: Promise<{ id: string }> }

export default async function CardDetailPage({ params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const { id } = await params
  const userId = (session.user as { id: string }).id

  const card = await prisma.businessCard.findFirst({
    where: { id, userId, deletedAt: null },
    include: { frontTemplate: true, backTemplate: true },
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

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-slate-800">{card.fullName}</h1>
            <p className="text-sm text-slate-500">{card.position}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/cards/${card.id}/edit`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Pencil size={14} /> Edit
            </Link>
            <Link
              href={`/cards/${card.id}/print`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              <Printer size={14} /> Print / PDF
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-6">
          {/* Front + back preview side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2">Front — {card.frontTemplate.name}</p>
              <div className="rounded-xl overflow-hidden shadow border border-slate-100">
                <CardPreview svgFile={card.frontTemplate.svgFile} data={cardData} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2">Back — {card.backTemplate.name}</p>
              <div className="rounded-xl overflow-hidden shadow border border-slate-100">
                <CardPreview svgFile={card.backTemplate.svgFile} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-slate-100 pt-4">
            {[
              ["Full Name", card.fullName],
              ["Position", card.position],
              ["Division", card.division],
              ["Office", card.office],
              ["Address", card.address],
              ["Email", card.email],
              ["Phone", card.phone],
              ["Mobile", card.mobile],
              ["Website", card.website],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-slate-700 mt-0.5">{value}</p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}
