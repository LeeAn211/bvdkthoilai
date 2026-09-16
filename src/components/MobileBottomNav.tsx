'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Thanh điều hướng dưới cùng cố định trên mobile (< 900px)
 * Kiểu medpro.vn — 4 tab: Trang chủ | Lịch khám | Đặt khám | Cấp cứu
 */
export function MobileBottomNav({
  hotline = '02923686115',
  medproUrl = 'https://medpro.vn/',
}: {
  hotline?: string
  medproUrl?: string
}) {
  const pathname = usePathname()
  const cleanPhone = hotline.replace(/[^\d+]/g, '') || '02923686115'

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="mobileBottomNav" aria-label="Điều hướng nhanh dưới màn hình">
      {/* Trang chủ */}
      <Link
        href="/"
        className={`mbnTab${isActive('/') ? ' mbnActive' : ''}`}
        aria-label="Trang chủ"
      >
        <span className="mbnIcon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12L12 3l9 9" />
            <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
          </svg>
        </span>
        <span className="mbnLabel">Trang chủ</span>
      </Link>

      {/* Lịch khám */}
      <Link
        href="/lich-kham"
        className={`mbnTab${isActive('/lich-kham') ? ' mbnActive' : ''}`}
        aria-label="Lịch khám"
      >
        <span className="mbnIcon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
        <span className="mbnLabel">Lịch khám</span>
      </Link>

      {/* Đặt khám — nút nổi bật ở giữa */}
      <a
        href={medproUrl}
        target="_blank"
        rel="noreferrer"
        className="mbnTab mbnBooking"
        aria-label="Đặt khám trực tuyến"
      >
        <span className="mbnBookingCircle">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="mbnLabel">Đặt khám</span>
      </a>

      {/* Cấp cứu */}
      <a
        href={`tel:${cleanPhone}`}
        className="mbnTab mbnEmergency"
        aria-label={`Gọi cấp cứu ${hotline}`}
      >
        <span className="mbnIcon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.4 3.6 10 7.3 8.3 9.1c1.1 2.3 3.1 4.3 5.4 5.4l1.8-1.7 3.7 2.6-.6 3.4c-.2 1-1.1 1.7-2.1 1.6C9.3 19.5 4.5 14.7 3.6 7.5c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z" />
          </svg>
        </span>
        <span className="mbnLabel">Cấp cứu</span>
      </a>
    </nav>
  )
}
