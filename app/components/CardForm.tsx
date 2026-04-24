"use client"

import { useEffect, useState } from "react"
import { CardData } from "./CardPreview"
import { Building2, X } from "lucide-react"

export interface OfficeOption {
  id: string
  name: string
  address: string | null
  phone: string | null
  website: string | null
}

interface Props {
  data: CardData
  onChange: (data: CardData) => void
  offices: OfficeOption[]
  officeId: string | null
  onOfficeSelect: (officeId: string | null, prefill: Partial<CardData>) => void
}

const fields: {
  key: keyof CardData
  label: string
  required?: boolean
  placeholder?: string
}[] = [
  { key: "fullName", label: "Full Name", required: true, placeholder: "Jane Doe" },
  { key: "position", label: "Position / Job Title", required: true, placeholder: "Senior Consultant" },
  { key: "division", label: "Division", placeholder: "Management Strategy Division" },
  { key: "email", label: "Email", placeholder: "jane.doe@ycp.com" },
  { key: "mobile", label: "Mobile", placeholder: "+62 812 0000 0000" },
]

const officeFields: { key: keyof CardData; label: string; placeholder?: string }[] = [
  { key: "office", label: "Office Name", placeholder: "PT YCP Indonesia" },
  { key: "address", label: "Address", placeholder: "Satrio Tower, 22/F – Unit C2" },
  { key: "phone", label: "Phone (Office)", placeholder: "+62 21 2598 2120" },
  { key: "website", label: "Website", placeholder: "ycp.com" },
]

const AUTOCOMPLETE_FIELDS: (keyof CardData)[] = ["position", "division", "mobile", "email"]

export default function CardForm({ data, onChange, offices, officeId, onOfficeSelect }: Props) {
  const [suggestions, setSuggestions] = useState<Partial<Record<keyof CardData, string[]>>>({})

  useEffect(() => {
    fetch("/api/cards/suggestions")
      .then((r) => r.json())
      .then((s) => setSuggestions(s))
      .catch(() => {})
  }, [])

  function handleChange(key: keyof CardData, value: string) {
    onChange({ ...data, [key]: value })
  }

  function handleOfficeSelect(id: string) {
    if (!id) {
      onOfficeSelect(null, {})
      return
    }
    const office = offices.find((o) => o.id === id)
    if (!office) return
    onOfficeSelect(office.id, {
      office: office.name,
      address: office.address ?? "",
      phone: office.phone ?? "",
      website: office.website ?? "",
    })
  }

  const selectedOffice = offices.find((o) => o.id === officeId)

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Personal fields */}
      {fields.map((f) => {
        const listId = `ac-${f.key}`
        const hasSuggestions = AUTOCOMPLETE_FIELDS.includes(f.key) && (suggestions[f.key]?.length ?? 0) > 0
        return (
          <div key={f.key}>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {f.label}
              {f.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
              type="text"
              value={data[f.key] ?? ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              required={f.required}
              list={hasSuggestions ? listId : undefined}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0272d]/30 focus:border-[#c0272d] placeholder:text-slate-300 transition"
            />
            {hasSuggestions && (
              <datalist id={listId}>
                {suggestions[f.key]!.map((v) => <option key={v} value={v} />)}
              </datalist>
            )}
          </div>
        )
      })}

      {/* Office section */}
      <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Building2 size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Office Details</span>
          </div>
          {officeId && (
            <button
              type="button"
              onClick={() => onOfficeSelect(null, {})}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={12} /> Clear office
            </button>
          )}
        </div>

        {/* Office selector */}
        {offices.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Load from saved office
            </label>
            <select
              value={officeId ?? ""}
              onChange={(e) => handleOfficeSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0272d]/30 focus:border-[#c0272d] text-slate-700 transition bg-white"
            >
              <option value="">— Select an office —</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            {selectedOffice && (
              <p className="text-xs text-slate-400 mt-1">
                Fields below are pre-filled from <span className="font-medium">{selectedOffice.name}</span> — edit freely.
              </p>
            )}
          </div>
        )}

        {/* Editable office fields */}
        {officeFields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
            <input
              type="text"
              value={data[f.key] ?? ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0272d]/30 focus:border-[#c0272d] placeholder:text-slate-300 transition"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
