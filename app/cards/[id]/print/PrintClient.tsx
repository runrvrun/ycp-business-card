"use client"

import { useEffect, useRef } from "react"
import { CardData } from "@/app/components/CardPreview"
import { Printer } from "lucide-react"

interface Props {
  frontSvgFile: string
  backSvgFile: string
  data: CardData
  frontTemplateName: string
  backTemplateName: string
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

function useSvg(ref: React.RefObject<HTMLDivElement | null>, svgFile: string, data?: CardData) {
  useEffect(() => {
    fetch(`/templates/${svgFile}`)
      .then((r) => r.text())
      .then((svg) => {
        if (ref.current) {
          ref.current.innerHTML = data ? substituteData(svg, data) : svg
          const el = ref.current.querySelector("svg")
          if (el) {
            el.style.width = "100%"
            el.style.height = "auto"
            el.removeAttribute("width")
            el.removeAttribute("height")
          }
        }
      })
  }, [ref, svgFile, data])
}

export default function PrintClient({ frontSvgFile, backSvgFile, data, frontTemplateName, backTemplateName }: Props) {
  const frontScreenRef = useRef<HTMLDivElement>(null)
  const backScreenRef = useRef<HTMLDivElement>(null)
  const frontPrintRef = useRef<HTMLDivElement>(null)
  const backPrintRef = useRef<HTMLDivElement>(null)

  useSvg(frontScreenRef, frontSvgFile, data)
  useSvg(backScreenRef, backSvgFile)
  useSvg(frontPrintRef, frontSvgFile, data)
  useSvg(backPrintRef, backSvgFile)

  return (
    <>
      <style>{`
        @page { size: A4 portrait; margin: 20mm; }
        @media print {
          html, body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-page {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 100%;
            page-break-after: always;
          }
          .print-card { width: 54mm; }
          .print-page:last-child { page-break-after: avoid; }
        }
      `}</style>

      {/* Screen controls */}
      <div className="no-print min-h-screen bg-slate-100 p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-center text-sm font-medium text-slate-700 mb-1">{data.fullName}</p>
            <p className="text-center text-xs text-slate-400 mb-5">
              Click &ldquo;Print / Save as PDF&rdquo; to download. Front on page 1, back on page 2.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 text-center">
                  Front — {frontTemplateName}
                </p>
                <div ref={frontScreenRef} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 text-center">
                  Back — {backTemplateName}
                </p>
                <div ref={backScreenRef} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" />
              </div>
            </div>

            <div className="flex gap-3">
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

            <p className="text-xs text-slate-400 text-center mt-3">
              In the print dialog, select &ldquo;Save as PDF&rdquo; — A4 portrait, no scaling.
            </p>
          </div>
        </div>
      </div>

      {/* Print-only output: front on page 1, back on page 2 */}
      <div className="print-page" style={{ display: "none" }}>
        <div ref={frontPrintRef} className="print-card" />
      </div>
      <div className="print-page" style={{ display: "none" }}>
        <div ref={backPrintRef} className="print-card" />
      </div>
    </>
  )
}
