'use client'

import React, { useState, useEffect } from 'react'
import { isExternalUrl, resolveMenuUrl } from '@/lib/navigation'
import { getVisibilityClass, shouldRender } from '@/lib/deviceVisibility'

interface SocialLink {
  platform?: string
  label?: string
  url: string
}

interface MobileTopBarProps {
  hotline?: string
  items: any[]
  medproUrl?: string
  socialLinks?: SocialLink[]
  topBarVisibility?: string
  searchVisibility?: string
  socialsVisibility?: string
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#1877f2" />
          <path d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z" fill="#fff" />
        </svg>
      )
    case 'zalo':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#0b7df0" />
          <text x="3" y="17" fill="#fff" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif">ZALO</text>
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#ff0033" />
          <polygon points="9,7 19,12 9,17" fill="#fff" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#010101" />
          <path d="M16 3h-3v11a2 2 0 1 1-2-2v-3a5 5 0 1 0 5 5V8a7 7 0 0 0 4 1V6a4 4 0 0 1-4-3z" fill="#fff" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        </svg>
      )
  }
}

export function MobileTopBar({
  hotline = '02923686115',
  items,
  medproUrl = 'https://medpro.vn/',
  socialLinks = [],
  topBarVisibility = 'mobile_only',
  searchVisibility = 'mobile_only',
  socialsVisibility = 'mobile_only',
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

  const handleClose = () => {
    setIsOpen(false)
    setExpandedItem(null)
  }

  const toggleItem = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedItem(prev => prev === index ? null : index)
  }

  if (!shouldRender(topBarVisibility)) return null

  const visibleSocials = socialLinks.slice(0, 3)
  const cleanPhone = hotline.replace(/[^\d+]/g, '') || '02923686115'

  return (
    <>
      <div className={`mobileTopBar ${getVisibilityClass(topBarVisibility)}`} role="banner">
        {shouldRender(searchVisibility) && (
          <form
            className={`mobileTopSearch ${getVisibilityClass(searchVisibility)}`}
            action="/tim-kiem"
            method="get"
            role="search"
            onSubmit={handleClose}
          >
            <svg
              className="mobileTopSearchIcon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              name="q"
              type="search"
              className="mobileTopSearchInput"
              placeholder="Tìm kiếm dịch vụ, bác sĩ..."
              minLength={2}
              maxLength={100}
              aria-label="Tìm kiếm trên website bệnh viện"
            />
          </form>
        )}

        {shouldRender(socialsVisibility) && visibleSocials.length > 0 && (
          <div className={`mobileTopSocials ${getVisibilityClass(socialsVisibility)}`} aria-label="Mạng xã hội">
            {visibleSocials.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="mobileTopSocialLink"
                aria-label={s.label || s.platform || 'Mạng xã hội'}
              >
                <SocialIcon platform={String(s.platform || '').toLowerCase()} />
              </a>
            ))}
          </div>
        )}

        <button
          type="button"
          className={`mobileTopHamburger${isOpen ? ' isOpen' : ''}`}
          onClick={() => setIsOpen(v => !v)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
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

      <div
        className={`mobileMenuBackdrop${isOpen ? ' isActive' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`mobileMenuPanel${isOpen ? ' isActive' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng chính"
      >
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
                        <span aria-hidden="true">&rsaquo;</span>
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
