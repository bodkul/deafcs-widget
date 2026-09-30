import type { WidgetSnapshot } from "../types"

export interface WidgetDataSource {
  getPlayerSnapshot(
    lookup: string,
    options?: { signal?: AbortSignal; },
  ): Promise<WidgetSnapshot>
}
