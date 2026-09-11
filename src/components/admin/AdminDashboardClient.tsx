'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminCharts, { MonthData, DepartmentStat } from './AdminCharts'
import AdminDashboardCustomizer, { CardItem, ChartVisibility } from './AdminDashboardCustomizer'
import styles from './AdminDashboard.module.css'

type GlyphName = 'content' | 'feedback' | 'procurement' | 'schedule' | 'chat' | 'news' | 'notice' | 'document' | 'settings' | 'people' | 'medical' | 'media' | 'chart' | 'survey' | 'shield' | 'price' | 'arrowUpRight' | 'sparkles' | 'check' | 'clock' | 'building' | 'cpu' | 'briefcase' | 'folder'

function DashboardGlyph({ name }: { name: GlyphName }) {
  const paths: Record<GlyphName, React.ReactNode> = {
    content: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></>,
    feedback: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    procurement: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    schedule: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></>,
    chat: <><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></>,
    news: <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/></>,
    notice: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></>,
    document: <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    medical: <><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M12 11v6"/><path d="M9 14h6"/></>,
    media: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
    chart: <><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></>,
    survey: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    price: <><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    arrowUpRight: <><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></>,
    sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    building: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></>,
    cpu: <><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2"/></>,
    briefcase: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    folder: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export interface MetricCardConfig {
  id: string
  title: string
  value: number
  badge: string
  badgeType: 'neutral' | 'warning' | 'info' | 'success' | 'danger'
  subtext: string
  href: string
  icon: GlyphName
  visible: boolean
}

interface AdminDashboardClientProps {
  initialMetricCards: MetricCardConfig[]
  initialCharts: ChartVisibility
  timelineData: MonthData[]
  departmentStats: DepartmentStat[]
  satisfactionScore: number
  surveyResponses: number
  slaResolvedPercent: number
  accountSummaryNode: React.ReactNode
  commandBarNode: React.ReactNode
  bentoContentNode: React.ReactNode
}

export default function AdminDashboardClient({
  initialMetricCards,
  initialCharts,
  timelineData,
  departmentStats,
  satisfactionScore,
  surveyResponses,
  slaResolvedPercent,
  accountSummaryNode,
  commandBarNode,
  bentoContentNode,
}: AdminDashboardClientProps) {
  const [cards, setCards] = useState<MetricCardConfig[]>(initialMetricCards)
  const [charts, setCharts] = useState<ChartVisibility>(initialCharts)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Đọc cấu hình từ localStorage sau khi mount
  useEffect(() => {
    setIsClient(true)
    try {
      const savedCardsStr = localStorage.getItem('thoilai_admin_dashboard_cards')
      if (savedCardsStr) {
        const savedCards: CardItem[] = JSON.parse(savedCardsStr)
        // Áp dụng thứ tự và trạng thái visible từ local storage
        const cardMap = new Map(initialMetricCards.map((c) => [c.id, c]))
        const reordered: MetricCardConfig[] = []

        savedCards.forEach((sc) => {
          const original = cardMap.get(sc.id)
          if (original) {
            reordered.push({ ...original, visible: sc.visible })
            cardMap.delete(sc.id)
          }
        })

        // Bổ sung các card mới nếu có
        cardMap.forEach((remainingCard) => {
          reordered.push(remainingCard)
        })

        setCards(reordered)
      }

      const savedChartsStr = localStorage.getItem('thoilai_admin_dashboard_charts')
      if (savedChartsStr) {
        setCharts(JSON.parse(savedChartsStr))
      }
    } catch {
      // ignore
    }
  }, [initialMetricCards])

  const handleUpdate = (updatedCardItems: CardItem[], updatedCharts: ChartVisibility) => {
    const cardMap = new Map(cards.map((c) => [c.id, c]))
    const newCards: MetricCardConfig[] = updatedCardItems
      .map((item) => {
        const found = cardMap.get(item.id)
        if (found) {
          return { ...found, visible: item.visible }
        }
        return null
      })
      .filter((c): c is MetricCardConfig => Boolean(c))

    setCards(newCards)
    setCharts(updatedCharts)
  }

  const visibleCards = cards.filter((c) => c.visible)

  return (
    <div className={styles.container}>
      {/* 1. Header */}
      <header className={styles.topHeader}>
        <div className={styles.headerLead}>
          <div className={styles.breadcrumb}>
            <span className={styles.orgTag}>Bệnh viện ĐKKV Thới Lai</span>
            <span className={styles.slash}>/</span>
            <span className={styles.currentSection}>Admin Console</span>
            <span className={styles.versionBadge}>v4.4 Pro</span>
          </div>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Tổng quan điều hành</h1>
            <div className={styles.systemStatusPill}>
              <span className={styles.statusDot} />
              <span>Hệ thống trực tuyến</span>
            </div>
          </div>
          <p className={styles.pageSubtitle}>
            Trung tâm điều phối thông tin, dịch vụ bệnh nhân và xuất bản nội dung số.
          </p>
        </div>

        <div className={styles.headerActions}>
          {accountSummaryNode}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => setShowCustomizer(true)}
              className={styles.buttonOutline}
              title="Tùy chỉnh bật/tắt và sắp xếp thống kê"
            >
              <DashboardGlyph name="settings" />
              <span>Tùy chỉnh thống kê</span>
            </button>
            <Link href="/" target="_blank" className={styles.buttonOutline}>
              <span>Mở website</span>
              <DashboardGlyph name="arrowUpRight" />
            </Link>
            <Link href="/admin/collections/news/create" className={styles.buttonSolid}>
              <DashboardGlyph name="sparkles" />
              <span>+ Tạo bài viết</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. System Live Metrics Bar */}
      {commandBarNode}

      {/* 3. Metric Stats Grid */}
      <section className={styles.statsGrid}>
        {visibleCards.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
            Bạn đã ẩn toàn bộ thẻ thống kê. Nhấn <strong>"Tùy chỉnh thống kê"</strong> ở góc phải trên để bật lại các mục bạn muốn xem.
          </div>
        )}
        {visibleCards.map((card, idx) => (
          <Link href={card.href} key={card.id || idx} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitleWrapper}>
                <span className={styles.statIcon}><DashboardGlyph name={card.icon} /></span>
                <span className={styles.statTitle}>{card.title}</span>
              </div>
              <span className={`${styles.badge} ${styles[`badge_${card.badgeType}`]}`}>
                {card.badge}
              </span>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statNumber}>{card.value}</span>
              <p className={styles.statSubtext}>{card.subtext}</p>
            </div>
            <div className={styles.statFooter}>
              <span className={styles.statLinkText}>Chi tiết</span>
              <DashboardGlyph name="arrowUpRight" />
            </div>
          </Link>
        ))}
      </section>

      {/* 3.5. Interactive Analytics & Performance Charts Hub */}
      <AdminCharts
        timeline={timelineData}
        departmentStats={departmentStats}
        satisfactionScore={satisfactionScore}
        totalSurveys={surveyResponses || 120}
        slaRate={slaResolvedPercent}
        feedbackAvgHours={4.5}
        showAreaChart={charts.showAreaChart}
        showDepartmentBar={charts.showDepartmentBar}
        showSatisfactionGauge={charts.showSatisfactionGauge}
        showSlaStats={charts.showSlaStats}
      />

      {/* 4, 5, 6, 7. Bento Grid, Activity Feeds & Commands */}
      {bentoContentNode}

      {/* Modal Customizer Popup */}
      {showCustomizer && (
        <AdminDashboardCustomizer
          initialCards={cards.map((c) => ({
            id: c.id,
            title: c.title,
            subtext: c.subtext,
            visible: c.visible,
          }))}
          initialCharts={charts}
          onUpdate={handleUpdate}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  )
}
