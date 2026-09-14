'use client'

import React, { useState } from 'react'
import styles from './detail.module.css'
import { mediaUrl } from '@/lib/media'

export interface CustomShareItem {
  title: string
  shareUrlTemplate: string
  iconUrl?: string
}

export interface ShareButtonsProps {
  title: string
  horizontal?: boolean
  config?: {
    enabled?: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
    platformsOrder?: string
    showFacebook?: boolean
    facebookCustomIcon?: any
    showZalo?: boolean
    zaloCustomIcon?: any
    showCopyLink?: boolean
    copyLinkCustomIcon?: any
    showPrint?: boolean
    printCustomIcon?: any
    customShares?: CustomShareItem[]
    customSharesJson?: string
  }
}

export function ShareButtons({ title, horizontal = false, config }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  if (config?.enabled === false) {
    return null
  }

  const showFacebook = config?.showFacebook !== false
  const showZalo = config?.showZalo !== false
  const showCopyLink = config?.showCopyLink !== false
  const showPrint = config?.showPrint !== false

  // Parse custom shares from JSON nếu có
  let customShares: CustomShareItem[] = config?.customShares || []
  if ((!customShares || customShares.length === 0) && config?.customSharesJson) {
    try {
      const parsed = JSON.parse(config.customSharesJson)
      if (Array.isArray(parsed)) customShares = parsed
    } catch {}
  }

  const fbIcon = config?.facebookCustomIcon ? mediaUrl(config.facebookCustomIcon) : null
  const zaloIcon = config?.zaloCustomIcon ? mediaUrl(config.zaloCustomIcon) : null
  const copyIcon = config?.copyLinkCustomIcon ? mediaUrl(config.copyLinkCustomIcon) : null
  const printIcon = config?.printCustomIcon ? mediaUrl(config.printCustomIcon) : null

  const handleShareFb = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        '_blank',
        'noopener,noreferrer'
      )
    }
  }

  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleCustomShare = (template: string) => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      const finalUrl = template
        .replace(/{url}/g, encodeURIComponent(url))
        .replace(/{title}/g, encodeURIComponent(title))
      window.open(finalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Tùy chỉnh sắp xếp thứ tự hiển thị
  const orderRaw = config?.platformsOrder || 'facebook, zalo, copy, print, custom'
  const orderTokens = orderRaw.split(',').map((s) => s.trim().toLowerCase())

  const renderFacebook = () => {
    if (!showFacebook) return null
    return (
      <button
        key="facebook"
        type="button"
        className={styles.postDetailShareBtn}
        title="Chia sẻ lên Facebook"
        onClick={handleShareFb}
      >
        {fbIcon ? (
          <img src={fbIcon} alt="Facebook" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        )}
      </button>
    )
  }

  const renderZalo = () => {
    if (!showZalo) return null
    return (
      <a
        key="zalo"
        className={styles.postDetailShareBtn}
        title="Chia sẻ qua Zalo"
        href="https://zalo.me"
        target="_blank"
        rel="noopener noreferrer"
      >
        {zaloIcon ? (
          <img src={zaloIcon} alt="Zalo" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </a>
    )
  }

  const renderCopy = () => {
    if (!showCopyLink) return null
    return (
      <button
        key="copy"
        type="button"
        className={styles.postDetailShareBtn}
        title={copied ? 'Đã sao chép liên kết!' : 'Sao chép liên kết bài viết'}
        onClick={handleCopy}
        style={copied ? { color: '#16a34a', borderColor: '#86efac' } : {}}
      >
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : copyIcon ? (
          <img src={copyIcon} alt="Copy" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        )}
      </button>
    )
  }

  const renderPrint = () => {
    if (!showPrint) return null
    return (
      <button
        key="print"
        type="button"
        className={styles.postDetailShareBtn}
        title="In bài viết này"
        onClick={handlePrint}
      >
        {printIcon ? (
          <img src={printIcon} alt="Print" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
        )}
      </button>
    )
  }

  const renderCustom = () => {
    return customShares.map((custom, idx) => (
      <button
        key={`custom-${idx}`}
        type="button"
        className={styles.postDetailShareBtn}
        title={`Chia sẻ lên ${custom.title}`}
        onClick={() => handleCustomShare(custom.shareUrlTemplate)}
      >
        {custom.iconUrl ? (
          <img src={custom.iconUrl} alt={custom.title} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '11px', fontWeight: 800 }}>{custom.title.slice(0, 3).toUpperCase()}</span>
        )}
      </button>
    ))
  }

  // Kết hợp theo thứ tự được cấu hình
  const renderedMap: Record<string, React.ReactNode> = {
    facebook: renderFacebook(),
    zalo: renderZalo(),
    copy: renderCopy(),
    print: renderPrint(),
    custom: renderCustom(),
  }

  const orderedItems: React.ReactNode[] = []
  orderTokens.forEach((token) => {
    if (renderedMap[token]) {
      orderedItems.push(renderedMap[token])
      delete renderedMap[token]
    }
  })
  // Đưa các phần còn lại chưa có trong token vào sau
  Object.values(renderedMap).forEach((val) => {
    if (val) orderedItems.push(val)
  })

  if (horizontal) {
    return (
      <div className={styles.postDetailShareHorizontal} aria-label="Chia sẻ bài viết">
        <span className={styles.shareLabelHorizontal}>Chia sẻ:</span>
        <div className={styles.postDetailShareButtonsHorizontal}>{orderedItems}</div>
      </div>
    )
  }

  return (
    <aside className={styles.postDetailShareCol} aria-label="Chia sẻ bài viết">
      <span>Chia sẻ</span>
      <div className={styles.postDetailShareButtons}>{orderedItems}</div>
    </aside>
  )
}
