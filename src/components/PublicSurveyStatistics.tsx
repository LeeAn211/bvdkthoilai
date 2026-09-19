'use client'

import React, { useEffect, useState, useTransition } from 'react'

interface CampaignItem {
  id: number
  title: string
  slug: string
  active?: boolean
  questionsCount?: number
}

interface CampaignStats {
  ok: boolean
  campaign: {
    id: number
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
  recentResponses?: Array<{
    code: string
    date: string
    score: string | number
    comment: string
  }>
}

const DEFAULT_CAMPAIGNS: CampaignItem[] = [
  { id: 1, title: 'Khảo sát Sự hài lòng Người bệnh Khám Ngoại trú', slug: 'ngoai-tru', active: true },
  { id: 2, title: 'Khảo sát Sự hài lòng Người bệnh Điều trị Nội trú', slug: 'noi-tru', active: true },
  { id: 3, title: 'Khảo sát Sự hài lòng Người bệnh Điều trị Nội trú', slug: 'noi-tru', active: true },
  { id: 4, title: 'Khảo sát Ý kiến & Sự hài lòng Nhân viên Y tế', slug: 'nhan-vien', active: true },
]

export default function PublicSurveyStatistics() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(DEFAULT_CAMPAIGNS)
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(1)
  const [stats, setStats] = useState<CampaignStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [isPending, startTransition] = useTransition()

  // 1. Tải danh sách đợt khảo sát
  useEffect(() => {
    let isMounted = true
    async function loadCampaigns() {
      try {
        const res = await fetch('/api/surveys/templates')
        if (res.ok) {
          const data = await res.json()
          if (isMounted && data.campaigns && data.campaigns.length > 0) {
            setCampaigns(data.campaigns)
            setSelectedCampaignId((prev) => prev || data.campaigns[0].id)
          }
        }
      } catch (e) {
        console.warn('Lỗi tải danh sách đợt khảo sát:', e)
      }
    }
    loadCampaigns()
    return () => {
      isMounted = false
    }
  }, [])

  // 2. Tải thống kê cho đợt được chọn
  useEffect(() => {
    if (!selectedCampaignId) return
    let isMounted = true
    setLoadingStats(true)

    async function loadStats() {
      try {
        const res = await fetch(`/api/surveys/statistics?campaign=${selectedCampaignId}`)
        if (res.ok) {
          const data = await res.json()
          if (isMounted) {
            setStats(data)
          }
        }
      } catch (err) {
        console.warn('Lỗi tải thống kê:', err)
      } finally {
        if (isMounted) setLoadingStats(false)
      }
    }

    loadStats()
    return () => {
      isMounted = false
    }
  }, [selectedCampaignId])

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

