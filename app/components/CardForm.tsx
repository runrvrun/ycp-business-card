"use client"

import { CardData } from "./CardPreview"

interface Props {
  data: CardData
  onChange: (data: CardData) => void
}

const fields: { key: keyof CardData; label: string; required?: boolean; placeholder?: string }[] = [
  { key: "fullName", label: "Full Name", required: true, placeholder: "Jane Doe" },
  { key: "position", label: "Position / Job Title", required: true, placeholder: "Senior Consultant" },
  { key: "division", label: "Division", placeholder: "Management Strategy Division" },
  { key: "office", label: "Office", placeholder: "Singapore" },
  { key: "address", label: "Address", placeholder: "1 Raffles Place, #20-61 Tower 2, Singapore 048616" },
  { key: "email", label: "Email", placeholder: "jane.doe@ycp.com" },
  { key: "phone", label: "Phone (Office)", placeholder: "+65 6000 0000" },
  { key: "mobile", label: "Mobile", placeholder: "+65 9000 0000" },
  { key: "website", label: "Website", placeholder: "www.ycp.com" },
]

export default function CardForm({ data, onChange }: Props) {
  function handleChange(key: keyof CardData, value: string) {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {fields.map((f) => (
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
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0272d]/30 focus:border-[#c0272d] placeholder:text-slate-300 transition"
          />
        </div>
      ))}
    </div>
  )
}
