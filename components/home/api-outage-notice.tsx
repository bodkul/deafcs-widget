import { TriangleAlert } from "lucide-react"

// Temporary: DEAFCS currently rejects requests from our servers (403), so live stats are down.
export function ApiOutageNotice() {
  return (
    <div
      role="status"
      className="relative z-20 border-b border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-[13px] leading-5 text-amber-100"
    >
      <div className="mx-auto flex max-w-360 items-start justify-center gap-2.5 text-center sm:items-center">
        <TriangleAlert
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-amber-400 sm:mt-0"
        />
        <p>
          Live stats are temporarily unavailable: the DEAFCS API is blocking our requests.
          We&apos;ve contacted the DEAFCS team, and widgets will start updating again once access is
          restored.
        </p>
      </div>
    </div>
  )
}
