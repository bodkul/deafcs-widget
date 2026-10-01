import { MessageSquarePlus } from "lucide-react"

import { SITE_LINKS } from "@/lib/site-links"

export function BackgroundSuggestionCard() {
  return (
    <a
      className="group flex col-span-2 items-center justify-center rounded-md border border-dashed border-border/80 bg-surface/20 p-4 text-on-surface transition-[border-color,background-color,transform] duration-150 ease-out hover:border-foreground/40 hover:bg-surface-2 active:scale-[0.985] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
      href={SITE_LINKS.suggestBackground}
      rel="noreferrer"
      target="_blank"
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquarePlus
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-colors duration-150 ease-out group-hover:text-foreground"
        />
        <span>Suggest a background</span>
      </span>
    </a>
  )
}
