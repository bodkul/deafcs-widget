import { cn } from "cn"
import { DotsRing } from "@/components/ui/dots-ring"

type WidgetSkeletonProps = {
  className?: string
  size?: "pill" | "card" | "compact"
}

export function WidgetSkeleton({ className, size = "pill" }: WidgetSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border/70 bg-surface-raised/75 p-2 motion-safe:animate-pulse",
        size === "compact" ? "h-29 w-116" : size === "card" ? "h-18 w-57.5" : "h-10 w-37.5",
        className,
      )}
    >
      <span className="size-6 shrink-0 rounded-full bg-control-selected" />
      <span className="h-2.5 w-14 rounded-full bg-control-selected" />
      <span className="ml-auto h-2.5 w-8 rounded-full bg-control-selected" />
    </div>
  )
}

type WidgetDataStatusProps = {
  message: string
  loading?: boolean
}

export function WidgetDataStatus({ message, loading = false }: WidgetDataStatusProps) {
  return (
    <div
      className="flex max-w-70 flex-col items-center gap-2 text-center text-sm text-muted-foreground"
      role="status"
    >
      {loading ? <DotsRing decorative /> : <span>{message}</span>}
    </div>
  )
}
