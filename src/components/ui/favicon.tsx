import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Favicons are always fetched from DuckDuckGo's icon service.
 * Accepts a bare domain or a full URL; the host is extracted.
 */
function faviconHost(domain: string) {
  const address = domain.trim()
  try {
    return new URL(address.includes("://") ? address : `https://${address}`).hostname
  } catch {
    return ""
  }
}

export function faviconUrl(domain: string) {
  const host = faviconHost(domain)
  return `https://icons.duckduckgo.com/ip3/${host}.ico`
}

function Favicon({
  domain,
  alt,
  className,
  ...props
}: Omit<React.ComponentProps<"img">, "src" | "alt"> & {
  domain: string
  alt?: string
}) {
  const host = faviconHost(domain)
  const monochrome = host === "github.com" || host === "www.github.com"
  return (
    <img
      data-slot="favicon"
      src={faviconUrl(domain)}
      alt={alt ?? `${domain} favicon`}
      loading="lazy"
      draggable={false}
      className={cn(
        "size-(--button-icon-default) shrink-0 rounded-xs object-contain group-data-[size=expressive]/button:size-(--button-icon-expressive) group-data-[size=icon-expressive]/button:size-(--button-icon-expressive)",
        monochrome && "favicon-monochrome",
        className
      )}
      {...props}
    />
  )
}

export { Favicon }
