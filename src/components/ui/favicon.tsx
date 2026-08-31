import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Favicons are always fetched from DuckDuckGo's icon service.
 * Accepts a bare domain or a full URL; the host is extracted.
 */
export function faviconUrl(domain: string) {
  const host = domain
    .trim()
    .replace(/^[a-z]+:\/\//i, "")
    .replace(/\/.*$/, "")
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
  return (
    <img
      data-slot="favicon"
      src={faviconUrl(domain)}
      alt={alt ?? `${domain} favicon`}
      loading="lazy"
      draggable={false}
      className={cn(
        "size-4 shrink-0 rounded-xs object-contain group-data-[size=xs]/button:size-3 group-data-[size=sm]/button:size-3.5 group-data-[size=icon-xs]/button:size-3",
        className
      )}
      {...props}
    />
  )
}

export { Favicon }
