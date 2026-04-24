"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TemplateSelector, { Template } from "@/app/components/TemplateSelector"
import CardForm from "@/app/components/CardForm"
import CardPreview from "@/app/components/CardPreview"
import { CardData } from "@/app/components/CardPreview"
import { ChevronLeft, ChevronRight, Save, LayoutTemplate } from "lucide-react"

interface Props {
  frontTemplates: Template[]
  backTemplates: Template[]
  defaultData: CardData
}

type Step = "front" | "back" | "details"

const STEPS: { key: Step; label: string }[] = [
  { key: "front", label: "Front Design" },
  { key: "back", label: "Back Design" },
  { key: "details", label: "Fill Details" },
]

export default function NewCardClient({ frontTemplates, backTemplates, defaultData }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("front")
  const [frontTemplate, setFrontTemplate] = useState<Template | null>(frontTemplates[0] ?? null)
  const [backTemplate, setBackTemplate] = useState<Template | null>(backTemplates[0] ?? null)
  const [cardData, setCardData] = useState<CardData>(defaultData)
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    if (!cardData.fullName || !cardData.position) {
      setError("Full Name and Position are required.")
      return
    }
    if (!frontTemplate || !backTemplate) {
      setError("Please select both a front and back design.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cardData,
          frontTemplateId: frontTemplate.id,
          backTemplateId: backTemplate.id,
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      const card = await res.json()
      router.push(`/cards/${card.id}`)
    } catch {
      setError("Something went wrong. Please try again.")
      setSaving(false)
    }
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === step)

  function goTo(s: Step) {
    if (s === "back" && !frontTemplate) return
    if (s === "details" && (!frontTemplate || !backTemplate)) return
    setStep(s)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={16} className="text-slate-300 shrink-0" />}
            <button
              onClick={() => goTo(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                step === s.key
                  ? "bg-[#c0272d] text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              <span>{i + 1}</span> {s.label}
            </button>
          </div>
        ))}
      </div>

      {/* Step: choose front */}
      {step === "front" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Select Front Design</h2>
            <TemplateSelector
              templates={frontTemplates}
              selectedId={frontTemplate?.id ?? ""}
              onSelect={setFrontTemplate}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => goTo("back")}
              disabled={!frontTemplate}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#c0272d] text-white text-sm font-medium hover:bg-[#a8222a] transition-colors disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step: choose back */}
      {step === "back" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Select Back Design</h2>
            <TemplateSelector
              templates={backTemplates}
              selectedId={backTemplate?.id ?? ""}
              onSelect={setBackTemplate}
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setStep("front")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={() => goTo("details")}
              disabled={!backTemplate}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#c0272d] text-white text-sm font-medium hover:bg-[#a8222a] transition-colors disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step: fill details */}
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700">Live Preview</h2>
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
                {previewSide === "front" && frontTemplate && (
                  <CardPreview svgFile={frontTemplate.svgFile} data={cardData} />
                )}
                {previewSide === "back" && backTemplate && (
                  <CardPreview svgFile={backTemplate.svgFile} />
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-center justify-center">
                <LayoutTemplate size={12} className="text-slate-400" />
                <p className="text-xs text-slate-400">
                  {previewSide === "front" ? frontTemplate?.name : backTemplate?.name}
                </p>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("back")}
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
