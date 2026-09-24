'use client'

import { useEffect } from 'react'

export interface ArticleViewTrackerProps {
  collection: 'news' | 'notices' | 'clinical-protocols' | 'health-warnings'
  slug: string
}

export function ArticleViewTracker({ collection, slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!slug) return
    const sessionKey = `viewed_${collection}_${slug}`
    // Tránh spam đếm view khi người dùng reload liên tục trong cùng 1 phiên làm việc
    if (sessionStorage.getItem(sessionKey)) return

    try {
      fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, slug }),
      })
        .then(() => {
          sessionStorage.setItem(sessionKey, '1')
        })
        .catch(() => {})
    } catch {}
  }, [collection, slug])

  return null
}
