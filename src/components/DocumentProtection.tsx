'use client'

import React, { useEffect } from 'react'

interface DocumentProtectionProps {
  preventCopy?: boolean
  preventPrint?: boolean
  children: React.ReactNode
  className?: string
}

export function DocumentProtection({
  preventCopy = false,
  preventPrint = false,
  children,
  className = '',
}: DocumentProtectionProps) {
  const shouldProtect = preventCopy || preventPrint

  useEffect(() => {
    if (!shouldProtect) return

    // 1. Chặn click chuột phải
    const handleContextMenu = (e: MouseEvent) => {
      if (preventCopy) {
        e.preventDefault()
      }
    }

    // 2. Chặn các phím tắt copy, cut, paste, save, print, view source
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      // Chặn in (Ctrl+P / Cmd+P) nếu preventPrint hoặc preventCopy
      if ((e.ctrlKey || e.metaKey) && key === 'p') {
        if (preventPrint || preventCopy) {
          e.preventDefault()
          e.stopPropagation()
        }
      }

      // Chặn sao chép, lưu trang (Ctrl+C, Ctrl+S, Ctrl+U, Ctrl+A, Ctrl+X)
      if (preventCopy && (e.ctrlKey || e.metaKey) && ['c', 'u', 's', 'a', 'x'].includes(key)) {
        e.preventDefault()
        e.stopPropagation()
      }

      // Chặn F12 / DevTools khi preventCopy
      if (preventCopy && e.key === 'F12') {
        e.preventDefault()
      }
    }

    // 3. Chặn sự kiện copy/cut trên clipboard
    const handleCopy = (e: ClipboardEvent) => {
      if (preventCopy) {
        e.preventDefault()
      }
    }

    // 4. Chặn sự kiện trước khi in (beforeprint)
    const handleBeforePrint = (e: Event) => {
      if (preventPrint || preventCopy) {
        // Hủy hoặc xóa nội dung in nếu trình duyệt hỗ trợ
        alert('Tài liệu được thiết lập bảo vệ: Không cho phép in hoặc xuất PDF khi chưa mở khóa.')
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCopy)
    window.addEventListener('beforeprint', handleBeforePrint)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCopy)
      window.removeEventListener('beforeprint', handleBeforePrint)
    }
  }, [preventCopy, preventPrint, shouldProtect])

  return (
    <>
      {(preventPrint || preventCopy) && (
        <style jsx global>{`
          @media print {
            .protectedDocumentContent,
            .protectedPrintDisabled {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              overflow: hidden !important;
            }
            body::before {
              content: 'Tài liệu bảo mật - Bệnh viện Đa khoa Khu vực Thới Lai. Không cho phép in trực tiếp.' !important;
              display: block !important;
              padding: 40px !important;
              font-size: 16pt !important;
              font-weight: bold !important;
              text-align: center !important;
              color: #d32f2f !important;
            }
          }
        `}</style>
      )}
      <div
        className={`${className} ${preventCopy ? 'protectedDocumentContent' : ''} ${
          preventPrint ? 'protectedPrintDisabled' : ''
        }`}
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
    </>
  )
}

