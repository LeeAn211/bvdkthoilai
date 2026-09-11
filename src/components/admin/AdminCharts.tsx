'use client'

import React, { useState } from 'react'
import styles from './AdminCharts.module.css'

export interface MonthData {
  month: string
  news: number
  notices: number
  procurement: number
  total: number
}

export interface DepartmentStat {
  name: string
  doctors: number
  percent: number
  color: string
}

export interface AdminChartsProps {
  timeline: MonthData[]
  departmentStats: DepartmentStat[]
  satisfactionScore?: number
  totalSurveys?: number
  slaRate?: number
  feedbackAvgHours?: number
  showAreaChart?: boolean
  showDepartmentBar?: boolean
  showSatisfactionGauge?: boolean
  showSlaStats?: boolean
}

export default function AdminCharts({
  timeline,
  departmentStats,
  satisfactionScore = 96.8,
  totalSurveys = 120,
  slaRate = 98.2,
  feedbackAvgHours = 4.5,
  showAreaChart = true,
  showDepartmentBar = true,
  showSatisfactionGauge = true,
  showSlaStats = true,
}: AdminChartsProps) {
  const [activePoint, setActivePoint] = useState<MonthData | null>(null)

  // Calculate SVG Coordinates for Area Chart
  const svgWidth = 600
  const svgHeight = 180
  const paddingX = 40
  const paddingY = 25
  const chartWidth = svgWidth - paddingX * 2
  const chartHeight = svgHeight - paddingY * 2

  const maxVal = Math.max(...timeline.map((d) => d.total), 10)
  const points = timeline.map((d, index) => {
    const x = paddingX + (index / Math.max(1, timeline.length - 1)) * chartWidth
    const y = svgHeight - paddingY - (d.total / maxVal) * chartHeight
    return { x, y, data: d }
  })

  // Generate smooth SVG curve path
  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`
    const prev = arr[idx - 1]
    const cpX1 = prev.x + (curr.x - prev.x) / 2
    const cpY1 = prev.y
    const cpX2 = prev.x + (curr.x - prev.x) / 2
    const cpY2 = curr.y
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`
  }, '')

  const lastPoint = points[points.length - 1] || { x: svgWidth - paddingX, y: svgHeight - paddingY }
  const firstPoint = points[0] || { x: paddingX, y: svgHeight - paddingY }
  const areaD = points.length > 0
    ? `${pathD} L ${lastPoint.x} ${svgHeight - paddingY} L ${firstPoint.x} ${svgHeight - paddingY} Z`
    : ''

  // Radial Gauge Calculations
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (satisfactionScore / 100) * circumference

  const criteria = [
    { name: 'Thái độ nhân viên y tế', score: '98.5%', percent: 98.5 },
    { name: 'Cơ sở vật chất & Tiện nghi', score: '95.2%', percent: 95.2 },
    { name: 'Minh bạch viện phí, bảng giá', score: '99.0%', percent: 99.0 },
    { name: 'Thời gian chờ khám & cấp thuốc', score: '94.6%', percent: 94.6 },
  ]

  const hasRow1 = showAreaChart || showDepartmentBar
  const hasRow2 = showSatisfactionGauge || showSlaStats

  if (!hasRow1 && !hasRow2) {
    return null
  }

  return (
    <div className={styles.chartsHub}>
      {/* Hàng 1: Xu hướng xuất bản (Area Chart) + Phân bổ nhân sự khoa phòng (Bar Chart) */}
      {hasRow1 && (
        <div className={showAreaChart && showDepartmentBar ? styles.chartsRow : styles.chartsRowSingle}>
          {/* Biểu đồ 1: Tốc độ Xuất bản & Tin bài */}
          {showAreaChart && (
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerInfo}>
                  <span className={styles.categoryTag}>XU HƯỚNG HOẠT ĐỘNG</span>
                  <h2 className={styles.cardTitle}>Tốc độ xuất bản thông tin số</h2>
                  <p className={styles.cardSubtitle}>Khối lượng tin tức, thông báo và gói thầu theo các tháng gần nhất</p>
                </div>
                <div className={styles.headerPill}>
                  <span>Đỉnh điểm:</span>
                  <b>{maxVal} bài/tháng</b>
                </div>
              </div>

              <div className={styles.areaChartWrapper}>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.svgAreaChart}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gridlines ngang */}
                  <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} className={styles.chartGridline} />
                  <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={svgWidth - paddingX} y2={paddingY + chartHeight / 2} className={styles.chartGridline} />
                  <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} className={styles.chartGridline} />

                  {/* Area & Stroke */}
                  {areaD && <path d={areaD} fill="url(#areaGradient)" />}
                  {pathD && <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />}

                  {/* Data points & Labels */}
                  {points.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={activePoint?.month === pt.data.month ? 6 : 4}
                        fill="#ffffff"
                        stroke="#0d9488"
                        strokeWidth="2.5"
                        className={styles.chartPoint}
                        onMouseEnter={() => setActivePoint(pt.data)}
                        onMouseLeave={() => setActivePoint(null)}
                      />
                      <text
                        x={pt.x}
                        y={svgHeight - 6}
                        textAnchor="middle"
                        className={styles.chartAxisText}
                      >
                        {pt.data.month}
                      </text>
                      {/* Tooltip value */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="750"
                      >
                        {pt.data.total}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className={styles.chartFooter}>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendColor} style={{ background: '#0d9488' }} />
                    <span className={styles.legendText}>Tổng nội dung xuất bản</span>
                  </div>
                </div>
                <span>
                  {activePoint
                    ? `${activePoint.month}: ${activePoint.news} tin · ${activePoint.notices} thông báo · ${activePoint.procurement} thầu`
                    : 'Di chuột vào các điểm để xem chi tiết từng tháng'}
                </span>
              </div>
            </div>
          )}

          {/* Biểu đồ 2: Cơ cấu nhân sự bác sĩ theo Khoa phòng */}
          {showDepartmentBar && (
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerInfo}>
                  <span className={styles.categoryTag}>NĂNG LỰC CHUYÊN MÔN</span>
                  <h2 className={styles.cardTitle}>Phân bổ nhân lực y tế</h2>
                  <p className={styles.cardSubtitle}>Số lượng bác sĩ công tác tại các khoa lâm sàng</p>
                </div>
              </div>

              <div className={styles.barChartContainer}>
                {departmentStats.slice(0, 5).map((dept, i) => (
                  <div key={i} className={styles.barRow}>
                    <div className={styles.barRowHeader}>
                      <span className={styles.barLabel}>{dept.name}</span>
                      <span className={styles.barValue}>{dept.doctors} Bác sĩ ({dept.percent}%)</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${Math.max(8, dept.percent)}%`, background: dept.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.chartFooter}>
                <span>Đảm bảo phân bổ đều các ca trực 24/7</span>
                <span className={styles.statHighlight}>100% Đạt chỉ tiêu</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hàng 2: Chỉ số Hài lòng Người bệnh (Gauge) + Hiệu suất CSKH & SLA */}
      {hasRow2 && (
        <div className={showSatisfactionGauge && showSlaStats ? styles.chartsRowEqual : styles.chartsRowSingle}>
          {/* Biểu đồ 3: Chỉ số Hài lòng Người bệnh theo tiêu chuẩn Bộ Y tế */}
          {showSatisfactionGauge && (
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerInfo}>
                  <span className={styles.categoryTag}>CHẤT LƯỢNG BỆNH VIỆN</span>
                  <h2 className={styles.cardTitle}>Chỉ số hài lòng người bệnh</h2>
                  <p className={styles.cardSubtitle}>Kết quả khảo sát nội trú & ngoại trú ({totalSurveys} phiếu)</p>
                </div>
                <div className={styles.headerPill}>
                  <span>Chuẩn:</span>
                  <b>Bộ Y tế</b>
                </div>
              </div>

              <div className={styles.satisfactionGrid}>
                <div className={styles.radialGaugeWrapper}>
                  <svg className={styles.radialGaugeSvg} viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} className={styles.gaugeBg} />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className={styles.gaugeFill}
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                      }}
                    />
                  </svg>
                  <div className={styles.gaugeCenter}>
                    <span className={styles.gaugeScore}>{satisfactionScore}%</span>
                    <span className={styles.gaugeLabel}>Rất hài lòng</span>
                  </div>
                </div>

                <div className={styles.criteriaList}>
                  {criteria.map((c, i) => (
                    <div key={i} className={styles.criteriaItem}>
                      <div className={styles.criteriaTop}>
                        <span className={styles.criteriaName}>{c.name}</span>
                        <span className={styles.criteriaScore}>{c.score}</span>
                      </div>
                      <div className={styles.criteriaBar}>
                        <div className={styles.criteriaBarFill} style={{ width: `${c.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chartFooter}>
                <span>Đạt mức 5/5 theo thang đo chuẩn quốc gia</span>
                <span className={styles.statHighlight}>Xuất sắc</span>
              </div>
            </div>
          )}

          {/* Biểu đồ 4: Hiệu suất Xử lý Hộp thư & SLA CSKH */}
          {showSlaStats && (
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerInfo}>
                  <span className={styles.categoryTag}>HIỆU SUẤT CSKH</span>
                  <h2 className={styles.cardTitle}>Cam kết xử lý phản ánh (SLA)</h2>
                  <p className={styles.cardSubtitle}>Thời gian trung bình và tỷ lệ giải quyết ý kiến bệnh nhân</p>
                </div>
                <div className={styles.headerPill}>
                  <span>SLA:</span>
                  <b>{slaRate}% đúng hạn</b>
                </div>
              </div>

              <div className={styles.slaStats}>
                <div className={styles.slaBox}>
                  <strong className={styles.slaBoxNum}>{feedbackAvgHours}h</strong>
                  <span className={styles.slaBoxLabel}>Thời gian phản hồi TB</span>
                  <span className={styles.slaBoxSub}>↓ Nhanh hơn 1.2h</span>
                </div>
                <div className={styles.slaBox}>
                  <strong className={styles.slaBoxNum}>{slaRate}%</strong>
                  <span className={styles.slaBoxLabel}>Tỷ lệ hoàn tất trong 24h</span>
                  <span className={styles.slaBoxSub}>↑ Đạt chỉ tiêu</span>
                </div>
                <div className={styles.slaBox}>
                  <strong className={styles.slaBoxNum}>100%</strong>
                  <span className={styles.slaBoxLabel}>Bảo mật thông tin</span>
                  <span className={styles.slaBoxSub}>Tuyệt đối an toàn</span>
                </div>
              </div>

              <div className={styles.barRow}>
                <div className={styles.barRowHeader}>
                  <span className={styles.barLabel}>Tiến độ xử lý tháng này</span>
                  <span className={styles.barValue}>{slaRate}% / 100%</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${slaRate}%`, background: '#16a34a' }}
                  />
                </div>
              </div>

              <div className={styles.chartFooter}>
                <span>Mọi phản ánh đều được Ban Giám đốc kiểm tra định kỳ</span>
                <span className={styles.statHighlight}>Minh bạch 100%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
