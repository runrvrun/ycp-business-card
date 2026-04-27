"use client"

import { useEffect, useRef } from "react"
import { scopeSvg } from "@/app/lib/svgScope"

export interface Template {
  id: string
  name: string
  description?: string | null
  svgFile: string
  thumbnail?: string | null
  type: "FRONT" | "BACK"
  isActive: boolean
  sortOrder: number
}

interface Props {
  templates: Template[]
  selectedId: string
  onSelect: (template: Template) => void
}

function TemplateThumbnail({ svgFile }: { svgFile: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/templates/${svgFile}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.text()
      })
      .then((svg) => {
        if (ref.current) {
          ref.current.innerHTML = scopeSvg(svg)
          const el = ref.current.querySelector("svg")
          if (el) {
            el.style.width = "100%"
            el.style.height = "100%"
            el.removeAttribute("width")
            el.removeAttribute("height")
          }
        }
      })
      .catch(() => {
        if (ref.current) {
          ref.current.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:11px">Template not found</div>`
        }
      })
  }, [svgFile])

  return <div ref={ref} className="w-full h-full" />
}

export default function TemplateSelector({ templates, selectedId, onSelect }: Props) {
  if (templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
        No templates available
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {templates.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t)}
          className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
            selectedId === t.id
              ? "border-[#c0272d] shadow-md shadow-[#c0272d]/20"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="bg-white overflow-hidden" style={{ aspectRatio: "55/91" }}>
            <TemplateThumbnail svgFile={t.svgFile} />
          </div>
          <div className="px-3 py-2 bg-white border-t border-slate-100">
            <p className="text-sm font-medium text-slate-800">{t.name}</p>
            {t.description && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">{t.description}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
