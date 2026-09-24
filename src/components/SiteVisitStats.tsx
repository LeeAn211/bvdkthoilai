'use client'

import React, { useEffect, useState } from 'react'
import styles from './SiteVisitStats.module.css'

export interface VisitStatsConfig {
  showStats?: boolean
  kicker?: string
  title?: string
  metaTag?: string
  metaOrg?: string
  showOnline?: boolean
  onlineLabel?: string
  showToday?: boolean
  todayLabel?: string
  showMonth?: boolean
  monthLabel?: string
  showTotal?: boolean
  totalLabel?: string
  initialOffset?: number
}

interface VisitStatsData {
  online: number
  today: { views: number; visits: number }
  month: { views: number; visits: number }
  total: { views: number; visits: number }
}

interface SiteVisitStatsProps {
  config?: VisitStatsConfig
  variant?: 'inline' | 'ribbon'
}

export function SiteVisitStats({ config, variant = 'inline' }: SiteVisitStatsProps) {
  const [stats, setStats] = useState<VisitStatsData | null>(null)

  useEffect(() => {
    // 1. Ghi nhận lượt truy cập
    try {
      fetch('/api/site-visits', { method: 'POST' }).catch(() => {})
    } catch {}

    // 2. Tải số liệu thống kê hiển thị
    fetch('/api/site-visits')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data)
        }
      })
      .catch(() => {})

    // Cập nhật nhịp tim online định kỳ mỗi 60s
    const interval = setInterval(() => {
      fetch('/api/site-visits')
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setStats(res.data)
          }
        })
        .catch(() => {})
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (config?.showStats === false) return null

  const showOnline = config?.showOnline !== false
  const showToday = config?.showToday !== false
  const showMonth = config?.showMonth !== false
  const showTotal = config?.showTotal !== false

  // Nhãn & Tiêu đề quản trị từ CMS
  const kickerText = config?.kicker?.trim() || 'HỆ THỐNG GIÁM SÁT TRUY CẬP'
  const titleText = config?.title?.trim() || 'Thống kê truy cập Cổng thông tin điện tử'
  const metaTagText = config?.metaTag?.trim() || 'Hệ thống thời gian thực'
  const metaOrgText = config?.metaOrg?.trim() || 'BVĐK KHU VỰC THỚI LAI'

  const onlineLabelText = config?.onlineLabel?.trim() || 'Đang trực tuyến'
  const todayLabelText = config?.todayLabel?.trim() || 'Lượt truy cập ngày'
  const monthLabelText = config?.monthLabel?.trim() || 'Lượt truy cập tháng'
  const totalLabelText = config?.totalLabel?.trim() || 'Tổng lượt truy cập'

  const formatNum = (num?: number) => {
    if (num === undefined || num === null) return '...'
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const offset = Number(config?.initialOffset || 0)
  const totalDisplay = (stats?.total.views || 0) + offset

  // ── BIẾN THỂ 1: DẢI RIBBON CAO CẤP NẰM TRÊN FOOTER (PHƯƠNG ÁN 1) ──
  if (variant === 'ribbon') {
    return (
      <div className={styles.statsRibbonWrapper}>
        <div className={`container ${styles.statsRibbonContainer}`}>
          {/* TIÊU ĐỀ KHỐI THỐNG KÊ (BỐ CỤC 2 VẾ CÂN ĐỐI) */}
          <div className={styles.statsRibbonHeader}>
            <div className={styles.statsRibbonLeft}>
              <div className={styles.statsRibbonIconWrap} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              </div>
              <div className={styles.statsRibbonTitleBox}>
                <span className={styles.statsRibbonKicker}>{kickerText}</span>
                <h3 className={styles.statsRibbonTitle}>{titleText}</h3>
              </div>
            </div>

            <div className={styles.statsRibbonMeta}>
              <span className={styles.statsRibbonLiveBadge}>
                <span className={styles.onlinePulseRibbon}>
                  <span className={styles.pulseDotRibbon} />
                </span>
                {metaTagText}
              </span>
              <span className={styles.statsRibbonDivider} aria-hidden="true">•</span>
              <span className={styles.statsRibbonOrg}>{metaOrgText}</span>
            </div>
          </div>

          {/* DẢI 4 THẺ SỐ LIỆU: BỐ CỤC CÂN ĐỐI 2 BÊN + ICON HỘP + MINI SPARKLINE */}
          <div className={styles.statsRibbonGrid}>
            {/* THẺ 1: ĐANG TRỰC TUYẾN */}
            {showOnline && (
              <div className={`${styles.statsCard} ${styles.onlineCard}`}>
                <div className={styles.statsCardBody}>
                  <div className={styles.statsCardIconWrap}>
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 12h3l2-4 4 8 3-6 2 2h4" />
                    </svg>
                  </div>
                  <div className={styles.statsCardInfo}>
                    <div className={styles.statsCardLabelRow}>
                      <span className={styles.statsCardLabel}>{onlineLabelText}</span>
                      <span className={styles.onlineStatusPill}>
                        <span className={styles.pulseDotMini} />
                        Trực tiếp
                      </span>
                    </div>
                    <div className={styles.statsCardNumber}>
                      {stats ? formatNum(stats.online) : '1'}
                    </div>
                  </div>
                </div>

                {/* Họa tiết sparkline chìm góc phải tạo chiều sâu thẩm mỹ */}
                <div className={styles.statsCardSparkline} aria-hidden="true">
                  <svg viewBox="0 0 70 26" fill="none" preserveAspectRatio="none">
                    <path d="M0 20 Q 15 22 25 14 T 45 10 T 70 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M0 20 Q 15 22 25 14 T 45 10 T 70 4 L 70 26 L 0 26 Z" fill="currentColor" fillOpacity="0.08" />
                  </svg>
                </div>
              </div>
            )}

            {/* THẺ 2: TRUY CẬP HÔM NAY */}
            {showToday && (
              <div className={`${styles.statsCard} ${styles.todayCard}`}>
                <div className={styles.statsCardBody}>
                  <div className={styles.statsCardIconWrap}>
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="3" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <div className={styles.statsCardInfo}>
                    <div className={styles.statsCardLabelRow}>
                      <span className={styles.statsCardLabel}>{todayLabelText}</span>
                      <span className={styles.statsCardBadge}>Hôm nay</span>
                    </div>
                    <div className={styles.statsCardNumber}>
                      {stats ? formatNum(stats.today.views) : '...'}
                    </div>
                  </div>
                </div>

                <div className={styles.statsCardSparkline} aria-hidden="true">
                  <svg viewBox="0 0 70 26" fill="none" preserveAspectRatio="none">
                    <path d="M0 22 Q 18 10 35 15 T 70 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M0 22 Q 18 10 35 15 T 70 5 L 70 26 L 0 26 Z" fill="currentColor" fillOpacity="0.08" />
                  </svg>
                </div>
              </div>
            )}

            {/* THẺ 3: TRONG THÁNG */}
            {showMonth && (
              <div className={`${styles.statsCard} ${styles.monthCard}`}>
                <div className={styles.statsCardBody}>
                  <div className={styles.statsCardIconWrap}>
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 3v18h18" />
                      <path d="m7 14 4-4 4 4 5-6" />
                      <path d="M16 8h4v4" />
                    </svg>
                  </div>
                  <div className={styles.statsCardInfo}>
                    <div className={styles.statsCardLabelRow}>
                      <span className={styles.statsCardLabel}>{monthLabelText}</span>
                      <span className={styles.statsCardBadge}>Tháng {new Date().getMonth() + 1}</span>
                    </div>
                    <div className={styles.statsCardNumber}>
                      {stats ? formatNum(stats.month.views) : '...'}
                    </div>
                  </div>
                </div>

                <div className={styles.statsCardSparkline} aria-hidden="true">
                  <svg viewBox="0 0 70 26" fill="none" preserveAspectRatio="none">
                    <path d="M0 24 Q 20 20 38 12 T 70 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M0 24 Q 20 20 38 12 T 70 3 L 70 26 L 0 26 Z" fill="currentColor" fillOpacity="0.08" />
                  </svg>
                </div>
              </div>
            )}

            {/* THẺ 4: TỔNG LƯỢT TRUY CẬP */}
            {showTotal && (
              <div className={`${styles.statsCard} ${styles.totalCard}`}>
                <div className={styles.statsCardBody}>
                  <div className={styles.statsCardIconWrap}>
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <div className={styles.statsCardInfo}>
                    <div className={styles.statsCardLabelRow}>
                      <span className={styles.statsCardLabel}>{totalLabelText}</span>
                      <span className={styles.statsCardBadge}>Toàn bộ</span>
                    </div>
                    <div className={styles.statsCardNumber}>
                      {stats ? formatNum(totalDisplay) : '...'}
                    </div>
                  </div>
                </div>

                <div className={styles.statsCardSparkline} aria-hidden="true">
                  <svg viewBox="0 0 70 26" fill="none" preserveAspectRatio="none">
                    <path d="M0 18 Q 20 16 35 12 T 70 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M0 18 Q 20 16 35 12 T 70 4 L 70 26 L 0 26 Z" fill="currentColor" fillOpacity="0.08" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── BIẾN THỂ 2: INLINE COMPACT (DÙNG CHO FOOTER BOTTOM HOẶC THANH GỌN) ──
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsTitle}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
        <span>{titleText || 'Thống kê truy cập'}</span>
      </div>

      <div className={styles.statsGrid}>
        {showOnline && (
          <div className={styles.statItem} title="Số lượng người dùng đang truy cập trực tiếp">
            <span className={styles.onlinePulse}>
              <span className={styles.pulseDot} />
            </span>
            <span className={styles.statLabel}>{onlineLabelText}:</span>
            <strong className={`${styles.statValue} ${styles.onlineValue}`}>
              {stats ? formatNum(stats.online) : '1'}
            </strong>
          </div>
        )}

        {showToday && (
          <div className={styles.statItem} title="Số lượt truy cập trang trong ngày hôm nay">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className={styles.statLabel}>{todayLabelText}:</span>
            <strong className={styles.statValue}>
              {stats ? formatNum(stats.today.views) : '...'}
            </strong>
          </div>
        )}

        {showMonth && (
          <div className={styles.statItem} title="Số lượt truy cập trong tháng hiện tại">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className={styles.statLabel}>{monthLabelText}:</span>
            <strong className={styles.statValue}>
              {stats ? formatNum(stats.month.views) : '...'}
            </strong>
          </div>
        )}

        {showTotal && (
          <div className={styles.statItem} title="Tổng số lượt truy cập từ trước đến nay">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className={styles.statLabel}>{totalLabelText}:</span>
            <strong className={`${styles.statValue} ${styles.totalValue}`}>
              {stats ? formatNum(totalDisplay) : '...'}
            </strong>
          </div>
        )}
      </div>
    </div>
  )
}