  return (
    <div
      id="thong-ke-khao-sat"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        border: '2px solid #38bdf8',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 32,
        boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.1), 0 8px 10px -6px rgba(2, 132, 199, 0.1)',
      }}
    >
      {/* Tiêu đề & Chọn đợt */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          paddingBottom: 20,
          borderBottom: '1.5px dashed #bae6fd',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: 24,
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            }}
          >
            📊
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              CÔNG KHAI & MINH BẠCH KẾT QUẢ PHỤC VỤ
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              Bảng Thống Kê & Kết Quả Đánh Giá Hài Lòng
            </h2>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              Dữ liệu được tổng hợp trực tiếp từ các phiếu khảo sát thực tế của người bệnh và nhân viên y tế.
            </div>
          </div>
        </div>

        {/* Dropdown chọn đợt khảo sát công khai */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Chọn đợt xem:</span>
            <select
              value={selectedCampaignId || ''}
              onChange={(e) => {
                const val = Number(e.target.value)
                startTransition(() => {
                  setSelectedCampaignId(val)
                })
              }}
              style={{
                padding: '9px 16px',
                borderRadius: 9,
                border: '2px solid #0284c7',
                background: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                color: '#0369a1',
                cursor: 'pointer',
                minWidth: 260,
                outline: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  🔹 #{c.id} - {c.title} {c.active ? '(Đang mở)' : '(Đã đóng)'}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Nội dung kết quả */}
      {loadingStats ? (
        <div style={{ padding: '36px 0', textAlign: 'center', color: '#0284c7', fontSize: 14, fontWeight: 700 }}>
          ⏳ Đang tính toán và tải dữ liệu thống kê...
        </div>
      ) : stats ? (
        <div style={{ marginTop: 20 }}>
          {/* 4 Thẻ KPI nổi bật */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: 12,
                border: '1.5px solid #bae6fd',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.06)',
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                Tổng lượt gửi phiếu
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0284c7', marginTop: 4 }}>
                {stats.responses} <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>phiếu</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Ghi nhận trực tuyến từ người bệnh</div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: 12,
                border: '1.5px solid #bbf7d0',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)',
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                Điểm đánh giá trung bình
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a', marginTop: 4 }}>
                {stats.averageScore > 0 ? `${stats.averageScore}` : 'Chưa có'}{' '}
                <span style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>/ 5.0 ★</span>
              </div>
              <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>Mức độ hài lòng chung</div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: 12,
                border: '1.5px solid #f5d0fe',
                boxShadow: '0 2px 8px rgba(192, 38, 211, 0.06)',
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#86198f', textTransform: 'uppercase' }}>
                Tỷ lệ hài lòng chung
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#a21caf', marginTop: 4 }}>
                {stats.satisfactionRate}%
              </div>
              <div style={{ fontSize: 11, color: '#a21caf', marginTop: 2 }}>Đạt chuẩn chất lượng Bộ Y tế</div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Trạng thái tiếp nhận
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: stats.campaign.active ? '#16a34a' : '#64748b',
                  marginTop: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{stats.campaign.active ? '🟢 Đang mở tiếp nhận' : '🔴 Đã kết thúc đợt'}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Cập nhật liên tục theo thời gian thực</div>
            </div>
          </div>

          {/* Biểu đồ phân bổ mức độ hài lòng (Bar chart) */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #bae6fd',
              borderRadius: 12,
              padding: '18px 22px',
              marginBottom: 20,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.05)',
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              📈 Biểu đồ phân bổ mức độ hài lòng của người tham gia đợt này:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Rất hài lòng */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 700, color: '#15803d' }}>
                    😍 Rất hài lòng (4.5 – 5.0 sao / 9 – 10 điểm): <b>{stats.ratingDistribution.verySatisfied} lượt</b>
                  </span>
                  <span style={{ fontWeight: 800, color: '#15803d', fontSize: 13 }}>
                    {getPercent(stats.ratingDistribution.verySatisfied)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 14, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 700, color: '#0284c7' }}>
                    🙂 Hài lòng (3.5 – 4.4 sao / 7 – 8.9 điểm): <b>{stats.ratingDistribution.satisfied} lượt</b>
                  </span>
                  <span style={{ fontWeight: 800, color: '#0284c7', fontSize: 13 }}>
                    {getPercent(stats.ratingDistribution.satisfied)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 14, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 700, color: '#d97706' }}>
                    😐 Bình thường (2.5 – 3.4 sao / 5 – 6.9 điểm): <b>{stats.ratingDistribution.neutral} lượt</b>
                  </span>
                  <span style={{ fontWeight: 800, color: '#d97706', fontSize: 13 }}>
                    {getPercent(stats.ratingDistribution.neutral)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 14, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>
                    🙁 Chưa hài lòng (&lt; 2.5 sao / &lt; 5 điểm): <b>{stats.ratingDistribution.unsatisfied} lượt</b>
                  </span>
                  <span style={{ fontWeight: 800, color: '#dc2626', fontSize: 13 }}>
                    {getPercent(stats.ratingDistribution.unsatisfied)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 14, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
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

          {/* Danh sách các ý kiến phản hồi gần nhất */}
          {stats.recentResponses && stats.recentResponses.length > 0 && (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  padding: '12px 18px',
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                  💬 Các lượt phản hồi gần đây nhất của đợt này
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  (Bấm nút <strong>&quot;Xuất Excel (.xlsx)&quot;</strong> phía trên để tải toàn bộ bảng câu hỏi & câu trả lời)
                </div>
              </div>

              <div style={{ maxHeight: 220, overflowY: 'auto', fontSize: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#0369a1', borderBottom: '1.5px solid #e2e8f0', background: '#fafafa', fontWeight: 700 }}>
                      <th style={{ padding: '9px 14px', width: 140 }}>Mã biên nhận</th>
                      <th style={{ padding: '9px 14px', width: 170 }}>Thời gian gửi</th>
                      <th style={{ padding: '9px 14px', width: 110 }}>Điểm TB</th>
                      <th style={{ padding: '9px 14px' }}>Ý kiến phản hồi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentResponses.map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 14px', fontWeight: 700, color: '#0284c7' }}>{r.code}</td>
                        <td style={{ padding: '8px 14px', color: '#475569' }}>
                          {r.date ? new Date(r.date).toLocaleString('vi-VN') : '—'}
                        </td>
                        <td style={{ padding: '8px 14px', fontWeight: 800, color: '#16a34a' }}>
                          {r.score ? `${r.score}★` : '—'}
                        </td>
                        <td style={{ padding: '8px 14px', color: '#334155' }}>
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
        <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
          Chưa có dữ liệu thống kê cho đợt này.
        </div>
      )}
    </div>
  )
}
