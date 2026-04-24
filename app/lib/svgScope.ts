let counter = 0

export function scopeSvg(svgText: string): string {
  const id = `svg-scope-${++counter}`

  // Scope all CSS rules inside <style> blocks to this SVG's unique ID
  const scoped = svgText.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_, attrs, css) => {
    const scopedCss = css.replace(/([^{}]+)\{/g, (rule: string, selector: string) => {
      const selectors = selector
        .split(",")
        .map((s: string) => `#${id} ${s.trim()}`)
        .join(", ")
      return `${selectors} {`
    })
    return `<style${attrs}>${scopedCss}</style>`
  })

  // Add the unique ID to the root <svg> element
  return scoped.replace(/<svg(\s)/, `<svg id="${id}"$1`)
}
