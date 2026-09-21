'use client'

import React, { useEffect, useState } from 'react'
import styles from './SiteVisitStats.module.css'

export interface VisitStatsConfig {
  showStats?: boolean
  showOnline?: boolean
  showToday?: boolean
  showMonth?: boolean
  showTotal?: boolean
  initialOffset?: number
}

interface VisitStatsData {
  online: number
  today: { views: number; visits: number }
  month: { views: number; visits: number }
  total: { views: number; visits: number }
}

export function SiteVisitStats({ config }: { config?: VisitStatsConfig }) {
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

  const formatNum = (num?: number) => {
    if (num === undefined || num === null) return '...'
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const offset = Number(config?.initialOffset || 0)
  const totalDisplay = (stats?.total.views || 0) + offset

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsTitle}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
        <span>Thống kê truy cập</span>
      </div>

      <div className={styles.statsGrid}>
        {showOnline && (
          <div className={styles.statItem} title="Số lượng người dùng đang truy cập trực tiếp">
            <span className={styles.onlinePulse}>
              <span className={styles.pulseDot} />
            </span>
            <span className={styles.statLabel}>Đang online:</span>
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
            <span className={styles.statLabel}>Hôm nay:</span>
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
            <span className={styles.statLabel}>Tháng này:</span>
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
            <span className={styles.statLabel}>Tổng lượt xem:</span>
            <strong className={`${styles.statValue} ${styles.totalValue}`}>
              {stats ? formatNum(totalDisplay) : '...'}
            </strong>
          </div>
        )}
      </div>
    </div>
  )
}
