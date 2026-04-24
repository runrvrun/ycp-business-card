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
  phone?: string
  mobile?: string
  website?: string
}

interface Props {
  svgFile: string
  data?: CardData
  className?: string
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

export default function CardPreview({ svgFile, data, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgFile) return

    fetch(`/templates/${svgFile}`)
      .then((r) => r.text())
      .then((svgText) => {
        if (containerRef.current) {
          const substituted = data ? substituteData(svgText, data) : svgText
          const processed = scopeSvg(substituted)
          containerRef.current.innerHTML = processed
          const svg = containerRef.current.querySelector("svg")
          if (svg) {
            svg.style.width = "100%"
            svg.style.height = "auto"
            svg.removeAttribute("width")
            svg.removeAttribute("height")
          }
        }
      })
      .catch(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:120px;color:#94a3b8;font-size:14px">Template not found</div>`
        }
      })
  }, [svgFile, data])

  return <div ref={containerRef} className={className} />
}
