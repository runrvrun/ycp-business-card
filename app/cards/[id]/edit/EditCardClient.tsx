"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TemplateSelector, { Template } from "@/app/components/TemplateSelector"
import CardForm from "@/app/components/CardForm"
import CardPreview, { CardData } from "@/app/components/CardPreview"
import { Save, LayoutTemplate } from "lucide-react"

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
  frontTemplate: Template
  backTemplate: Template
}

interface Props {
  card: CardRecord
  frontTemplates: Template[]
  backTemplates: Template[]
}

export default function EditCardClient({ card, frontTemplates, backTemplates }: Props) {
  const router = useRouter()
  const [frontTemplate, setFrontTemplate] = useState<Template>(card.frontTemplate)
  const [backTemplate, setBackTemplate] = useState<Template>(card.backTemplate)
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
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front")
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
        body: JSON.stringify({
          ...cardData,
          frontTemplateId: frontTemplate.id,
          backTemplateId: backTemplate.id,
        }),
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
      {/* Template pickers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Front Design</h2>
          <TemplateSelector
            templates={frontTemplates}
            selectedId={frontTemplate.id}
            onSelect={setFrontTemplate}
          />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Back Design</h2>
          <TemplateSelector
            templates={backTemplates}
            selectedId={backTemplate.id}
            onSelect={setBackTemplate}
          />
        </div>
      </div>

      {/* Form + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Card Details</h2>
          <CardForm data={cardData} onChange={setCardData} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700">Preview</h2>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
                <button
                  onClick={() => setPreviewSide("front")}
                  className={`px-3 py-1.5 transition-colors ${previewSide === "front" ? "bg-[#c0272d] text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Front
                </button>
                <button
                  onClick={() => setPreviewSide("back")}
                  className={`px-3 py-1.5 transition-colors ${previewSide === "back" ? "bg-[#c0272d] text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Back
                </button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100">
              {previewSide === "front" ? (
                <CardPreview svgFile={frontTemplate.svgFile} data={cardData} />
              ) : (
                <CardPreview svgFile={backTemplate.svgFile} />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2 justify-center">
              <LayoutTemplate size={12} className="text-slate-400" />
              <p className="text-xs text-slate-400">
                {previewSide === "front" ? frontTemplate.name : backTemplate.name}
              </p>
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
