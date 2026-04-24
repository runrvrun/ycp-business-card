"use client"

import { useState, useEffect } from "react"
import { CardData } from "@/app/components/CardPreview"
import { scopeSvg } from "@/app/lib/svgScope"
import { Printer, Loader2 } from "lucide-react"

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

function prepareSvg(raw: string, data?: CardData): string {
  const substituted = data ? substituteData(raw, data) : raw
  const scoped = scopeSvg(substituted)
  // Make SVG fill its container
  return scoped.replace(/<svg\b([^>]*?)>/, (_, attrs) => {
    const cleaned = attrs.replace(/\s*(width|height)="[^"]*"/g, "")
    return `<svg${cleaned} style="width:100%;height:auto;display:block;">`
  })
}

export default function PrintClient({
  frontSvgFile,
  backSvgFile,
  data,
  frontTemplateName,
  backTemplateName,
}: Props) {
  const [frontSvg, setFrontSvg] = useState("")
  const [backSvg, setBackSvg] = useState("")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/templates/${frontSvgFile}`).then((r) => r.text()),
      fetch(`/templates/${backSvgFile}`).then((r) => r.text()),
    ]).then(([front, back]) => {
      setFrontSvg(prepareSvg(front, data))
      setBackSvg(prepareSvg(back))
      setReady(true)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontSvgFile, backSvgFile])

  return (
    <>
      <style>{`
        @page { size: A4 portrait; margin: 15mm; }

        @media print {
          html, body { margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .print-section { display: block !important; }
          .print-page {
            page-break-after: always;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10mm 0;
          }
          .print-page:last-child { page-break-after: avoid; }
          .print-card-wrap { width: 60mm; }
        }

        @media screen {
          .print-section { display: none; }
        }
      `}</style>

      {/* ── Screen controls ── */}
      <div className="no-print min-h-screen bg-slate-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-5">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">{data.fullName}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Front → page 1 &nbsp;·&nbsp; Back → page 2
              </p>
            </div>

            {/* Screen preview of both sides */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 text-center">
                  Front — {frontTemplateName}
                </p>
                <div
                  className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: frontSvg }}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 text-center">
                  Back — {backTemplateName}
                </p>
                <div
                  className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: backSvg }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                disabled={!ready}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {ready ? <Printer size={16} /> : <Loader2 size={16} className="animate-spin" />}
                {ready ? "Print / Save as PDF" : "Loading…"}
              </button>
              <button
                onClick={() => window.close()}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center">
              In the print dialog choose &ldquo;Save as PDF&rdquo; · paper: A4 portrait · no scaling.
            </p>
          </div>
        </div>
      </div>

      {/* ── Print-only output ── */}
      {/* Same SVG strings, already in the DOM, no hidden refs. */}
      <div className="print-section">
        <div className="print-page">
          <div
            className="print-card-wrap"
            dangerouslySetInnerHTML={{ __html: frontSvg }}
          />
        </div>
        <div className="print-page">
          <div
            className="print-card-wrap"
            dangerouslySetInnerHTML={{ __html: backSvg }}
          />
        </div>
      </div>
    </>
  )
}
