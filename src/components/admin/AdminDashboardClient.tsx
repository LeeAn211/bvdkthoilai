'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import AdminCharts, { MonthData, DepartmentStat } from './AdminCharts'
import AdminDashboardCustomizer, { CardItem, ChartVisibility } from './AdminDashboardCustomizer'
import SurveyQuickToolbar from './SurveyQuickToolbar'
import styles from './AdminDashboard.module.css'

export type GlyphName =
  | 'content' | 'feedback' | 'procurement' | 'schedule' | 'chat' | 'news'
  | 'notice' | 'document' | 'settings' | 'people' | 'medical' | 'media'
  | 'chart' | 'survey' | 'shield' | 'price' | 'arrowUpRight' | 'sparkles'
  | 'check' | 'clock' | 'building' | 'cpu' | 'briefcase' | 'folder'
  | 'stethoscope' | 'microscope' | 'clipboardCheck' | 'shieldCheck' | 'layout'

export function DashboardGlyph({ name }: { name: GlyphName }) {
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
    stethoscope: <><path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"/><circle cx="18" cy="18" r="3"/><path d="M9 12.5V17a3 3 0 0 0 3 3h3"/></>,
    microscope: <><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0-7-7h1"/><circle cx="9" cy="9" r="2"/><path d="m14 8 3-3 2 2-3 3"/><path d="m12 10 4 4"/></>,
    clipboardCheck: <><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></>,
    shieldCheck: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
    layout: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></>,
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.content}
    </svg>
  )
}

export type CategoryGroupId = 'all' | 'kham-benh' | 'chuyen-mon' | 'truyen-thong' | 'cskh' | 'giao-dien' | 'he-thong'

export interface MetricCardConfig {
  id: string
  title: string
  value: number
  badge: string
  badgeType?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  subtext: string
  href: string
  createHref?: string
  icon: GlyphName
  categoryGroup: CategoryGroupId
  visible: boolean
}

export interface AdminDashboardClientProps {
  initialMetricCards: MetricCardConfig[]
  initialCharts: ChartVisibility
  timelineData: MonthData[]
  departmentStats: DepartmentStat[]
  satisfactionScore: number
  surveyResponses: number
  slaResolvedPercent: number
  totalAppointments?: number
  clinicalProtocols?: number
  contentBreakdown?: any[]
  totalContent?: number
  totalFeedback?: number
  feedbackNew?: number
  feedbackProcessing?: number
  feedbackDone?: number
  feedbackDonePercent?: string
  feedbackProcessingPercent?: string
  accountSummaryNode: React.ReactNode
  commandBarNode: React.ReactNode
  bentoContentNode: React.ReactNode
  pendingTriageNode?: React.ReactNode
}

