"use client"

import { useEffect, useRef } from "react"
import { CardData } from "@/app/components/CardPreview"
import { scopeSvg } from "@/app/lib/svgScope"
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
        if (!ref.current) return
        const substituted = data ? substituteData(svg, data) : svg
        ref.current.innerHTML = scopeSvg(substituted)
        const el = ref.current.querySelector("svg")
        if (el) {
          el.style.width = "100%"
          el.style.height = "auto"
          el.removeAttribute("width")
          el.removeAttribute("height")
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgFile])
}

export default function PrintClient({ frontSvgFile, backSvgFile, data, frontTemplateName, backTemplateName }: Props) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  useSvg(frontRef, frontSvgFile, data)
  useSvg(backRef, backSvgFile)

  return (
    <>
      <style>{`
        @page { size: A4 portrait; margin: 15mm; }

        @media print {
          html, body { margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .print-wrapper { display: block !important; background: white; }
          .print-card-page {
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-after: always;
            min-height: 100vh;
          }
          .print-card-page:last-child { page-break-after: avoid; }
          .print-card-inner { width: 60mm; }
        }

        @media screen {
          .print-wrapper { display: none; }
        }
      `}</style>

      {/* Screen: controls + preview */}
      <div className="no-print min-h-screen bg-slate-100 p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-center text-sm font-medium text-slate-700 mb-1">{data.fullName}</p>
            <p className="text-center text-xs text-slate-400 mb-5">
              Front on page 1, back on page 2. Use &ldquo;Save as PDF&rdquo; in the print dialog.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 text-center">Front — {frontTemplateName}</p>
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <div ref={frontRef} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 text-center">Back — {backTemplateName}</p>
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <div ref={backRef} />
                </div>
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
          </div>
        </div>
      </div>

      {/* Print-only: each card on its own page, rendered independently */}
      <div className="print-wrapper">
        <div className="print-card-page">
          <PrintCard svgFile={frontSvgFile} data={data} />
        </div>
        <div className="print-card-page">
          <PrintCard svgFile={backSvgFile} />
        </div>
      </div>
    </>
  )
}

function PrintCard({ svgFile, data }: { svgFile: string; data?: CardData }) {
  const ref = useRef<HTMLDivElement>(null)
  useSvg(ref, svgFile, data)
  return <div ref={ref} className="print-card-inner" />
}
