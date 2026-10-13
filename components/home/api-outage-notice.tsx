import { TriangleAlert } from "lucide-react"

// Temporary: DEAFCS currently rejects requests from our servers (403), so live stats are down.
export function ApiOutageNotice() {
  return (
    <div
      role="status"
      className="mt-6 flex max-w-125 items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-[13px] leading-5 text-amber-100"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-400" />
      <p>
        Live stats are temporarily unavailable: the DEAFCS API is blocking our requests. We&apos;ve
        contacted the DEAFCS team, and widgets will start updating again once access is restored.
      </p>
    </div>
  )
}
