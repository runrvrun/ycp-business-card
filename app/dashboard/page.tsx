import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/app/lib/prisma"
import Navbar from "@/app/components/Navbar"
import Link from "next/link"
import { Plus, CreditCard, Pencil, Printer } from "lucide-react"
import DeleteCardButton from "@/app/components/DeleteCardButton"

export const metadata = { title: "My Cards" }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const userId = (session.user as { id: string }).id

  const cards = await prisma.businessCard.findMany({
    where: { userId, deletedAt: null },
    include: { frontTemplate: true, backTemplate: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">My Business Cards</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {cards.length} card{cards.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          <Link
            href="/cards/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#001C44] text-white text-sm font-medium hover:bg-[#001533] transition-colors"
          >
            <Plus size={16} />
            New Card
          </Link>
        </div>

        {cards.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <CreditCard size={28} className="text-slate-400" />
            </div>
            <div>
              <p className="font-medium text-slate-700">No cards yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Create your first business card to get started.
              </p>
            </div>
            <Link
              href="/cards/new"
              className="px-5 py-2 rounded-lg bg-[#001C44] text-white text-sm font-medium hover:bg-[#001533] transition-colors"
            >
              Create Card
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Template colour strip */}
                <div className="h-1.5 bg-[#001C44]" />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{card.fullName}</p>
                      <p className="text-sm text-slate-500 truncate">{card.position}</p>
                    </div>
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      {card.frontTemplate.name}
                    </span>
                  </div>

                  {card.office && (
                    <p className="text-xs text-slate-400 mb-3">{card.office}</p>
                  )}

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Link
                      href={`/cards/${card.id}/print`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 transition-colors"
                    >
                      <Printer size={13} />
                      Print / PDF
                    </Link>
                    <Link
                      href={`/cards/${card.id}/edit`}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      <Pencil size={13} />
                      Edit
                    </Link>
                    <DeleteCardButton cardId={card.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
