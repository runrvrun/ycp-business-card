"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Building2, X, Check } from "lucide-react"

export interface Office {
  id: string
  name: string
  address: string | null
  phone: string | null
  website: string | null
}

const EMPTY: Omit<Office, "id"> = { name: "", address: "", phone: "", website: "" }

function OfficeForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Omit<Office, "id">
  onSave: (data: Omit<Office, "id">) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="flex flex-col gap-3">
      {(
        [
          { key: "name", label: "Office Name", required: true, placeholder: "PT YCP Indonesia" },
          { key: "address", label: "Address", placeholder: "Satrio Tower, 22/F – Unit C2, South Jakarta" },
          { key: "phone", label: "Phone", placeholder: "+62 21 2598 2120" },
          { key: "website", label: "Website", placeholder: "ycp.com" },
        ] as const
      ).map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            {f.label}
            {"required" in f && f.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <input
            type="text"
            value={form[f.key] ?? ""}
            onChange={set(f.key)}
            placeholder={f.placeholder}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#001C44]/30 focus:border-[#001C44] placeholder:text-slate-300 transition"
          />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#001C44] text-white text-sm font-medium hover:bg-[#001533] transition-colors disabled:opacity-50"
        >
          <Check size={14} /> {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function OfficeManager({ initialOffices }: { initialOffices: Office[] }) {
  const router = useRouter()
  const [offices, setOffices] = useState<Office[]>(initialOffices)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleAdd(data: Omit<Office, "id">) {
    setSaving(true)
    try {
      const res = await fetch("/api/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const office: Office = await res.json()
      setOffices((prev) => [...prev, office].sort((a, b) => a.name.localeCompare(b.name)))
      setAdding(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(id: string, data: Omit<Office, "id">) {
    setSaving(true)
    try {
      const res = await fetch(`/api/offices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const updated: Office = await res.json()
      setOffices((prev) => prev.map((o) => (o.id === id ? updated : o)))
      setEditingId(null)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/offices/${id}`, { method: "DELETE" })
      setOffices((prev) => prev.filter((o) => o.id !== id))
      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => { setAdding(true); setEditingId(null) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#001C44] text-white text-sm font-medium hover:bg-[#001533] transition-colors"
        >
          <Plus size={15} /> Add Office
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-[#001C44]/30 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">New Office</h2>
          <OfficeForm
            initial={EMPTY}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
            saving={saving}
          />
        </div>
      )}

      {offices.length === 0 && !adding ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center text-center gap-3">
          <Building2 size={28} className="text-slate-300" />
          <p className="font-medium text-slate-600">No offices yet</p>
          <p className="text-sm text-slate-400">Add an office to reuse its details when creating cards.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {offices.map((office) => (
            <div key={office.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              {editingId === office.id ? (
                <>
                  <p className="text-sm font-semibold text-slate-700 mb-4">Edit Office</p>
                  <OfficeForm
                    initial={{ name: office.name, address: office.address, phone: office.phone, website: office.website }}
                    onSave={(data) => handleEdit(office.id, data)}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={15} className="text-slate-400 shrink-0" />
                      <p className="font-semibold text-slate-800">{office.name}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 mt-2 text-sm">
                      {office.address && (
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Address</span>
                          <p className="text-slate-600 mt-0.5 text-xs">{office.address}</p>
                        </div>
                      )}
                      {office.phone && (
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Phone</span>
                          <p className="text-slate-600 mt-0.5 text-xs">{office.phone}</p>
                        </div>
                      )}
                      {office.website && (
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Website</span>
                          <p className="text-slate-600 mt-0.5 text-xs">{office.website}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditingId(office.id); setAdding(false) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(office.id)}
                      disabled={deletingId === office.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} /> {deletingId === office.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
