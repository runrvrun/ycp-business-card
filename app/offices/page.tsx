import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/app/lib/prisma"
import Navbar from "@/app/components/Navbar"
import OfficeManager from "./OfficeManager"

export const metadata = { title: "Offices" }

export default async function OfficesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const offices = await prisma.office.findMany({ orderBy: { name: "asc" } })

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Offices</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage office details that can be reused when creating business cards.
          </p>
        </div>
        <OfficeManager initialOffices={offices} />
      </main>
    </div>
  )
}
