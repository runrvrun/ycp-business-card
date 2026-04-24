"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TemplateSelector, { Template } from "@/app/components/TemplateSelector"
import CardForm from "@/app/components/CardForm"
import CardPreview, { CardData } from "@/app/components/CardPreview"
import { Save } from "lucide-react"

interface CardRecord {
  id: string
  fullName: string
  position: string
  division: string | null
  office: string | null
  address: string | null
  email: string | null
  phone: string | null
  mobile: string | null
  website: string | null
  template: Template
}

interface Props {
  card: CardRecord
  templates: Template[]
}

export default function EditCardClient({ card, templates }: Props) {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(card.template)
  const [cardData, setCardData] = useState<CardData>({
    fullName: card.fullName,
    position: card.position,
    division: card.division ?? "",
    office: card.office ?? "",
    address: card.address ?? "",
    email: card.email ?? "",
    phone: card.phone ?? "",
    mobile: card.mobile ?? "",
    website: card.website ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    if (!cardData.fullName || !cardData.position) {
      setError("Full Name and Position are required.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/cards/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cardData, templateId: selectedTemplate.id }),
      })
      if (!res.ok) throw new Error("Failed to save")
      router.push(`/cards/${card.id}`)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Template picker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Template</h2>
        <TemplateSelector
          templates={templates}
          selectedId={selectedTemplate.id}
          onSelect={setSelectedTemplate}
        />
      </div>

      {/* Form + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Card Details</h2>
          <CardForm data={cardData} onChange={setCardData} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Live Preview</h2>
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <CardPreview svgFile={selectedTemplate.svgFile} data={cardData} />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#c0272d] text-white text-sm font-medium hover:bg-[#a8222a] transition-colors disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
