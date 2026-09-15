'use client'

import React, { useState, useRef, useEffect } from 'react'
import { isExternalUrl, resolveMenuUrl } from '@/lib/navigation'

interface MobileNavProps {
  items: any[]
}

export function MobileNavHeader({ items }: MobileNavProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Toggle dropdown when clicking parent item on mobile
  const handleToggle = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenDropdown((prev) => (prev === index ? null : index))
  }

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
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
              {item.linkType !== 'parent' && (
                <a
                  href={url}
                  className="navDropdownAll"
                  onClick={() => setOpenDropdown(null)}
                >
                  <span>Xem tất cả {item.label}</span>
                  <i>›</i>
                </a>
              )}
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
  )
}
