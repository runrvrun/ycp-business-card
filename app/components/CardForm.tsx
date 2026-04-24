"use client"

import { useEffect, useState } from "react"
import { CardData } from "./CardPreview"

interface Props {
  data: CardData
  onChange: (data: CardData) => void
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
  { key: "office", label: "Office", placeholder: "Jakarta" },
  { key: "address", label: "Address", placeholder: "Satrio Tower, 22/F – Unit C2" },
  { key: "email", label: "Email", placeholder: "jane.doe@ycp.com" },
  { key: "phone", label: "Phone (Office)", placeholder: "+62 21 2598 2120" },
  { key: "mobile", label: "Mobile", placeholder: "+62 812 0000 0000" },
  { key: "website", label: "Website", placeholder: "ycp.com" },
]

const AUTOCOMPLETE_FIELDS: (keyof CardData)[] = [
  "position", "division", "office", "address", "phone", "mobile", "email", "website",
]

export default function CardForm({ data, onChange }: Props) {
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

  return (
    <div className="grid grid-cols-1 gap-4">
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
                {suggestions[f.key]!.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            )}
          </div>
        )
      })}
    </div>
  )
}
