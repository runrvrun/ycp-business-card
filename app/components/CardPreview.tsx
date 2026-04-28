"use client"

import { useEffect, useRef } from "react"
import { scopeSvg } from "@/app/lib/svgScope"

export interface CardData {
  fullName: string
  position: string
  division?: string
  office?: string
  address?: string
  email?: string
  email2?: string
  phone?: string
  mobile?: string
  whatsapp?: string
  website?: string
}

interface Props {
  svgFile: string
  data?: CardData
  className?: string
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
    .replace(/\{\{email\}\}/g, data.email || "")
    .replace(/\{\{email2\}\}/g, data.email2 || "")
    .replace(/\{\{phone\}\}/g, data.phone || "")
    .replace(/\{\{mobile\}\}/g, data.mobile || "")
    .replace(/\{\{whatsapp\}\}/g, data.whatsapp || "")
    .replace(/\{\{website\}\}/g, data.website || "")
}

export default function CardPreview({ svgFile, data, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgFile) return

    fetch(`/templates/${svgFile}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.text()
      })
      .then((svgText) => {
        if (containerRef.current) {
          const substituted = data ? substituteData(svgText, data) : svgText
          const processed = scopeSvg(substituted)
          containerRef.current.innerHTML = processed
          const svg = containerRef.current.querySelector("svg")
          if (svg) {
            svg.style.width = "100%"
            svg.style.height = "100%"
            svg.removeAttribute("width")
            svg.removeAttribute("height")
          }
        }
      })
      .catch(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:14px">Template not found</div>`
        }
      })
  }, [svgFile, data])

  return <div ref={containerRef} className={className ?? "w-full h-full"} />
}
