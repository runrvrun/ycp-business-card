"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { LogOut, CreditCard, Plus, Building2 } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-800">
          <div className="w-7 h-7 rounded bg-[#c0272d] flex items-center justify-center">
            <span className="text-white text-xs font-bold">YCP</span>
          </div>
          <span className="text-sm hidden sm:block">Business Card</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/cards/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c0272d] text-white text-sm font-medium hover:bg-[#a8222a] transition-colors"
          >
            <Plus size={15} />
            New Card
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition-colors"
          >
            <CreditCard size={15} />
            <span className="hidden sm:block">My Cards</span>
          </Link>

          <Link
            href="/offices"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition-colors"
          >
            <Building2 size={15} />
            <span className="hidden sm:block">Offices</span>
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            {session?.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="w-7 h-7 rounded-full object-cover"
              />
            )}
            <span className="text-sm text-slate-600 hidden sm:block max-w-32 truncate">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
