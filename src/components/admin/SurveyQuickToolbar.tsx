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
  { value: 'all', label: 'Toàn bộ thời gian' },
  { value: 'day', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này (7 ngày)' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này (3 tháng)' },
  { value: '6months', label: '6 tháng gần nhất' },
  { value: '9months', label: '9 tháng gần nhất' },
  { value: 'year', label: 'Năm nay (12 tháng)' },
]

export default function SurveyQuickToolbar() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(DEFAULT_CAMPAIGNS)
  // 'all' nghĩa là tất cả các loại khảo sát, hoặc ID cụ thể của đợt
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all')
  // Lọc theo mốc thời gian: all | day | week | month | quarter | 6months | 9months | year
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')

  const [stats, setStats] = useState<CampaignStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [isPending, startTransition] = useTransition()

  // 1. Tải danh sách đợt khảo sát đầy đủ từ server
  useEffect(() => {
    let isMounted = true
    async function loadCampaigns() {
      try {
        const res = await fetch('/api/surveys/templates')
        if (res.ok) {
          const data = await res.json()
          if (isMounted && data.campaigns && data.campaigns.length > 0) {
            setCampaigns(data.campaigns)
          }
        }
      } catch (e) {
        console.warn('Lỗi khi tải danh sách đợt khảo sát:', e)
      }
    }
    loadCampaigns()
    return () => {
      isMounted = false
    }
  }, [])

  // 2. Tải thống kê khi thay đổi đợt khảo sát hoặc thay đổi khoảng thời gian
  useEffect(() => {
    let isMounted = true
    setLoadingStats(true)

    async function loadStats() {
      try {
        const res = await fetch(
          `/api/surveys/statistics?campaign=${selectedCampaignId}&period=${selectedPeriod}&details=admin`
        )
        if (res.ok) {
          const data = await res.json()
          if (isMounted) {
            setStats(data)
          }
        }
      } catch (err) {
        console.warn('Lỗi khi tải thống kê đợt khảo sát:', err)
      } finally {
        if (isMounted) setLoadingStats(false)
      }
    }

    loadStats()
    return () => {
      isMounted = false
    }
  }, [selectedCampaignId, selectedPeriod])

  const totalVotes = stats
    ? stats.ratingDistribution.verySatisfied +
      stats.ratingDistribution.satisfied +
      stats.ratingDistribution.neutral +
      stats.ratingDistribution.unsatisfied
    : 0

  const getPercent = (count: number) => {
    if (!totalVotes) return 0
    return Math.round((count / totalVotes) * 100)
  }

  const handleExportExcel = () => {
    window.open(
      `/api/surveys/export?campaign=${selectedCampaignId}&period=${selectedPeriod}`,
      '_blank'
    )
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>HỆ THỐNG KHẢO SÁT Ý KIẾN BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI</div>
        <h2 className={styles.title}>Quản Lý Khảo Sát Ý Kiến & Kết Quả Đánh Giá</h2>
        <p className={styles.desc}>
          Khu vực quản lý thống nhất: Quản lý các đợt khảo sát, theo dõi số lượt tham gia theo <strong>ngày, tuần, tháng, quý, năm</strong>, xem chi tiết từng phiếu đánh giá, biểu đồ phân tích và xuất báo cáo Excel (.xlsx).
        </p>
      </div>

      {/* ── BẢNG THỐNG KÊ & BIỂU ĐỒ THEO TỪNG ĐỢT & THỜI GIAN ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1.5px solid #0284c7',
          borderRadius: 14,
          padding: '18px 22px',
          marginBottom: 20,
          boxShadow: '0 4px 16px rgba(2, 132, 199, 0.08)',
        }}
      >
        {/* Hàng 1: Thanh chọn đợt khảo sát & Các nút tác vụ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
            paddingBottom: 14,
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {/* Bộ chọn Đợt khảo sát */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <strong style={{ fontSize: 13.5, color: '#0f172a' }}>Xem loại khảo sát:</strong>
            <select
              value={selectedCampaignId}
              onChange={(e) => {
                const val = e.target.value
                startTransition(() => {
                  setSelectedCampaignId(val)
                })
              }}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                border: '1.5px solid #0284c7',
                background: '#fff',
                fontSize: 13,
                fontWeight: 700,
                color: '#0369a1',
                cursor: 'pointer',
                minWidth: 260,
                outline: 'none',
              }}
            >
              <option value="all">🌟 TẤT CẢ CÁC LOẠI KHẢO SÁT (Toàn bệnh viện)</option>
              <optgroup label="📋 Từng loại khảo sát cụ thể:">
                {campaigns.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    🔹 #{c.id} - {c.title} {c.active ? '(Đang mở)' : '(Đã kết thúc)'}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Các nút tác vụ: Xem chi tiết phiếu & Xuất file Excel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href="/admin/collections/survey-responses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#0369a1',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
              title="Mở bảng lưu trữ toàn bộ các phiếu trả lời chi tiết trong hệ thống"
            >
              <span>📑 Xem bảng tất cả phiếu gửi về →</span>
            </Link>

            <button
              type="button"
              onClick={handleExportExcel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 20px',
                borderRadius: 8,
                border: 0,
                background: 'linear-gradient(135deg, #107c41, #059669)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 124, 65, 0.25)',
              }}
              title="Bấm để tải về file Excel danh sách các lượt khảo sát theo mốc thời gian đã chọn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>📥 Xuất file Excel (.xlsx) mốc này</span>
            </button>
          </div>
        </div>

        {/* Hàng 2: Bộ lọc thời gian: Ngày, Tuần, Tháng, Quý, 6 tháng, 9 tháng, Năm */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            paddingTop: 12,
            paddingBottom: 4,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>⏳</span> <strong>Khoảng thời gian:</strong>
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PERIOD_OPTIONS.map((p) => {
              const isSelected = selectedPeriod === p.value
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setSelectedPeriod(p.value)
                    })
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 7,
                    border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: isSelected ? '#e0f2fe' : '#ffffff',
                    color: isSelected ? '#0369a1' : '#334155',
                    fontSize: 12,
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 1px 4px rgba(2, 132, 199, 0.15)' : 'none',
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Nội dung kết quả thống kê & Biểu đồ */}
        {loadingStats ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: '#0284c7', fontSize: 13, fontWeight: 700 }}>
            ⏳ Đang tính toán dữ liệu thống kê cho khoảng thời gian này...
          </div>
        ) : stats ? (
          <div style={{ marginTop: 14 }}>
            {/* Hàng thẻ KPI nổi bật */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ background: '#f0f9ff', padding: '12px 16px', borderRadius: 10, border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                  Tổng lượt gửi phiếu
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0284c7', marginTop: 4 }}>
                  {stats.responses} <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>lượt</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  {PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label}
                </div>
              </div>

              <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                  Điểm đánh giá TB
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#16a34a', marginTop: 4 }}>
                  {stats.averageScore > 0 ? `${stats.averageScore} / 5` : 'Chưa có'}
                </div>
                <div style={{ fontSize: 11, color: '#15803d', marginTop: 2 }}>Thang điểm chuẩn 5 sao</div>
              </div>

              <div style={{ background: '#fdf4ff', padding: '12px 16px', borderRadius: 10, border: '1px solid #f5d0fe' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#86198f', textTransform: 'uppercase' }}>
                  Tỷ lệ hài lòng
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#a21caf', marginTop: 4 }}>
                  {stats.satisfactionRate}%
                </div>
                <div style={{ fontSize: 11, color: '#86198f', marginTop: 2 }}>Mức hài lòng & rất hài lòng</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Đang xem mục tiêu
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={stats.campaign.title}>
                  {selectedCampaignId === 'all' ? '🌟 Tất cả loại khảo sát' : stats.campaign.title}
                </div>
                <div style={{ fontSize: 11, color: stats.campaign.active ? '#16a34a' : '#64748b', marginTop: 2 }}>
                  {stats.campaign.active ? '🟢 Đang mở tiếp nhận' : '🔴 Đã kết thúc'}
                </div>
              </div>
            </div>

            {/* PHẦN 1: BẢNG PHÂN RÃ SỐ LƯỢT CHO TỪNG LOẠI KHẢO SÁT */}
            {stats.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                    📊 Số lượt khảo sát cho từng loại ({PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label}):
                  </div>
                  <span style={{ fontSize: 11.5, color: '#64748b' }}>
                    Tổng cộng: <b>{stats.responses} lượt</b>
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                  {stats.categoryBreakdown.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        startTransition(() => {
                          setSelectedCampaignId(String(cat.id))
                        })
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: selectedCampaignId === String(cat.id) ? '#f0f9ff' : '#f8fafc',
                        border: selectedCampaignId === String(cat.id) ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        transition: 'all 0.15s ease',
                      }}
                      title="Bấm để lọc chi tiết riêng cho loại khảo sát này"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                          {cat.id === 1 ? '🩺' : cat.id === 2 ? '🏥' : cat.id === 3 ? '👨‍⚕️' : '📋'} {cat.title}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#0284c7' }}>
                          {cat.count} <span style={{ fontSize: 10.5, color: '#64748b', fontWeight: 500 }}>lượt</span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                        <span>Chiếm: <b>{cat.percent}%</b></span>
                        <span>ĐTB: <b>{cat.averageScore > 0 ? `${cat.averageScore}★` : '—'}</b></span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginTop: 2 }}>
                        <div
                          style={{
                            width: `${cat.percent}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #0284c7, #059669)',
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN 2: BIỂU ĐỒ PHÂN BỔ MỨC ĐỘ HÀI LÒNG */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                📈 Biểu đồ phân bổ mức độ hài lòng ({selectedCampaignId === 'all' ? 'Tất cả các loại' : stats.campaign.title}) - {PERIOD_OPTIONS.find((p) => p.value === selectedPeriod)?.label}:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Rất hài lòng */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#15803d' }}>
                      😍 Rất hài lòng (4.5 - 5 sao / 9 - 10 điểm): <b>{stats.ratingDistribution.verySatisfied} lượt</b>
                    </span>
                    <span style={{ fontWeight: 800, color: '#15803d' }}>{getPercent(stats.ratingDistribution.verySatisfied)}%</span>
                  </div>
                  <div style={{ width: '100%', height: 12, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${getPercent(stats.ratingDistribution.verySatisfied)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: 999,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Hài lòng */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#0284c7' }}>
                      🙂 Hài lòng (3.5 - 4.4 sao / 7 - 8.9 điểm): <b>{stats.ratingDistribution.satisfied} lượt</b>
                    </span>
                    <span style={{ fontWeight: 800, color: '#0284c7' }}>{getPercent(stats.ratingDistribution.satisfied)}%</span>
                  </div>
                  <div style={{ width: '100%', height: 12, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${getPercent(stats.ratingDistribution.satisfied)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #38bdf8, #0284c7)',
                        borderRadius: 999,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Bình thường */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#d97706' }}>
                      😐 Bình thường (2.5 - 3.4 sao / 5 - 6.9 điểm): <b>{stats.ratingDistribution.neutral} lượt</b>
                    </span>
                    <span style={{ fontWeight: 800, color: '#d97706' }}>{getPercent(stats.ratingDistribution.neutral)}%</span>
                  </div>
                  <div style={{ width: '100%', height: 12, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${getPercent(stats.ratingDistribution.neutral)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #fbbf24, #d97706)',
                        borderRadius: 999,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Chưa hài lòng */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#dc2626' }}>
                      🙁 Chưa hài lòng (&lt; 2.5 sao / &lt; 5 điểm): <b>{stats.ratingDistribution.unsatisfied} lượt</b>
                    </span>
                    <span style={{ fontWeight: 800, color: '#dc2626' }}>{getPercent(stats.ratingDistribution.unsatisfied)}%</span>
                  </div>
                  <div style={{ width: '100%', height: 12, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${getPercent(stats.ratingDistribution.unsatisfied)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #f87171, #dc2626)',
                        borderRadius: 999,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PHẦN 3: DANH SÁCH CÁC LƯỢT KHẢO SÁT GẦN NHẤT */}
            {stats.recentResponses && stats.recentResponses.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 12.5, fontWeight: 800, color: '#0f172a' }}>
                  📋 Danh sách các lượt khảo sát gần đây nhất (Bấm nút &quot;Xuất file Excel&quot; ở trên để tải toàn bộ bảng):
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto', fontSize: 12 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                        <th style={{ padding: '8px 12px' }}>Mã phiếu</th>
                        <th style={{ padding: '8px 12px' }}>Loại khảo sát</th>
                        <th style={{ padding: '8px 12px' }}>Thời gian</th>
                        <th style={{ padding: '8px 12px' }}>Điểm TB</th>
                        <th style={{ padding: '8px 12px' }}>Ý kiến phản hồi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentResponses.map((r, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '7px 12px', fontWeight: 700, color: '#0284c7' }}>{r.code}</td>
                          <td style={{ padding: '7px 12px', color: '#334155', fontWeight: 600 }}>{r.campaignTitle || 'Khảo sát'}</td>
                          <td style={{ padding: '7px 12px', color: '#475569' }}>
                            {r.date ? new Date(r.date).toLocaleString('vi-VN') : '—'}
                          </td>
                          <td style={{ padding: '7px 12px', fontWeight: 800, color: '#16a34a' }}>
                            {r.score ? `${r.score}★` : '—'}
                          </td>
                          <td style={{ padding: '7px 12px', color: '#334155' }}>
                            {r.comment || '(Không có ý kiến thêm)'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            Chưa có đợt khảo sát nào được chọn hoặc chưa có dữ liệu.
          </div>
        )}
      </div>

      {/* ── KHỐI CÁC LIÊN KẾT NHANH & TẠO ĐỢT MỚI ── */}
      <div className={styles.bannerGrid}>
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>📋</span>
            <div>
              <strong className={styles.cardTitle}>Tạo Đợt Khảo Sát Mới hoặc Sử Dụng Lại Mẫu Có Sẵn</strong>
              <p className={styles.cardDesc}>
                Khi tạo đợt mới, bạn có thể <strong>1-Click nạp mẫu chuẩn (Ngoại trú, Nội trú, Nhân viên)</strong> hoặc <strong>sao chép câu hỏi từ bất kỳ đợt cũ nào</strong> mà không phải nhập lại từ đầu.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            <Link
              href="/admin/collections/survey-campaigns/create"
              className={styles.settingBtn}
            >
              <span>+ Tạo Đợt Khảo sát Mới →</span>
            </Link>
            <a
              href="/templates/mau-khao-sat-cau-hoi.docx"
              download="mau-khao-sat-cau-hoi.docx"
              className={styles.settingBtn}
              style={{ background: '#2b579a', textDecoration: 'none' }}
            >
              📄 Tải Mẫu Word (.docx)
            </a>
            <a
              href="/templates/mau-khao-sat-cau-hoi.xlsx"
              download="mau-khao-sat-cau-hoi.xlsx"
              className={styles.settingBtn}
              style={{ background: '#107c41', textDecoration: 'none' }}
            >
              📊 Tải Mẫu Excel (.xlsx)
            </a>
          </div>
        </div>

        <div className={styles.linksCard}>
          <div className={styles.linksHeader}>
            <span className={styles.icon}>✏️</span>
            <strong className={styles.cardTitle}>Truy cập nhanh 3 Mẫu Khảo sát Chuẩn Bộ Y tế:</strong>
          </div>
          <div className={styles.linkButtons} style={{ marginBottom: '12px' }}>
            <Link href="/admin/collections/survey-campaigns/1" className={styles.settingBtn} style={{ background: '#0284c7' }}>
              🩺 Mẫu Ngoại trú →
            </Link>
            <Link href="/admin/collections/survey-campaigns/2" className={styles.settingBtn} style={{ background: '#0284c7' }}>
              🏥 Mẫu Nội trú →
            </Link>
            <Link href="/admin/collections/survey-campaigns/3" className={styles.settingBtn} style={{ background: '#0284c7' }}>
              👨‍⚕️ Mẫu Nhân viên →
            </Link>
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '8px' }}>
            <strong>Xem trước trực tuyến giao diện người bệnh:</strong>
          </div>
          <div className={styles.linkButtons}>
            <Link href="/khao-sat/ngoai-tru" target="_blank" className={styles.pillLink}>
              Ngoại trú ↗
            </Link>
            <Link href="/khao-sat/noi-tru" target="_blank" className={styles.pillLink}>
              Nội trú ↗
            </Link>
            <Link href="/khao-sat/nhan-vien" target="_blank" className={styles.pillLink}>
              Nhân viên ↗
            </Link>
            <Link href="/khao-sat" target="_blank" className={styles.pillLinkSecondary}>
              Cổng chung /khao-sat ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
