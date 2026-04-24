"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteCardButton({ cardId }: { cardId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Delete this business card?")) return
    setLoading(true)
    await fetch(`/api/cards/${cardId}`, { method: "DELETE" })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-red-400 text-xs font-medium hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
      title="Delete card"
    >
      <Trash2 size={13} />
    </button>
  )
}
