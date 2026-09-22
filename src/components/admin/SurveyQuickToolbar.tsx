'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import styles from './SurveyQuickToolbar.module.css'

interface CampaignItem {
  id: number
  title: string
  slug: string
  active?: boolean
  questionsCount?: number
}

interface CategoryBreakdownItem {
  id: number | string
  title: string
  slug: string
  count: number
  percent: number
  averageScore: number
}

interface CampaignStats {
  ok: boolean
  period?: string
  campaign: {
    id: number | string
    title: string
    slug: string
    active?: boolean
    startAt?: string
    endAt?: string
  }
  responses: number
  averageScore: number
  satisfactionRate: number
  ratingDistribution: {
    verySatisfied: number
    satisfied: number
    neutral: number
    unsatisfied: number
  }
  categoryBreakdown?: CategoryBreakdownItem[]
  recentResponses: Array<{
    code: string
    date: string
    score: string | number
    comment: string
    campaignTitle?: string
  }>
}

const DEFAULT_CAMPAIGNS: CampaignItem[] = [
  { id: 1, title: 'Khảo sát Sự hài lòng Người bệnh Khám Ngoại trú', slug: 'ngoai-tru', active: true },
  { id: 2, title: 'Khảo sát Sự hài lòng Người bệnh Điều trị Nội trú', slug: 'noi-tru', active: true },
  { id: 3, title: 'Khảo sát Ý kiến & Sự hài lòng Nhân viên Y tế', slug: 'nhan-vien', active: true },
]

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'day', label: 'Hôm nay' },
  { value: 'week', label: '7 ngày' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: '6months', label: '6 tháng' },
  { value: '9months', label: '9 tháng' },
  { value: 'year', label: 'Năm nay' },
]

const RATING_ROWS = [
  { key: 'verySatisfied' as const, label: 'Rất hài lòng', emoji: '😍', color: '#10b981', bg: 'linear-gradient(90deg,#10b981,#059669)' },
  { key: 'satisfied' as const,     label: 'Hài lòng',     emoji: '🙂', color: '#0284c7', bg: 'linear-gradient(90deg,#38bdf8,#0284c7)' },
  { key: 'neutral' as const,       label: 'Bình thường',   emoji: '😐', color: '#d97706', bg: 'linear-gradient(90deg,#fbbf24,#d97706)' },
  { key: 'unsatisfied' as const,   label: 'Chưa hài lòng', emoji: '🙁', color: '#dc2626', bg: 'linear-gradient(90deg,#f87171,#dc2626)' },
]

