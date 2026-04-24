"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TemplateSelector, { Template } from "@/app/components/TemplateSelector"
import CardForm from "@/app/components/CardForm"
import CardPreview from "@/app/components/CardPreview"
import { CardData } from "@/app/components/CardPreview"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

interface Props {
  templates: Template[]
  defaultData: CardData
}

type Step = "template" | "details"

export default function NewCardClient({ templates, defaultData }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [cardData, setCardData] = useState<CardData>(defaultData)
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
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cardData, templateId: selectedTemplate.id }),
      })
      if (!res.ok) throw new Error("Failed to save")
      const card = await res.json()
      router.push(`/cards/${card.id}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setStep("template")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            step === "template" ? "bg-[#c0272d] text-white" : "bg-white text-slate-500 border border-slate-200"
          }`}
        >
          <span>1</span> Choose Template
        </button>
        <ChevronRight size={16} className="text-slate-300" />
        <button
          onClick={() => templates.length > 0 && setStep("details")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
            step === "details" ? "bg-[#c0272d] text-white" : "bg-white text-slate-500 border border-slate-200"
          }`}
        >
          <span>2</span> Fill Details
        </button>
      </div>

      {step === "template" && (
        <div className="flex flex-col gap-4">
          <TemplateSelector
            templates={templates}
            selectedId={selectedTemplate?.id ?? ""}
            onSelect={setSelectedTemplate}
          />
          <div className="flex justify-end">
            <button
              onClick={() => setStep("details")}
              disabled={!selectedTemplate}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#c0272d] text-white text-sm font-medium hover:bg-[#a8222a] transition-colors disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Card Details</h2>
            <CardForm data={cardData} onChange={setCardData} />
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Live Preview</h2>
              <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <CardPreview svgFile={selectedTemplate.svgFile} data={cardData} />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Template: {selectedTemplate.name}
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("template")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#c0272d] text-white text-sm font-medium hover:bg-[#a8222a] transition-colors disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
