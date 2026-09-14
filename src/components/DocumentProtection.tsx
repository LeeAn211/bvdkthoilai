'use client'

import React, { useEffect } from 'react'

interface DocumentProtectionProps {
  preventCopy?: boolean
  children: React.ReactNode
  className?: string
}

export function DocumentProtection({ preventCopy = false, children, className = '' }: DocumentProtectionProps) {
  useEffect(() => {
    if (!preventCopy) return

    // 1. Chặn click chuột phải
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    // 2. Chặn các phím tắt copy, cut, paste, save, print, view source
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'u', 's', 'p', 'a', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
      // Chặn F12 / DevTools
      if (e.key === 'F12') {
        e.preventDefault()
      }
    }

    // 3. Chặn sự kiện copy/cut trên clipboard
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCopy)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCopy)
    }
  }, [preventCopy])

  return (
    <div
      className={`${className} ${preventCopy ? 'protectedDocumentContent' : ''}`}
      style={
        preventCopy
          ? {
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }
          : undefined
      }
      onContextMenu={preventCopy ? (e) => e.preventDefault() : undefined}
    >
      {children}
    </div>
  )
}
