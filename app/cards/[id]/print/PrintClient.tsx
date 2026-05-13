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

function wrapSvgText(text: string, maxChars: number, dy: number): string {
  if (!text) return '<tspan x="0" y="0"></tspan>'
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    if (!current) {
      current = word
    } else if (current.length + 1 + word.length <= maxChars) {
      current += " " + word
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
    .map((line, i) =>
      i === 0
        ? `<tspan x="0" y="0">${line}</tspan>`
        : `<tspan x="0" dy="${dy}">${line}</tspan>`
    )
    .join("")
}

function substituteData(svg: string, data: CardData): string {
  const withAddress = svg.replace(
    /<tspan([^>]*)>\{\{address\}\}<\/tspan>/g,
    () => wrapSvgText(data.address || "", 44, 22)
  )
  return withAddress
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
    return `<svg${cleaned} style="width:100%;height:100%;display:block;">`
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
    .info-page {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Palatino Linotype", Palatino, serif;
      background: white;
    }
    .info-content {
      padding: 6mm;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .section-label {
      font-size: 6pt;
      font-weight: bold;
      color: #001C44;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 2mm;
    }
    .color-swatch {
      width: 100%;
      height: 9mm;
      background: #001C44;
      border-radius: 0.8mm;
      margin-bottom: 2mm;
    }
    .color-name {
      font-size: 9pt;
      font-weight: bold;
      color: #001C44;
      margin-bottom: 1.5mm;
    }
    .color-values {
      font-family: "Courier New", Courier, monospace;
      font-size: 6pt;
      color: #444;
      display: flex;
      flex-direction: column;
      gap: 0.8mm;
    }
    .divider {
      height: 0.3mm;
      background: #e2e8f0;
      margin: 4mm 0;
    }
    .font-name {
      font-family: "Palatino Linotype", Palatino, serif;
      font-size: 10pt;
      color: #001C44;
    }
  </style>
</head>
<body>
  <div class="page info-page">
    <div class="info-content">
      <div class="section-label">Color</div>
      <div class="color-swatch"></div>
      <div class="color-name">Dark Blue</div>
      <div class="color-values">
        <span>RGB&nbsp;&nbsp;0 28 68</span>
        <span>HEX&nbsp;&nbsp;#001C44</span>
        <span>CSS&nbsp;&nbsp;rgba(0, 28, 68, 1)</span>
      </div>
      <div class="divider"></div>
      <div class="section-label">Font</div>
      <div class="font-name">Palatino Linotype</div>
    </div>
  </div>
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
              Info → page 1 &nbsp;·&nbsp; Front → page 2 &nbsp;·&nbsp; Back → page 3
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
                style={{ aspectRatio: "55/91" }}
                dangerouslySetInnerHTML={{ __html: frontSvg }}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2 text-center">
                Back — {backTemplateName}
              </p>
              <div
                className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                style={{ aspectRatio: "55/91" }}
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
