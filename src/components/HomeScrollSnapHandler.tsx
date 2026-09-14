'use client'

import { useEffect } from 'react'

export function HomeScrollSnapHandler({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return

    const htmlEl = document.documentElement
    htmlEl.classList.add('hasSectionScrollSnap')

    return () => {
      htmlEl.classList.remove('hasSectionScrollSnap')
    }
  }, [enabled])

  return null
}