export default function SurveyQuickToolbar() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [stats, setStats] = useState<CampaignStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    let isMounted = true
    fetch('/api/surveys/templates')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (isMounted && data?.campaigns?.length > 0) setCampaigns(data.campaigns) })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true
    setLoadingStats(true)
    fetch(`/api/surveys/statistics?campaign=${selectedCampaignId}&period=${selectedPeriod}&details=admin`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (isMounted && data) setStats(data) })
      .catch(() => {})
      .finally(() => { if (isMounted) setLoadingStats(false) })
    return () => { isMounted = false }
  }, [selectedCampaignId, selectedPeriod])

  const totalVotes = stats
    ? stats.ratingDistribution.verySatisfied + stats.ratingDistribution.satisfied +
      stats.ratingDistribution.neutral + stats.ratingDistribution.unsatisfied
    : 0

  const getPct = (n: number) => (!totalVotes ? 0 : Math.round((n / totalVotes) * 100))

  const handleExport = () =>
    window.open(`/api/surveys/export?campaign=${selectedCampaignId}&period=${selectedPeriod}`, '_blank')

  const periodLabel = PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label ?? ''

  return (
    <section className={styles.container}>
      {/* ── HEADER ── */}
      <div className={styles.header}>
        <div className={styles.badge}>HỆ THỐNG KHẢO SÁT Ý KIẾN — BVĐK KHU VỰC THỚI LAI</div>
        <h2 className={styles.title}>Quản Lý Khảo Sát Ý Kiến &amp; Kết Quả Đánh Giá</h2>
        <p className={styles.desc}>
          Theo dõi lượt tham gia, phân tích mức độ hài lòng và xuất báo cáo Excel theo từng đợt và khoảng thời gian.
        </p>
      </div>

      {/* ── PANEL THỐNG KÊ ── */}
      <div className={styles.statsPanel}>

        {/* Toolbar row */}
        <div className={styles.toolbarRow}>
          <div className={styles.selectGroup}>
            <span className={styles.selectLabel}>📊 Đợt khảo sát:</span>
            <select
              className={styles.select}
              value={selectedCampaignId}
              onChange={e => startTransition(() => setSelectedCampaignId(e.target.value))}
            >
              <option value="all">🌟 Tất cả (toàn bệnh viện)</option>
              <optgroup label="Từng loại cụ thể:">
                {campaigns.map(c => (
                  <option key={c.id} value={String(c.id)}>
                    #{c.id} — {c.title} {c.active ? '(Đang mở)' : '(Đã đóng)'}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className={styles.actionGroup}>
            <Link href="/admin/collections/survey-responses" className={styles.btnOutline}>
              📑 Xem tất cả phiếu →
            </Link>
            <button type="button" className={styles.btnExport} onClick={handleExport}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Period filter */}
        <div className={styles.periodRow}>
          <span className={styles.periodLabel}>⏳ Thời gian:</span>
          <div className={styles.periodBtns}>
            {PERIOD_OPTIONS.map(p => (
              <button
                key={p.value}
                type="button"
                className={selectedPeriod === p.value ? `${styles.periodBtn} ${styles.periodBtnActive}` : styles.periodBtn}
                onClick={() => startTransition(() => setSelectedPeriod(p.value))}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {loadingStats ? (
          <div className={styles.loadingMsg}>⏳ Đang tải dữ liệu...</div>
        ) : stats ? (
          <div className={styles.statsBody}>

            {/* KPI cards */}
            <div className={styles.kpiRow}>
              <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
                <div className={styles.kpiValue}>{stats.responses}</div>
                <div className={styles.kpiLabel}>Tổng lượt gửi</div>
                <div className={styles.kpiSub}>{periodLabel}</div>
              </div>
              <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
                <div className={styles.kpiValue}>{stats.averageScore > 0 ? `${stats.averageScore}★` : '—'}</div>
                <div className={styles.kpiLabel}>Điểm TB</div>
                <div className={styles.kpiSub}>Thang 5 sao</div>
              </div>
              <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
                <div className={styles.kpiValue}>{stats.satisfactionRate}%</div>
                <div className={styles.kpiLabel}>Tỷ lệ hài lòng</div>
                <div className={styles.kpiSub}>Hài lòng &amp; rất hài lòng</div>
              </div>
              <div className={`${styles.kpiCard} ${styles.kpiGray}`}>
                <div className={styles.kpiValue} style={{ fontSize: 13, marginTop: 4 }}>
                  {selectedCampaignId === 'all' ? '🌟 Tất cả' : stats.campaign.title}
                </div>
                <div className={styles.kpiLabel}>Mục tiêu</div>
                <div className={styles.kpiSub} style={{ color: stats.campaign.active ? '#16a34a' : '#64748b' }}>
                  {stats.campaign.active ? '🟢 Đang mở' : '🔴 Đã đóng'}
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            {stats.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
              <div className={styles.breakdownRow}>
                {stats.categoryBreakdown.map(cat => (
                  <div
                    key={cat.id}
                    className={selectedCampaignId === String(cat.id) ? `${styles.breakdownCard} ${styles.breakdownCardActive}` : styles.breakdownCard}
                    onClick={() => startTransition(() => setSelectedCampaignId(String(cat.id)))}
                    title="Bấm để lọc riêng loại này"
                  >
                    <div className={styles.breakdownTop}>
                      <span className={styles.breakdownTitle}>
                        {cat.id === 1 ? '🩺' : cat.id === 2 ? '🏥' : cat.id === 3 ? '👨‍⚕️' : '📋'} {cat.title}
                      </span>
                      <span className={styles.breakdownCount}>{cat.count} lượt</span>
                    </div>
                    <div className={styles.breakdownBar}>
                      <div className={styles.breakdownBarFill} style={{ width: `${cat.percent}%` }} />
                    </div>
                    <div className={styles.breakdownMeta}>
                      <span>{cat.percent}%</span>
                      <span>ĐTB: {cat.averageScore > 0 ? `${cat.averageScore}★` : '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rating chart */}
            <div className={styles.chartBlock}>
              <div className={styles.chartTitle}>📈 Phân bổ mức độ hài lòng — {periodLabel}</div>
              <div className={styles.chartRows}>
                {RATING_ROWS.map(row => {
                  const val = stats.ratingDistribution[row.key]
                  const pct = getPct(val)
                  return (
                    <div key={row.key} className={styles.chartRow}>
                      <span className={styles.chartRowLabel} style={{ color: row.color }}>
                        {row.emoji} {row.label}
                      </span>
                      <div className={styles.chartBarWrap}>
                        <div className={styles.chartBar} style={{ width: `${pct}%`, background: row.bg }} />
                      </div>
                      <span className={styles.chartRowStat} style={{ color: row.color }}>
                        {val} <small>({pct}%)</small>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent responses */}
            {stats.recentResponses && stats.recentResponses.length > 0 && (
              <div className={styles.recentBlock}>
                <div className={styles.recentTitle}>📋 Lượt khảo sát gần đây</div>
                <div className={styles.recentTableWrap}>
                  <table className={styles.recentTable}>
                    <thead>
                      <tr>
                        <th>Mã phiếu</th>
                        <th>Loại KS</th>
                        <th>Thời gian</th>
                        <th>Điểm</th>
                        <th>Ý kiến</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentResponses.map((r, i) => (
                        <tr key={i}>
                          <td className={styles.tdCode}>{r.code}</td>
                          <td>{r.campaignTitle || 'Khảo sát'}</td>
                          <td>{r.date ? new Date(r.date).toLocaleString('vi-VN') : '—'}</td>
                          <td className={styles.tdScore}>{r.score ? `${r.score}★` : '—'}</td>
                          <td className={styles.tdComment}>{r.comment || '(Không có)'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyMsg}>Chưa có dữ liệu cho lựa chọn này.</div>
        )}
      </div>

      {/* ── LIÊN KẾT NHANH ── */}
      <div className={styles.bannerGrid}>
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>📋</span>
            <div>
              <strong className={styles.cardTitle}>Tạo Đợt Khảo Sát Mới hoặc Sử Dụng Lại Mẫu Có Sẵn</strong>
              <p className={styles.cardDesc}>
                1-Click nạp mẫu chuẩn (Ngoại trú, Nội trú, Nhân viên) hoặc sao chép câu hỏi từ đợt cũ.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            <Link href="/admin/collections/survey-campaigns/create" className={styles.settingBtn}>
              + Tạo Đợt Mới →
            </Link>
            <Link href="/admin/globals/survey-page-settings" className={styles.settingBtn} style={{ background: '#475569' }}>
              ⚙️ Cấu hình Trang Khảo sát →
            </Link>
            <a href="/templates/mau-khao-sat-cau-hoi.docx" download className={styles.settingBtn} style={{ background: '#2b579a', textDecoration: 'none' }}>
              📄 Mẫu Word
            </a>
            <a href="/templates/mau-khao-sat-cau-hoi.xlsx" download className={styles.settingBtn} style={{ background: '#107c41', textDecoration: 'none' }}>
              📊 Mẫu Excel
            </a>
          </div>
        </div>

        <div className={styles.linksCard}>
          <div className={styles.linksHeader}>
            <span className={styles.icon}>✏️</span>
            <strong className={styles.cardTitle}>Truy cập nhanh 3 Mẫu Khảo sát Chuẩn Bộ Y tế:</strong>
          </div>
          <div className={styles.linkButtons} style={{ marginBottom: '12px' }}>
            {(() => {
              const outCamp = campaigns.find(c => c.slug === 'ngoai-tru')
              const inCamp = campaigns.find(c => c.slug === 'noi-tru')
              const staffCamp = campaigns.find(c => c.slug === 'nhan-vien')
              return (
                <>
                  <Link href={outCamp ? `/admin/collections/survey-campaigns/${outCamp.id}` : '/admin/collections/survey-campaigns'} className={styles.settingBtn} style={{ background: '#0284c7' }}>🩺 Ngoại trú →</Link>
                  <Link href={inCamp ? `/admin/collections/survey-campaigns/${inCamp.id}` : '/admin/collections/survey-campaigns'} className={styles.settingBtn} style={{ background: '#0284c7' }}>🏥 Nội trú →</Link>
                  <Link href={staffCamp ? `/admin/collections/survey-campaigns/${staffCamp.id}` : '/admin/collections/survey-campaigns'} className={styles.settingBtn} style={{ background: '#0284c7' }}>👨‍⚕️ Nhân viên →</Link>
                </>
              )
            })()}
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '8px' }}>
            <strong>Xem trước giao diện người bệnh:</strong>
          </div>
          <div className={styles.linkButtons}>
            <Link href="/khao-sat/ngoai-tru" target="_blank" className={styles.pillLink}>Ngoại trú ↗</Link>
            <Link href="/khao-sat/noi-tru" target="_blank" className={styles.pillLink}>Nội trú ↗</Link>
            <Link href="/khao-sat/nhan-vien" target="_blank" className={styles.pillLink}>Nhân viên ↗</Link>
            <Link href="/khao-sat" target="_blank" className={styles.pillLinkSecondary}>Cổng chung ↗</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
