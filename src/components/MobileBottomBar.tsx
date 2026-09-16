'use client'

import React from 'react'

interface MobileBottomBarProps {
  medproUrl: string
  emergencyHotline: string
}

export function MobileBottomBar({ medproUrl, emergencyHotline }: MobileBottomBarProps) {
  const handleOpenDrawer = (e: React.MouseEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-mobile-drawer'))
    }
  }

  const cleanPhone = emergencyHotline.replace(/[^\d+]/g, '') || '02923686115'

  return (
    <nav className="mobileActionBar" aria-label="Thanh điều hướng di động nhanh">
      {/* 1. Trang chủ */}
      <a href="/" className="mobileActionItem" aria-label="Trang chủ">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" />
        </svg>
        <span>Trang chủ</span>
      </a>

      {/* 2. Lịch khám */}
      <a href="/lich-kham" className="mobileActionItem" aria-label="Lịch khám bệnh">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
        <span>Lịch khám</span>
      </a>

      {/* 3. Đặt khám (Medpro style elevated button) */}
      <a
        className="mobileBooking"
        href={medproUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Đặt khám trực tuyến qua Medpro"
      >
        <span className="mobileBookingInner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </span>
        <span className="mobileBookingLabel">Đặt khám</span>
      </a>

      {/* 4. Danh mục điều hướng (Mở Drawer chuẩn Medpro) */}
      <button
        type="button"
        className="mobileActionItem mobileMenuBtn"
        onClick={handleOpenDrawer}
        aria-label="Mở toàn bộ danh mục menu bệnh viện"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span>Danh mục</span>
      </button>

      {/* 5. Cấp cứu 24/7 */}
      <a
        className="mobileActionItem mobileEmergency"
        href={`tel:${cleanPhone}`}
        aria-label={`Gọi cấp cứu ${cleanPhone}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7.4 3.6 10 7.3 8.3 9.1c1.1 2.3 3.1 4.3 5.4 5.4l1.8-1.7 3.7 2.6-.6 3.4c-.2 1-1.1 1.7-2.1 1.6C9.3 19.5 4.5 14.7 3.6 7.5c-.1-1 .6-1.9 1.6-2.1l2.2-.4Z" />
        </svg>
        <span>Cấp cứu</span>
      </a>
    </nav>
  )
}
