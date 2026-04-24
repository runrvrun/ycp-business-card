"use client"

import { useEffect, useRef } from "react"

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
  data: CardData
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
          containerRef.current.innerHTML = substituteData(svgText, data)
          const svg = containerRef.current.querySelector("svg")
          if (svg) {
            svg.style.width = "100%"
            svg.style.height = "100%"
          }
        }
      })
      .catch(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="flex items-center justify-center h-full text-slate-400 text-sm">Template not found</div>`
        }
      })
  }, [svgFile, data])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ aspectRatio: "3.5 / 2" }}
    />
  )
}
