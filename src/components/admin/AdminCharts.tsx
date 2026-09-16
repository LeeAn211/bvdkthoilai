'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { DashboardGlyph } from './AdminDashboardClient'
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

export interface ContentBreakdownItem {
  id: string
  label: string
  count: number
  totalPercent: number
  color: string
  href: string
}

export interface AdminChartsProps {
  timeline: MonthData[]
  departmentStats: DepartmentStat[]
  satisfactionScore?: number
  totalSurveys?: number
  slaRate?: number
  feedbackAvgHours?: number
  totalAppointments?: number
  clinicalProtocols?: number
  contentBreakdown?: ContentBreakdownItem[]
  totalContent?: number
  totalFeedback?: number
  feedbackNew?: number
  feedbackProcessing?: number
  feedbackDone?: number
  feedbackDonePercent?: string
  feedbackProcessingPercent?: string
  showAreaChart?: boolean
  showDepartmentBar?: boolean
  showSatisfactionGauge?: boolean
  showSlaStats?: boolean
  showWeeklyWorkload?: boolean
  showProtocolDistribution?: boolean
  showResourceStructure?: boolean
  showFeedbackDonut?: boolean
  chartOrder?: string[]
}

export default function AdminCharts({
  timeline,
  departmentStats,
  satisfactionScore = 96.8,
  totalSurveys = 120,
  slaRate = 98.2,
  feedbackAvgHours = 4.5,
  totalAppointments = 85,
  clinicalProtocols = 24,
  contentBreakdown = [],
  totalContent = 0,
  totalFeedback = 0,
  feedbackNew = 0,
  feedbackProcessing = 0,
  feedbackDone = 0,
  feedbackDonePercent = '0%',
  feedbackProcessingPercent = '0%',
  showAreaChart = true,
  showDepartmentBar = true,
  showSatisfactionGauge = true,
  showSlaStats = true,
  showWeeklyWorkload = true,
  showProtocolDistribution = true,
  showResourceStructure = true,
  showFeedbackDonut = true,
  chartOrder = ['rowResourcesFeedback', 'rowTrendsStaff', 'rowSatisfactionSla', 'rowWorkloadProtocols'],
}: AdminChartsProps) {
  const [activePoint, setActivePoint] = useState<MonthData | null>(null)
  const [activeDay, setActiveDay] = useState<{ day: string; fullDay: string; appointments: number; emergency: number; total: number } | null>(null)

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

  // Weekly Workload Data (Thứ 2 -> Chủ Nhật)
  const workloadData = [
    { day: 'T2', fullDay: 'Thứ Hai', appointments: 195, emergency: 38, total: 233 },
    { day: 'T3', fullDay: 'Thứ Ba', appointments: 180, emergency: 34, total: 214 },
    { day: 'T4', fullDay: 'Thứ Tư', appointments: 185, emergency: 36, total: 221 },
    { day: 'T5', fullDay: 'Thứ Năm', appointments: 170, emergency: 32, total: 202 },
    { day: 'T6', fullDay: 'Thứ Sáu', appointments: 175, emergency: 35, total: 210 },
    { day: 'T7', fullDay: 'Thứ Bảy', appointments: 125, emergency: 46, total: 171 },
    { day: 'CN', fullDay: 'Chủ Nhật', appointments: 60, emergency: 52, total: 112 },
  ]

  const totalWeeklyIntake = workloadData.reduce((acc, d) => acc + d.total, 0)
  const totalWeeklyEmergency = workloadData.reduce((acc, d) => acc + d.emergency, 0)

  // Coordinates for Weekly Workload SVG Bar Chart
  const wlSvgWidth = 600
  const wlSvgHeight = 180
  const wlPadX = 35
  const wlPadY = 25
  const wlWidth = wlSvgWidth - wlPadX * 2
  const wlHeight = wlSvgHeight - wlPadY * 2
  const maxWlVal = Math.max(...workloadData.map((d) => d.total), 220)
  const slotW = wlWidth / workloadData.length
  const barW = 14

  // Clinical Protocols & Medical Guidelines Breakdown
  const protoCount = clinicalProtocols || 24
  const protocolGroups = [
    { name: 'Khối Hồi sức Cấp cứu & Chống độc', count: Math.max(1, Math.round(protoCount * 0.28)), percent: 28, color: '#0f766e', tag: 'Cấp cứu 24/7' },
    { name: 'Khối Nội khoa - Nhi khoa', count: Math.max(1, Math.round(protoCount * 0.26)), percent: 26, color: '#0284c7', tag: 'Nội - Nhi' },
    { name: 'Khối Ngoại khoa & Gây mê HSTC', count: Math.max(1, Math.round(protoCount * 0.20)), percent: 20, color: '#d97706', tag: 'Phẫu thuật' },
    { name: 'Khối Sản phụ khoa', count: Math.max(1, Math.round(protoCount * 0.14)), percent: 14, color: '#8b5cf6', tag: 'Sản khoa' },
    { name: 'Khối Y học cổ truyền & PHCN', count: Math.max(1, Math.round(protoCount * 0.08)), percent: 8, color: '#14b8a6', tag: 'Đông y' },
    { name: 'Khối Cận lâm sàng & Chẩn đoán HA', count: Math.max(1, protoCount - Math.round(protoCount * 0.96)), percent: 4, color: '#e11d48', tag: 'Xét nghiệm' },
  ]

  const hasRow1 = showAreaChart || showDepartmentBar
  const hasRow2 = showSatisfactionGauge || showSlaStats
  const hasRow3 = showWeeklyWorkload || showProtocolDistribution
  const hasRow4 = showResourceStructure || showFeedbackDonut

  if (!hasRow1 && !hasRow2 && !hasRow3 && !hasRow4) {
    return null
  }

  // Khối Hàng 1: Xu hướng xuất bản (Area Chart) + Phân bổ nhân sự khoa phòng (Bar Chart)
  const nodeRowTrendsStaff = hasRow1 ? (
    <div key="rowTrendsStaff" className={showAreaChart && showDepartmentBar ? styles.chartsRow : styles.chartsRowSingle}>
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
  ) : null

  // Khối Hàng 2: Chỉ số Hài lòng Người bệnh (Gauge) + Hiệu suất CSKH & SLA
  const nodeRowSatisfactionSla = hasRow2 ? (
    <div key="rowSatisfactionSla" className={showSatisfactionGauge && showSlaStats ? styles.chartsRowEqual : styles.chartsRowSingle}>
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
  ) : null

  // Khối Hàng 3: Tải lượng Khám & Cấp cứu tuần + Cơ cấu Phác đồ điều trị chuẩn
  const nodeRowWorkloadProtocols = hasRow3 ? (
    <div key="rowWorkloadProtocols" className={showWeeklyWorkload && showProtocolDistribution ? styles.chartsRow : styles.chartsRowSingle}>
      {/* Biểu đồ 5: Tải lượng Khám & Trực Cấp cứu 24/7 trong tuần */}
      {showWeeklyWorkload && (
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.categoryTag}>LƯỢNG BỆNH & CẤP CỨU 24/7</span>
              <h2 className={styles.cardTitle}>Tải lượng Khám bệnh & Cấp cứu trong tuần</h2>
              <p className={styles.cardSubtitle}>Theo dõi lượt khám ngoại trú & ca tiếp nhận cấp cứu từ Thứ 2 đến Chủ Nhật</p>
            </div>
            <div className={styles.headerPill}>
              <span>Trực 24/7:</span>
              <b>100% Thông suốt</b>
            </div>
          </div>

          <div className={styles.workloadStatsHeader}>
            <div className={styles.workloadKpi}>
              <strong className={styles.workloadKpiNum}>{totalWeeklyIntake.toLocaleString('vi-VN')} lượt</strong>
              <span className={styles.workloadKpiLabel}>Tổng lượt tiếp nhận tuần</span>
            </div>
            <div className={styles.workloadKpi}>
              <strong className={styles.workloadKpiNum} style={{ color: '#e11d48' }}>{totalWeeklyEmergency} ca</strong>
              <span className={styles.workloadKpiLabel}>Tiếp nhận Cấp cứu 24/7</span>
            </div>
            <div className={styles.workloadKpi}>
              <strong className={styles.workloadKpiNum} style={{ color: '#0f766e' }}>07:30 - 10:30</strong>
              <span className={styles.workloadKpiLabel}>Khung giờ cao điểm nhất</span>
            </div>
          </div>

          <div className={styles.workloadSvgWrapper}>
            <svg viewBox={`0 0 ${wlSvgWidth} ${wlSvgHeight}`} className={styles.workloadSvg}>
              <defs>
                <linearGradient id="aptBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="emgBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1={wlPadX} y1={wlPadY} x2={wlSvgWidth - wlPadX} y2={wlPadY} className={styles.chartGridline} />
              <line x1={wlPadX} y1={wlPadY + wlHeight / 2} x2={wlSvgWidth - wlPadX} y2={wlPadY + wlHeight / 2} className={styles.chartGridline} />
              <line x1={wlPadX} y1={wlSvgHeight - wlPadY} x2={wlSvgWidth - wlPadX} y2={wlSvgHeight - wlPadY} className={styles.chartGridline} />

              {workloadData.map((d, idx) => {
                const slotCenterX = wlPadX + idx * slotW + slotW / 2
                const aptH = (d.appointments / maxWlVal) * wlHeight
                const emgH = (d.emergency / maxWlVal) * wlHeight
                const aptX = slotCenterX - barW - 2
                const emgX = slotCenterX + 2
                const aptY = wlSvgHeight - wlPadY - aptH
                const emgY = wlSvgHeight - wlPadY - emgH
                const isHovered = activeDay?.day === d.day

                return (
                  <g
                    key={idx}
                    className={styles.workloadBarGroup}
                    onMouseEnter={() => setActiveDay(d)}
                    onMouseLeave={() => setActiveDay(null)}
                  >
                    {/* Outpatient / Appointments Bar */}
                    <rect
                      x={aptX}
                      y={aptY}
                      width={barW}
                      height={aptH}
                      rx="3"
                      fill="url(#aptBarGradient)"
                      className={styles.workloadBarAppointments}
                      opacity={isHovered ? 1 : 0.88}
                    />

                    {/* Emergency 24/7 Bar */}
                    <rect
                      x={emgX}
                      y={emgY}
                      width={barW}
                      height={emgH}
                      rx="3"
                      fill="url(#emgBarGradient)"
                      className={styles.workloadBarEmergency}
                      opacity={isHovered ? 1 : 0.88}
                    />

                    {/* Day Label */}
                    <text
                      x={slotCenterX}
                      y={wlSvgHeight - 7}
                      textAnchor="middle"
                      className={styles.chartAxisText}
                      fontWeight={isHovered ? '800' : '600'}
                      fill={isHovered ? '#0f766e' : '#64748b'}
                    >
                      {d.day}
                    </text>

                    {/* Value Tooltip above highest bar */}
                    {isHovered && (
                      <text
                        x={slotCenterX}
                        y={Math.min(aptY, emgY) - 6}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="800"
                      >
                        {d.total} lượt
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          <div className={styles.chartFooter}>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#0d9488' }} />
                <span className={styles.legendText}>Khám ngoại trú & Đặt lịch</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#e11d48' }} />
                <span className={styles.legendText}>Trực Cấp cứu 24/7</span>
              </div>
            </div>
            <span>
              {activeDay
                ? `${activeDay.fullDay}: ${activeDay.appointments} khám ngoại trú · ${activeDay.emergency} ca cấp cứu`
                : 'Rà chuột vào từng cột để xem chi tiết ca tiếp nhận'}
            </span>
          </div>
        </div>
      )}

      {/* Biểu đồ 6: Cơ cấu Phác đồ Điều trị & Chuyên môn Kỹ thuật */}
      {showProtocolDistribution && (
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.categoryTag}>CHUẨN HÓA CHUYÊN MÔN</span>
              <h2 className={styles.cardTitle}>Phân bổ Phác đồ điều trị chuẩn</h2>
              <p className={styles.cardSubtitle}>Cơ cấu hướng dẫn chẩn đoán & phác đồ theo các khối chuyên môn y tế</p>
            </div>
            <div className={styles.headerPill}>
              <span>Quy chuẩn:</span>
              <b>Bộ Y tế</b>
            </div>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className={styles.protocolMultiBar}>
            {protocolGroups.map((g, i) => (
              <div
                key={i}
                className={styles.protocolBarSegment}
                style={{ width: `${g.percent}%`, background: g.color }}
                title={`${g.name}: ${g.percent}% (${g.count} phác đồ)`}
              />
            ))}
          </div>

          {/* Protocol Discipline Cards Grid - Thiết kế mới chuyên nghiệp */}
          <div className={styles.protocolGrid}>
            {protocolGroups.map((g, i) => (
              <div key={i} className={styles.protocolCardNew}>
                <div className={styles.protocolCardTop}>
                  <div className={styles.protocolCardLeft}>
                    <span className={styles.protocolDot} style={{ background: g.color }} />
                    <span className={styles.protocolName} title={g.name}>{g.name}</span>
                  </div>
                  <span className={styles.protocolBadge}>{g.tag}</span>
                </div>

                <div className={styles.protocolTrackWrapper}>
                  <div className={styles.protocolTrack}>
                    <div
                      className={styles.protocolTrackFill}
                      style={{ width: `${g.percent}%`, background: g.color }}
                    />
                  </div>
                </div>

                <div className={styles.protocolMetaRow}>
                  <span className={styles.protocolCount}>{g.count} phác đồ ban hành</span>
                  <strong className={styles.protocolPercentPill}>{g.percent}%</strong>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chartFooter}>
            <span>100% Phác đồ ban hành đúng quy chuẩn Hội đồng KHTK</span>
            <span className={styles.statHighlight}>Đang hiệu lực 100%</span>
          </div>
        </div>
      )}
    </div>
  ) : null

  // Khối Hàng 4: Cơ cấu tài nguyên bệnh viện + Quy trình xử lý phản ánh (Đưa lên cụm biểu đồ trên)
  const nodeRowResourcesFeedback = hasRow4 ? (
    <div key="rowResourcesFeedback" className={showResourceStructure && showFeedbackDonut ? styles.chartsRowEqual : styles.chartsRowSingle}>
      {/* Card 1: Phân bổ dữ liệu & Tình trạng kho nội dung */}
      {showResourceStructure && (
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.categoryTag}>KHO NỘI DUNG SỐ & PHÁC ĐỒ</span>
              <h2 className={styles.cardTitle}>Cơ cấu tài nguyên bệnh viện</h2>
              <p className={styles.cardSubtitle}>Tổng quan các loại tài nguyên truyền thông & chuyên môn số</p>
            </div>
            <span className={styles.countPill}>{totalContent} tài nguyên</span>
          </div>

          <div className={styles.breakdownList}>
            {contentBreakdown.map((row, idx) => (
              <Link href={row.href} key={row.id || idx} className={styles.breakdownRow}>
                <div className={styles.rowInfo}>
                  <span className={styles.rowDot} style={{ background: row.color }} />
                  <span className={styles.rowName}>{row.label}</span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.max(5, row.totalPercent)}%`, background: row.color }}
                  />
                </div>
                <span className={styles.rowNum}>{row.count}</span>
              </Link>
            ))}
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.footerNote}>
              Đồng bộ dữ liệu thời gian thực từ PostgreSQL
            </span>
            <Link href="/admin/globals/homepage" className={styles.cardLink}>
              Tùy biến Trang chủ →
            </Link>
          </div>
        </div>
      )}

      {/* Card 2: Tiến độ Chăm sóc & Tiếp nhận Phản hồi */}
      {showFeedbackDonut && (
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.categoryTag}>CHĂM SÓC KHÁCH HÀNG</span>
              <h2 className={styles.cardTitle}>Quy trình xử lý phản ánh</h2>
              <p className={styles.cardSubtitle}>Theo dõi luồng giải quyết thắc mắc & phản hồi bệnh nhân</p>
            </div>
            <Link href="/admin/collections/feedback" className={styles.cardLink}>
              Hộp thư ({totalFeedback}) →
            </Link>
          </div>

          <div className={styles.csOverview}>
            <div
              className={styles.donutRing}
              style={{ '--done': feedbackDonePercent, '--processing': feedbackProcessingPercent } as React.CSSProperties}
            >
              <div className={styles.donutCenter}>
                <span className={styles.donutTotal}>{totalFeedback}</span>
                <span className={styles.donutSub}>Tổng ý kiến</span>
              </div>
            </div>

            <div className={styles.csLegend}>
              <div className={styles.legendRow}>
                <span className={`${styles.legendBullet} ${styles.bgDanger}`} />
                <span className={styles.legendLabel}>Mới tiếp nhận</span>
                <strong className={styles.legendVal}>{feedbackNew}</strong>
              </div>
              <div className={styles.legendRow}>
                <span className={`${styles.legendBullet} ${styles.bgWarning}`} />
                <span className={styles.legendLabel}>Đang xử lý</span>
                <strong className={styles.legendVal}>{feedbackProcessing}</strong>
              </div>
              <div className={styles.legendRow}>
                <span className={`${styles.legendBullet} ${styles.bgSuccess}`} />
                <span className={styles.legendLabel}>Đã giải quyết</span>
                <strong className={styles.legendVal}>{feedbackDone}</strong>
              </div>
            </div>
          </div>

          <div className={`${styles.feedbackBanner} ${feedbackNew > 0 ? styles.bannerWarning : styles.bannerSuccess}`}>
            <span className={styles.bannerIcon}>
              <DashboardGlyph name={feedbackNew > 0 ? 'notice' : 'check'} />
            </span>
            <div className={styles.bannerContent}>
              <strong>{feedbackNew > 0 ? `Có ${feedbackNew} phản hồi mới cần xử lý kịp thời` : 'Đã giải quyết toàn bộ góp ý của bệnh nhân'}</strong>
              <p>Phản hồi nhanh chóng giúp nâng cao chỉ số hài lòng của bệnh nhân và người nhà.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null

  // Map các khối theo id để render theo thứ tự tùy chọn
  const rowNodesMap: Record<string, React.ReactNode> = {
    rowResourcesFeedback: nodeRowResourcesFeedback,
    rowTrendsStaff: nodeRowTrendsStaff,
    rowSatisfactionSla: nodeRowSatisfactionSla,
    rowWorkloadProtocols: nodeRowWorkloadProtocols,
  }

  // Đảm bảo đủ các khóa nếu thiếu
  const allRowKeys = ['rowResourcesFeedback', 'rowTrendsStaff', 'rowSatisfactionSla', 'rowWorkloadProtocols']
  const orderedKeys = Array.from(new Set([...chartOrder, ...allRowKeys]))

  return (
    <div className={styles.chartsHub}>
      {orderedKeys.map((key) => rowNodesMap[key] || null)}
    </div>
  )
}
