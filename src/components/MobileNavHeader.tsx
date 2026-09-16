'use client'

import React, { useState, useRef, useEffect } from 'react'
import { isExternalUrl, resolveMenuUrl } from '@/lib/navigation'

interface MobileNavProps {
  items: any[]
}

export function MobileNavHeader({ items }: MobileNavProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [expandedDrawerItem, setExpandedDrawerItem] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Toggle desktop dropdown when clicking parent item on wide screens / direct bar
  const handleToggle = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenDropdown((prev) => (prev === index ? null : index))
  }

  // Toggle accordion in the mobile drawer
  const handleToggleDrawerItem = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedDrawerItem((prev) => (prev === index ? null : index))
  }

  // Close when clicking outside dropdown on desktop/bar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  // Listen to open/toggle events from Mobile Bottom Action Bar (Medpro style)
  useEffect(() => {
    const handleToggleEvent = () => setIsDrawerOpen((prev) => !prev)
    const handleOpenEvent = () => setIsDrawerOpen(true)
    const handleCloseEvent = () => setIsDrawerOpen(false)

    window.addEventListener('toggle-mobile-drawer', handleToggleEvent)
    window.addEventListener('open-mobile-drawer', handleOpenEvent)
    window.addEventListener('close-mobile-drawer', handleCloseEvent)

    return () => {
      window.removeEventListener('toggle-mobile-drawer', handleToggleEvent)
      window.removeEventListener('open-mobile-drawer', handleOpenEvent)
      window.removeEventListener('close-mobile-drawer', handleCloseEvent)
    }
  }, [])

  return (
    <>
      {/* Mobile Top Bar Quick Links (< 900px) */}
      <div className="mobileBarRow">
        <a className="mobileBarHomeBtn" href="/" onClick={() => setIsDrawerOpen(false)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Trang chủ</span>
        </a>

        {/* Nút mở toàn bộ Danh mục dạng Drawer */}
        <button
          type="button"
          className={`mobileBarMenuBtn ${isDrawerOpen ? 'btnActive' : ''}`}
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-expanded={isDrawerOpen}
          aria-label="Mở danh mục menu bệnh viện"
        >
          <span className="mobileBarMenuIcon">
            {isDrawerOpen ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </span>
          <strong>{isDrawerOpen ? 'Đóng' : 'DANH MỤC'}</strong>
        </button>
      </div>

      {/* Standard desktop / tablet menu bar */}
      <nav ref={navRef} className="mainMenu" aria-label="Điều hướng chính">
        <a className="navSimpleLink navHomeText" href="/" onClick={() => setOpenDropdown(null)}>
          Trang chủ
        </a>
        {items.map((item: any, index: number) => {
          const url = resolveMenuUrl(item)
          const children = item.children?.filter((child: any) => child.visible !== false) || []
          if (url === '/' && index === 0) return null

          if (children.length === 0) {
            return (
              <a
                className="navSimpleLink"
                href={url}
                target={item.openInNewTab || isExternalUrl(url) ? '_blank' : undefined}
                rel={item.openInNewTab || isExternalUrl(url) ? 'noreferrer' : undefined}
                key={`${item.label}-${index}`}
                onClick={() => setOpenDropdown(null)}
              >
                {item.label}
              </a>
            )
          }

          const isOpen = openDropdown === index

          return (
            <div
              className={`navItem ${isOpen ? 'mobileOpen' : ''}`}
              key={`${item.label}-${index}`}
            >
              <a
                className="navMainLink"
                href={item.linkType === 'parent' ? '#' : url}
                role="button"
                aria-expanded={isOpen}
                onClick={(e) => handleToggle(index, e)}
                target={item.linkType !== 'parent' && (item.openInNewTab || isExternalUrl(url)) ? '_blank' : undefined}
                rel={item.linkType !== 'parent' && (item.openInNewTab || isExternalUrl(url)) ? 'noreferrer' : undefined}
              >
                <span>{item.label}</span>
                <svg className={`navChevron ${isOpen ? 'chevronRotated' : ''}`} viewBox="0 0 12 8" aria-hidden="true">
                  <path d="m1 1.5 5 5 5-5" />
                </svg>
              </a>

              {/* Dropdown panel */}
              <div className={`navDropdown ${isOpen ? 'dropdownVisible' : ''}`}>
                {children.map((child: any, childIndex: number) => {
                  const childUrl = resolveMenuUrl(child)
                  return (
                    <a
                      key={`${child.label}-${childIndex}`}
                      href={childUrl}
                      target={child.openInNewTab || isExternalUrl(childUrl) ? '_blank' : undefined}
                      rel={child.openInNewTab || isExternalUrl(childUrl) ? 'noreferrer' : undefined}
                      onClick={() => setOpenDropdown(null)}
                    >
                      <span>{child.label}</span>
                      <i>›</i>
                    </a>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Backdrop overlay for Mobile Drawer */}
      <div
        className={`mobileDrawerBackdrop ${isDrawerOpen ? 'drawerActive' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Premium Mobile Navigation Drawer */}
      <div
        className={`mobileDrawerWrap ${isDrawerOpen ? 'drawerActive' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Danh mục điều hướng website"
      >
        <div className="mobileDrawerHeader">
          <div className="mobileDrawerTitle">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>Danh mục điều hướng</span>
          </div>
          <button
            type="button"
            className="mobileDrawerCloseBtn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Đóng danh mục"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mobileDrawerBody">
          {/* Nút Trang chủ đầu tiên */}
          <a
            href="/"
            className="drawerItemLink drawerItemHome"
            onClick={() => setIsDrawerOpen(false)}
          >
            <span className="drawerItemIcon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </span>
            <strong>Trang chủ</strong>
          </a>

          {/* Duyệt qua toàn bộ danh mục */}
          {items.map((item: any, index: number) => {
            const url = resolveMenuUrl(item)
            const children = item.children?.filter((child: any) => child.visible !== false) || []
            if (url === '/' && index === 0) return null

            // Mục đơn không có cấp con
            if (children.length === 0) {
              return (
                <a
                  key={`drawer-item-${index}`}
                  href={url}
                  className="drawerItemLink"
                  target={item.openInNewTab || isExternalUrl(url) ? '_blank' : undefined}
                  rel={item.openInNewTab || isExternalUrl(url) ? 'noreferrer' : undefined}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="drawerBullet">✦</span>
                  <strong>{item.label}</strong>
                </a>
              )
            }

            // Mục có danh mục con (Accordion xổ xuống ngay bên dưới)
            const isExpanded = expandedDrawerItem === index

            return (
              <div
                key={`drawer-group-${index}`}
                className={`drawerGroup ${isExpanded ? 'groupExpanded' : ''}`}
              >
                <button
                  type="button"
                  className="drawerGroupBtn"
                  onClick={(e) => handleToggleDrawerItem(index, e)}
                  aria-expanded={isExpanded}
                >
                  <div className="drawerGroupTitle">
                    <span className="drawerBullet">✦</span>
                    <strong>{item.label}</strong>
                  </div>
                  <span className={`drawerToggleIcon ${isExpanded ? 'iconRotated' : ''}`}>
                    <svg viewBox="0 0 12 8" width="13" height="9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m1 1.5 5 5 5-5" />
                    </svg>
                  </span>
                </button>

                {/* Danh sách các mục con xổ xuống */}
                <div className={`drawerSubList ${isExpanded ? 'subListVisible' : ''}`}>
                  {children.map((child: any, childIndex: number) => {
                    const childUrl = resolveMenuUrl(child)
                    return (
                      <a
                        key={`drawer-child-${childIndex}`}
                        href={childUrl}
                        className="drawerSubLink"
                        target={child.openInNewTab || isExternalUrl(childUrl) ? '_blank' : undefined}
                        rel={child.openInNewTab || isExternalUrl(childUrl) ? 'noreferrer' : undefined}
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        <span>{child.label}</span>
                        <i aria-hidden="true">›</i>
                      </a>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Chân drawer hỗ trợ gọi cấp cứu nhanh */}
        <div className="mobileDrawerFooter">
          <a href="tel:02923686115" className="drawerEmergencyBtn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
            <span>CẤP CỨU 24/7: 02923.686.115</span>
          </a>
        </div>
      </div>
    </>
  )
}
