'use client'

import React, { useState, useEffect } from 'react'
import { isExternalUrl, resolveMenuUrl } from '@/lib/navigation'

interface MobileTopBarProps {
  logoUrl?: string
  hospitalName?: string
  hotline?: string
  items: any[]
  medproUrl?: string
}

export function MobileTopBar({
  logoUrl,
  hospitalName = 'BVĐK KV THỚI LAI',
  hotline = '02923686115',
  items,
  medproUrl = 'https://medpro.vn/',
}: MobileTopBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const cleanPhone = hotline.replace(/[^\d+]/g, '') || '02923686115'

  const handleClose = () => {
    setIsOpen(false)
    setExpandedItem(null)
  }

  const toggleItem = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedItem(prev => prev === index ? null : index)
  }

  return (
    <>
      {/* ── MOBILE TOP BAR ── */}
      <div className="mobileTopBar" role="banner">
        <a className="mobileTopBrand" href="/" aria-label="Trang chủ Bệnh viện Đa khoa Khu vực Thới Lai" onClick={handleClose}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt=""
              className="mobileTopLogo"
              width={36}
              height={36}
            />
          )}
          <span className="mobileTopName">{hospitalName}</span>
        </a>

        <div className="mobileTopActions">
          <a
            href={`tel:${cleanPhone}`}
            className="mobileTopCall"
            aria-label={`Gọi ${hotline}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7.4 3.6 10 7.3 8.3 9.1c1.1 2.3 3.1 4.3 5.4 5.4l1.8-1.7 3.7 2.6-.6 3.4c-.2 1-1.1 1.7-2.1 1.6C9.3 19.5 4.5 14.7 3.6 7.5c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z" />
            </svg>
          </a>
          <button
            type="button"
            className={`mobileTopHamburger${isOpen ? ' isOpen' : ''}`}
            onClick={() => setIsOpen(v => !v)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── BACKDROP ── */}
      <div
        className={`mobileMenuBackdrop${isOpen ? ' isActive' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── FULL MENU PANEL (slide down from top) ── */}
      <div
        className={`mobileMenuPanel${isOpen ? ' isActive' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng chính"
      >
        {/* Quick action buttons */}
        <div className="mobileMenuQuickRow">
          <a className="mqBtn mqBtnPrimary" href="/lich-kham" onClick={handleClose}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Lịch khám
          </a>
          <a className="mqBtn mqBtnSecondary" href={medproUrl} target="_blank" rel="noreferrer" onClick={handleClose}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Đặt khám
          </a>
          <a className="mqBtn mqBtnEmergency" href={`tel:${cleanPhone}`}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7.4 3.6 10 7.3 8.3 9.1c1.1 2.3 3.1 4.3 5.4 5.4l1.8-1.7 3.7 2.6-.6 3.4c-.2 1-1.1 1.7-2.1 1.6C9.3 19.5 4.5 14.7 3.6 7.5c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z" />
            </svg>
            Cấp cứu
          </a>
        </div>

        {/* Nav list */}
        <nav className="mobileMenuNav" aria-label="Danh mục điều hướng">
          <a className="mobileMenuItem" href="/" onClick={handleClose}>
            <span className="mobileMenuItemLabel">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
              </svg>
              Trang chủ
            </span>
          </a>

          {items.map((item: any, index: number) => {
            const url = resolveMenuUrl(item)
            const children = item.children?.filter((c: any) => c.visible !== false) || []
            if (url === '/' && index === 0) return null

            if (children.length === 0) {
              return (
                <a
                  key={`mi-${index}`}
                  className="mobileMenuItem"
                  href={url}
                  target={item.openInNewTab || isExternalUrl(url) ? '_blank' : undefined}
                  rel={item.openInNewTab || isExternalUrl(url) ? 'noreferrer' : undefined}
                  onClick={handleClose}
                >
                  <span className="mobileMenuItemLabel">{item.label}</span>
                </a>
              )
            }

            const isExpanded = expandedItem === index
            return (
              <div key={`mg-${index}`} className={`mobileMenuGroup${isExpanded ? ' isExpanded' : ''}`}>
                <button
                  type="button"
                  className="mobileMenuGroupBtn"
                  onClick={e => toggleItem(index, e)}
                  aria-expanded={isExpanded}
                >
                  <span className="mobileMenuItemLabel">{item.label}</span>
                  <svg
                    className={`mobileMenuChevron${isExpanded ? ' rotated' : ''}`}
                    viewBox="0 0 12 8"
                    width="12"
                    height="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m1 1.5 5 5 5-5" />
                  </svg>
                </button>
                <div className={`mobileMenuSubList${isExpanded ? ' isVisible' : ''}`}>
                  {children.map((child: any, ci: number) => {
                    const childUrl = resolveMenuUrl(child)
                    return (
                      <a
                        key={`mc-${ci}`}
                        href={childUrl}
                        className="mobileMenuSubItem"
                        target={child.openInNewTab || isExternalUrl(childUrl) ? '_blank' : undefined}
                        rel={child.openInNewTab || isExternalUrl(childUrl) ? 'noreferrer' : undefined}
                        onClick={handleClose}
                      >
                        <span aria-hidden="true">›</span>
                        {child.label}
                      </a>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}
