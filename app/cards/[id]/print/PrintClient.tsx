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
    .replace(/\{\{email2\}\}/g, data.email2 || "")
    .replace(/\{\{phone\}\}/g, data.phone || "")
    .replace(/\{\{mobile\}\}/g, data.mobile || "")
    .replace(/\{\{whatsapp\}\}/g, data.whatsapp || "")
    .replace(/\{\{website\}\}/g, data.website || "")
}

function prepareSvg(raw: string, data?: CardData): string {
  const substituted = data ? substituteData(raw, data) : raw
  const scoped = scopeSvg(substituted)
  return scoped.replace(/<svg\b([^>]*?)>/, (_, attrs) => {
    const cleaned = attrs.replace(/\s*(width|height|style)="[^"]*"/g, "")
    return `<svg${cleaned}>`
  })
}

function buildPrintDocument(frontSvg: string, backSvg: string, name: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>YCP Business Card - ${name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 55mm 91mm; margin: 0; }
    body { background: white; }
    .page {
      width: 55mm;
      height: 91mm;
      overflow: hidden;
      page-break-after: always;
    }
    .page:last-child { page-break-after: avoid; }
    .page svg {
      display: block;
      width: 55mm !important;
      height: 91mm !important;
    }
  </style>
</head>
<body>
  <div class="page">${frontSvg}</div>
  <div class="page">${backSvg}</div>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 200);
    });
  <\/script>
</body>
</html>`
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

  function handlePrint() {
    const win = window.open("", "_blank")
    if (!win) {
      alert("Please allow pop-ups for this site to enable printing.")
      return
    }
    win.document.write(buildPrintDocument(frontSvg, backSvg, data.fullName))
    win.document.close()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-5">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">{data.fullName}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Front → page 1 &nbsp;·&nbsp; Back → page 2
            </p>
          </div>

          {/* Screen preview */}
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
              onClick={handlePrint}
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
            A new window will open and print automatically.
            Choose &ldquo;Save as PDF&rdquo; · no scaling · each page is 55 × 91 mm.
          </p>
        </div>
      </div>
    </div>
  )
}
