import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/app/lib/prisma"
import Navbar from "@/app/components/Navbar"
import NewCardClient from "./NewCardClient"

export const metadata = { title: "New Card" }

export default async function NewCardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/")

  const [frontTemplates, backTemplates, offices] = await Promise.all([
    prisma.template.findMany({ where: { isActive: true, type: "FRONT" }, orderBy: { sortOrder: "asc" } }),
    prisma.template.findMany({ where: { isActive: true, type: "BACK" }, orderBy: { sortOrder: "asc" } }),
    prisma.office.findMany({ orderBy: { name: "asc" } }),
  ])

  const defaultData = {
    fullName: session.user?.name ?? "",
    position: "",
    email: session.user?.email ?? "",
    division: "",
    office: "",
    address: "",
    phone: "",
    mobile: "",
    website: "",
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">New Business Card</h1>
          <p className="text-sm text-slate-500 mt-0.5">Choose designs and fill in your details</p>
        </div>
        <NewCardClient frontTemplates={frontTemplates} backTemplates={backTemplates} offices={offices} defaultData={defaultData} />
      </main>
    </div>
  )
}
