"use client"

import { type RefObject, useState } from "react"

import { buildWidgetUrl, type WidgetConfig } from "@/lib/widget"
import { downloadWidgetPng } from "@/lib/widget/export-image"

function useClipboard() {
  const [copied, setCopied] = useState(false)

  async function copyUrl(url: string) {
    if (!url) return

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1_800)
    } catch {
      setCopied(false)
    }
  }

  return { copied, copyUrl }
}

type PreviewActionOptions = {
  config: WidgetConfig
  nickname: string
  playerId?: string
  previewWidgetRef: RefObject<HTMLDivElement | null>
}

function useWidgetExport({ config, nickname, previewWidgetRef }: PreviewActionOptions) {
  const [exportingImage, setExportingImage] = useState(false)

  async function downloadPreview() {
    const node = previewWidgetRef.current
    if (!node || exportingImage) return

    setExportingImage(true)
    try {
      await downloadWidgetPng(node, { nickname, preset: config.preset })
    } catch (error) {
      console.error("Unable to export widget image", error)
    } finally {
      setExportingImage(false)
    }
  }

  return { exportingImage, downloadPreview }
}

export function useBuilderActions({
  config,
  nickname,
  playerId,
  previewWidgetRef,
}: PreviewActionOptions) {
  const [copyDialogOpen, setCopyDialogOpen] = useState(false)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [widgetUrl, setWidgetUrl] = useState("")
  const clipboard = useClipboard()
  const widgetExport = useWidgetExport({ config, nickname, previewWidgetRef })

  function currentWidgetUrl() {
    const normalizedPlayerId = playerId?.trim()
    return normalizedPlayerId
      ? buildWidgetUrl(window.location.origin, normalizedPlayerId, config)
      : null
  }

  async function copyWidgetUrl() {
    const url = currentWidgetUrl()
    if (!url) return
    setWidgetUrl(url)
    setCopyDialogOpen(true)
    await clipboard.copyUrl(url)
  }

  return {
    ...clipboard,
    ...widgetExport,
    canCopy: Boolean(playerId?.trim()),
    copyDialogOpen,
    feedbackDialogOpen,
    widgetUrl,
    setCopyDialogOpen,
    setFeedbackDialogOpen,
    copyWidgetUrl,
  }
}
