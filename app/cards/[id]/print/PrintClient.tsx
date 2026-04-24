"use client"

import { useEffect, useRef } from "react"
import { CardData } from "@/app/components/CardPreview"
import { Printer } from "lucide-react"

interface Props {
  svgFile: string
  data: CardData
  templateName: string
}

function substituteData(svg: string, data: CardData): string {
  return svg
    .replace(/\{\{fullName\}\}/g, data.fullName || "")
    .replace(/\{\{position\}\}/g, data.position || "")
    .replace(/\{\{division\}\}/g, data.division || "")
    .replace(/\{\{office\}\}/g, data.office || "")
    .replace(/\{\{address\}\}/g, data.address || "")
    .replace(/\{\{email\}\}/g, data.email || "")
    .replace(/\{\{phone\}\}/g, data.phone || "")
    .replace(/\{\{mobile\}\}/g, data.mobile || "")
    .replace(/\{\{website\}\}/g, data.website || "")
}

export default function PrintClient({ svgFile, data, templateName }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/templates/${svgFile}`)
      .then((r) => r.text())
      .then((svg) => {
        if (cardRef.current) {
          cardRef.current.innerHTML = substituteData(svg, data)
          const el = cardRef.current.querySelector("svg")
          if (el) {
            el.style.width = "3.5in"
            el.style.height = "2in"
            el.removeAttribute("width")
            el.removeAttribute("height")
          }
        }
      })
  }, [svgFile, data])

  return (
    <>
      <style>{`
        @page {
          size: 3.5in 2in;
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          #card-container {
            width: 3.5in;
            height: 2in;
          }
        }
      `}</style>

      {/* Print controls — hidden on print */}
      <div className="no-print min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-6 p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 w-full max-w-lg">
          <div>
            <p className="text-center text-sm font-medium text-slate-700">
              {data.fullName} — {templateName}
            </p>
            <p className="text-center text-xs text-slate-400 mt-0.5">Preview below. Click Print to save as PDF.</p>
          </div>

          {/* Screen preview */}
          <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <div ref={cardRef} id="card-container" style={{ width: "100%", aspectRatio: "3.5 / 2" }} />
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              <Printer size={16} />
              Print / Save as PDF
            </button>
            <button
              onClick={() => window.close()}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Tip: In the print dialog, select &ldquo;Save as PDF&rdquo; and set paper size to{" "}
            <strong>3.5 × 2 inch</strong> (or use the preset page size if available).
          </p>
        </div>
      </div>

      {/* Print-only area — the card itself */}
      <div
        id="card-container-print"
        style={{ display: "none", width: "3.5in", height: "2in" }}
        className="print:block print:fixed print:top-0 print:left-0"
      />
    </>
  )
}