export default function AdminDashboardClient({
  initialMetricCards,
  initialCharts,
  timelineData,
  departmentStats,
  satisfactionScore,
  surveyResponses,
  slaResolvedPercent,
  totalAppointments,
  clinicalProtocols,
  contentBreakdown = [],
  totalContent = 0,
  totalFeedback = 0,
  feedbackNew = 0,
  feedbackProcessing = 0,
  feedbackDone = 0,
  feedbackDonePercent = '0%',
  feedbackProcessingPercent = '0%',
  accountSummaryNode,
  commandBarNode,
  bentoContentNode,
  pendingTriageNode,
}: AdminDashboardClientProps) {
  const [cards, setCards] = useState<MetricCardConfig[]>(initialMetricCards)
  const [charts, setCharts] = useState<ChartVisibility>(initialCharts)
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroupId>('all')
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Đọc cấu hình từ localStorage sau khi mount
  useEffect(() => {
    setIsClient(true)
    try {
      const savedCardsStr = localStorage.getItem('thoilai_admin_dashboard_cards')
      if (savedCardsStr) {
        const savedCards: CardItem[] = JSON.parse(savedCardsStr)
        const cardMap = new Map(initialMetricCards.map((c) => [c.id, c]))
        const reordered: MetricCardConfig[] = []

        savedCards.forEach((sc) => {
          const original = cardMap.get(sc.id)
          if (original) {
            reordered.push({ ...original, visible: sc.visible })
            cardMap.delete(sc.id)
          }
        })

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

  // Danh mục nhóm nghiệp vụ với SVG Glyphs chuẩn y tế cao cấp
  const categoryTabs: { id: CategoryGroupId; label: string; glyph: GlyphName }[] = [
    { id: 'all', label: 'Tất cả phân hệ', glyph: 'sparkles' },
    { id: 'kham-benh', label: 'Khám bệnh & Dịch vụ Y tế', glyph: 'medical' },
    { id: 'chuyen-mon', label: 'Chuyên môn & Tổ chức', glyph: 'stethoscope' },
    { id: 'truyen-thong', label: 'Truyền thông & Văn bản', glyph: 'news' },
    { id: 'cskh', label: 'Chăm sóc & Khảo sát', glyph: 'feedback' },
    { id: 'giao-dien', label: 'Trang chủ & Giao diện', glyph: 'layout' },
    { id: 'he-thong', label: 'Hệ thống & Dữ liệu', glyph: 'shieldCheck' },
  ]

  const visibleCards = useMemo(() => {
    return cards.filter((c) => {
      if (!c.visible) return false
      if (selectedGroup === 'all') return true
      return c.categoryGroup === selectedGroup
    })
  }, [cards, selectedGroup])

  // Đếm số card theo từng nhóm
  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { all: cards.filter((c) => c.visible).length }
    cards.forEach((c) => {
      if (c.visible && c.categoryGroup) {
        counts[c.categoryGroup] = (counts[c.categoryGroup] || 0) + 1
      }
    })
    return counts
  }, [cards])

  return (
    <div className={styles.container}>
      {/* 1. Header */}
      <header className={styles.topHeader}>
        <div className={styles.headerLead}>
          <div className={styles.breadcrumb}>
            <span className={styles.orgTag}>Bệnh viện ĐKKV Thới Lai</span>
            <span className={styles.slash}>/</span>
            <span className={styles.currentSection}>Admin Console</span>
            <span className={styles.versionBadge}>v4.5 Pro Medical</span>
          </div>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Trung tâm Thống kê & Điều hành</h1>
            <div className={styles.systemStatusPill}>
              <span className={styles.statusDot} />
              <span>Hệ thống trực tuyến</span>
            </div>
          </div>
          <p className={styles.pageSubtitle}>
            Hệ thống quản lý dữ liệu số toàn diện: Khám chữa bệnh, Chuyên môn y tế, Truyền thông & Chăm sóc người bệnh.
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

      {/* 1.5. Pending Triage Banner (Placed at the very top for immediate visibility) */}
      {pendingTriageNode}

      {/* 2. System Live Metrics Bar */}
      {commandBarNode}

      {/* 2.2. Interactive Analytics & Performance Charts Hub (Đưa lên trên trước các phân hệ) */}
      <AdminCharts
        timeline={timelineData}
        departmentStats={departmentStats}
        satisfactionScore={satisfactionScore}
        totalSurveys={surveyResponses || 120}
        slaRate={slaResolvedPercent}
        feedbackAvgHours={4.5}
        totalAppointments={totalAppointments}
        clinicalProtocols={clinicalProtocols}
        showAreaChart={charts.showAreaChart}
        showDepartmentBar={charts.showDepartmentBar}
        showSatisfactionGauge={charts.showSatisfactionGauge}
        showSlaStats={charts.showSlaStats}
        showWeeklyWorkload={charts.showWeeklyWorkload !== false}
        showProtocolDistribution={charts.showProtocolDistribution !== false}
        showResourceStructure={charts.showResourceStructure !== false}
        showFeedbackDonut={charts.showFeedbackDonut !== false}
        chartOrder={charts.chartOrder}
        contentBreakdown={contentBreakdown}
        totalContent={totalContent}
        totalFeedback={totalFeedback}
        feedbackNew={feedbackNew}
        feedbackProcessing={feedbackProcessing}
        feedbackDone={feedbackDone}
        feedbackDonePercent={feedbackDonePercent}
        feedbackProcessingPercent={feedbackProcessingPercent}
      />

      {/* 2.3. Bảng Thống Kê Khảo Sát & Xuất Excel Theo Từng Đợt (Chăm sóc người bệnh & Khảo sát) */}
      <div style={{ marginTop: 24 }}>
        <SurveyQuickToolbar />
      </div>

      {/* 2.5. Modern Segmented Tab Navigation Hub */}
      <nav className={styles.tabNavContainer} aria-label="Bộ lọc phân hệ quản trị">
        <div className={styles.tabNavHeader}>
          <div className={styles.tabNavTitleGroup}>
            <span className={styles.tabNavPill}>BỘ LỌC PHÂN HỆ</span>
            <span className={styles.tabNavHint}>Lọc nhanh chỉ số theo cụm nghiệp vụ bệnh viện</span>
          </div>
          <span className={styles.tabNavStatsText}>
            Hiển thị <strong>{visibleCards.length}</strong> / {cards.filter((c) => c.visible).length} chỉ số
          </span>
        </div>

        <div className={styles.tabList} role="tablist">
          {categoryTabs.map((tab) => {
            const isActive = selectedGroup === tab.id
            const count = groupCounts[tab.id] || 0
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedGroup(tab.id)}
                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
              >
                <span className={styles.tabBtnIcon}>
                  <DashboardGlyph name={tab.glyph} />
                </span>
                <span className={styles.tabBtnLabel}>{tab.label}</span>
                <span className={`${styles.tabBtnCount} ${isActive ? styles.tabBtnCountActive : ''}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* 3. Metric Stats Grid */}
      <section className={styles.statsGrid}>
        {visibleCards.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#334155' }}>
              Không có chỉ số nào trong phân hệ này hoặc tất cả thẻ đã bị ẩn.
            </p>
            <p style={{ margin: 0, fontSize: '13px' }}>
              Hãy nhấn <strong>"Tùy chỉnh thống kê"</strong> ở góc phải trên để bật các mục hoặc chuyển sang tab <strong>"Tất cả phân hệ"</strong>.
            </p>
          </div>
        )}
        {visibleCards.map((card, idx) => (
          <div key={card.id || idx} className={styles.statCard}>
            <div className={styles.statHeader}>
              <Link href={card.href} className={styles.statTitleWrapper} title={`Xem danh sách ${card.title}`}>
                <span className={styles.statIcon}><DashboardGlyph name={card.icon} /></span>
                <span className={styles.statTitle}>{card.title}</span>
              </Link>
              <span className={`${styles.badge} ${styles[`badge_${card.badgeType}`]}`}>
                {card.badge}
              </span>
            </div>
            <Link href={card.href} className={styles.statBody} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className={styles.statNumber}>{card.value}</span>
              <p className={styles.statSubtext}>{card.subtext}</p>
            </Link>
            <div className={styles.statFooter}>
              <Link href={card.href} className={styles.statFooterLeft} style={{ textDecoration: 'none' }}>
                <span>Quản lý danh sách</span>
                <DashboardGlyph name="arrowUpRight" />
              </Link>
              {card.createHref && (
                <Link href={card.createHref} className={styles.statCreateLink} title={`Tạo mới ${card.title}`}>
                  <DashboardGlyph name="sparkles" />
                  <span>+ Thêm</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>

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

