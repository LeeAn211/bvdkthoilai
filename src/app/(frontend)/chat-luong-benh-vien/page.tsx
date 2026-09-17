import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { getGlobal } from '@/lib/payload'
import './chat-luong.css'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Chất lượng Bệnh viện — Bệnh viện Đa khoa Khu vực Thới Lai',
  description:
    'Quản lý chất lượng khám chữa bệnh, bộ chỉ số 83 tiêu chí của Bộ Y tế, kết quả đánh giá sự hài lòng và các chương trình cải tiến liên tục tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function HospitalQualityPage() {
  let qualitySettings: any = {}

  try {
    const [specQuality, siteSettings] = await Promise.all([
      getGlobal('hospital-quality-settings' as any).catch(() => null),
      getGlobal('site-settings').catch(() => ({})),
    ])
    qualitySettings = (specQuality && Object.keys(specQuality).length > 0) ? specQuality : (siteSettings?.qualityPage || {})
  } catch (err) {
    console.error('[HospitalQualityPage] Lỗi lấy cấu hình site:', err)
  }

  const eyebrow = qualitySettings.eyebrow || 'QUẢN LÝ CHẤT LƯỢNG & AN TOÀN NGƯỜI BỆNH'
  const title = qualitySettings.title || 'Chất lượng Bệnh viện'
  const description =
    qualitySettings.description ||
    'Bộ chỉ số đo lường 83 tiêu chí chất lượng, kết quả khảo sát sự hài lòng và các chương trình cải tiến liên tục tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  const showNoticeBanner = qualitySettings.showNoticeBanner === true
  const noticeTitle = qualitySettings.noticeTitle || 'Cam kết chất lượng phục vụ của Bệnh viện Đa khoa Khu vực Thới Lai'
  const noticeContent =
    qualitySettings.noticeContent ||
    '• Lấy người bệnh làm trung tâm phục vụ, đảm bảo an toàn và quyền lợi người bệnh.\n• Đánh giá chất lượng định kỳ theo Bộ 83 Tiêu chí của Bộ Y tế.\n• Mọi ý kiến đóng góp được Ban Giám đốc tiếp nhận và cải tiến liên tục.'
  const noticeAlign = qualitySettings.noticeAlign || 'left'

  const showQualityCards = qualitySettings.showQualityCards !== false
  const showDimensions = qualitySettings.showDimensions !== false
  const showPrograms = qualitySettings.showPrograms !== false
  const showFeedbackBox = qualitySettings.showFeedbackBox !== false

  // 4 Thẻ chỉ số chất lượng mặc định
  const DEFAULT_STATS = [
    { val: '4.22', unit: '/ 5.0', label: 'Điểm chất lượng bệnh viện' },
    { val: '94.8', unit: '%', label: 'Tỷ lệ hài lòng chung' },
    { val: '83', unit: 'tiêu chí', label: 'Bộ tiêu chí chất lượng Bộ Y tế' },
    { val: '100', unit: '%', label: 'Bảo đảm an toàn người bệnh' },
  ]

  const qualityStats = Array.isArray(qualitySettings.statCards) && qualitySettings.statCards.length > 0
    ? qualitySettings.statCards.filter((s: any) => s?.enabled !== false)
    : DEFAULT_STATS

  // 5 Nhóm tiêu chuẩn cốt lõi theo Bộ tiêu chí đánh giá chất lượng bệnh viện (Bộ Y tế)
  const DEFAULT_DIMENSIONS = [
    {
      code: 'PHẦN A',
      title: 'Hướng đến người bệnh',
      desc: 'Quy trình tiếp đón niềm nở, chỉ dẫn rõ ràng, giảm thiểu tối đa thời gian chờ đợi và bảo đảm quyền riêng tư, an toàn người bệnh.',
      score: '4.25 / 5.00',
      percent: 85,
    },
    {
      code: 'PHẦN B',
      title: 'Phát triển nguồn nhân lực',
      desc: 'Đào tạo liên tục chuyên môn y khoa, bồi dưỡng kỹ năng giao tiếp y đức, cải thiện điều kiện làm việc cho đội ngũ nhân viên y tế.',
      score: '4.18 / 5.00',
      percent: 83.6,
    },
    {
      code: 'PHẦN C',
      title: 'Hoạt động chuyên môn',
      desc: 'Áp dụng phác đồ điều trị chuẩn của Bộ Y tế, kiểm soát nhiễm khuẩn nghiêm ngặt, hội chẩn liên viện và cấp cứu can thiệp kịp thời.',
      score: '4.35 / 5.00',
      percent: 87,
    },
    {
      code: 'PHẦN D',
      title: 'Cải tiến chất lượng',
      desc: 'Thiết lập hệ thống báo cáo sự cố y khoa tự nguyện, phân tích nguyên nhân gốc rễ và triển khai các đề án cải tiến chất lượng định kỳ.',
      score: '4.12 / 5.00',
      percent: 82.4,
    },
    {
      code: 'PHẦN E',
      title: 'Tiêu chí đặc thù chuyên khoa',
      desc: 'Đầu tư trang thiết bị cận lâm sàng hiện đại (CT scanner, Nội soi tiêu hóa, Siêu âm màu), phòng mổ vô khuẩn và cấp cứu lưu động.',
      score: '4.20 / 5.00',
      percent: 84,
    },
  ]

  const qualityDimensions = Array.isArray(qualitySettings.dimensions) && qualitySettings.dimensions.length > 0
    ? qualitySettings.dimensions.filter((d: any) => d?.enabled !== false)
    : DEFAULT_DIMENSIONS

  // Các chương trình hành động cải tiến chất lượng nổi bật
  const DEFAULT_PROGRAMS = [
    {
      iconType: 'blue',
      title: 'Ứng dụng Chuyển đổi số Y tế',
      desc: 'Triển khai bệnh án điện tử (EMR), hệ thống đặt lịch khám trực tuyến Medpro và thanh toán viện phí không dùng tiền mặt (QR Code tĩnh/động).',
      highlights: ['Giảm 40% thời gian chờ đợi tại khoa Khám bệnh', '100% người bệnh tra cứu kết quả xét nghiệm nhanh', 'Liên thông dữ liệu BHYT quốc gia tức thì'],
    },
    {
      iconType: 'green',
      title: 'An toàn người bệnh & Kiểm soát nhiễm khuẩn',
      desc: 'Chuẩn hóa quy trình nhận diện người bệnh bằng vòng đeo tay, kiểm soát kê đơn an toàn và tuân thủ vệ sinh tay ngoại khoa 5 thời điểm.',
      highlights: ['Tỷ lệ tuân thủ vệ sinh tay đạt trên 92%', 'Hệ thống khử khuẩn tập trung theo chuẩn y tế', 'Quy trình đối chiếu thông tin 3 tra 5 đối'],
    },
    {
      iconType: 'amber',
      title: 'Nâng cao Văn hóa giao tiếp & Ứng xử',
      desc: 'Xây dựng môi trường bệnh viện xanh - sạch - đẹp, phong cách phục vụ văn minh, tận tình hướng dẫn với phương châm "Lương y như từ mẫu".',
      highlights: ['Hòm thư góp ý và đường dây nóng 24/7', 'Đánh giá hài lòng người bệnh nội trú & ngoại trú hàng quý', 'Giải quyết thắc mắc phản ánh trong 24h'],
    },
  ]

  const improvementPrograms = Array.isArray(qualitySettings.programs) && qualitySettings.programs.length > 0
    ? qualitySettings.programs.filter((p: any) => p?.enabled !== false).map((p: any) => ({
        ...p,
        highlights: p.highlights
          ? (typeof p.highlights === 'string' ? p.highlights.split('\n').filter(Boolean) : Array.isArray(p.highlights) ? p.highlights : [])
          : [],
      }))
    : DEFAULT_PROGRAMS

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Chất lượng bệnh viện"
      />

      <main className="qualityPageSection">
        <div className="container">
          <PatientCareSubNav activeKey="chat-luong" />

          {/* Notice Banner (nếu được bật trong CMS) */}
          {showNoticeBanner && (noticeTitle || noticeContent) && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #93c5fd',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '28px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
                textAlign: noticeAlign as any,
              }}
            >
              {noticeTitle && (
                <h3
                  style={{
                    margin: '0 0 10px',
                    color: '#1e40af',
                    fontSize: '17px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent:
                      noticeAlign === 'center'
                        ? 'center'
                        : noticeAlign === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                    textWrap: 'balance',
                  }}
                >
                  <span>🎖️</span> {noticeTitle}
                </h3>
              )}
              {noticeContent && (
                <p
                  style={{
                    margin: 0,
                    color: '#1d4ed8',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    textWrap: 'balance',
                  }}
                >
                  {noticeContent}
                </p>
              )}
            </div>
          )}

          {/* 1. Thẻ chỉ số chất lượng chính */}
          {showQualityCards && qualityStats.length > 0 && (
            <div className="qualityStatsGrid">
              {qualityStats.map((stat: any, sIdx: number) => (
                <div className="qualityStatCard" key={sIdx}>
                  <div className="qualityStatIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                  <div className="qualityStatContent">
                    <div className="qualityStatVal">
                      {stat.val}<span className="qualityStatUnit">{stat.unit}</span>
                    </div>
                    <div className="qualityStatLabel">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Khối Đánh giá theo 5 Phần Tiêu chuẩn Bộ Y Tế */}
          {showDimensions && (
            <section className="qualitySectionBlock">
              <div className="qualityBlockHead">
                <div className="qualityBlockTitleWrap">
                  <h2>
                    <span>📋</span> Bộ 83 Tiêu chí Chất lượng Bệnh viện Việt Nam
                  </h2>
                  <p>Kết quả đánh giá và đo lường theo Bộ tiêu chí ban hành kèm theo Quyết định số 6858/QĐ-BYT của Bộ Y tế.</p>
                </div>
                <div className="qualityScoreBadge">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Mức chất lượng: Tốt (Mức 4)</span>
                </div>
              </div>

              <div className="criteriaGrid">
                {qualityDimensions.map((dim: any, idx: number) => (
                  <div className="criteriaCard" key={idx}>
                    <div className="criteriaCardTop">
                      <span className="criteriaCode">{dim.code}</span>
                      <span className="criteriaScorePill">{dim.score}</span>
                    </div>
                    <h3 className="criteriaTitle">{dim.title}</h3>
                    <p className="criteriaDesc">{dim.desc}</p>
                    <div className="criteriaProgressBar" title={`Đạt ${dim.percent}%`}>
                      <div className="criteriaProgressFill" style={{ width: `${dim.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Khối Chương trình cải tiến chất lượng */}
          {showPrograms && (
            <section className="qualitySectionBlock">
              <div className="qualityBlockHead">
                <div className="qualityBlockTitleWrap">
                  <h2>
                    <span>🚀</span> Chương trình Cải tiến Chất lượng Trọng điểm
                  </h2>
                  <p>Các dự án hành động cụ thể nhằm nâng cao trải nghiệm khám chữa bệnh và tối ưu hóa an toàn lâm sàng.</p>
                </div>
              </div>

              <div className="programsGrid">
                {improvementPrograms.map((prog: any, pIdx: number) => (
                  <div className="programCard" key={pIdx}>
                    <div className={`programIconWrap ${prog.iconType}`} aria-hidden="true">
                      {prog.iconType === 'blue' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                      )}
                      {prog.iconType === 'green' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      )}
                      {prog.iconType === 'amber' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      )}
                    </div>
                    <h3 className="programTitle">{prog.title}</h3>
                    <p className="programDesc">{prog.desc}</p>
                    <ul className="programHighlights">
                      {prog.highlights.map((hl: any, hlIdx: number) => (
                        <li key={hlIdx}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Khối Khảo sát sự hài lòng & Góp ý ý kiến */}
          {showFeedbackBox && (
            <div className="qualityFeedbackBanner">
              <div className="qualityFeedbackCopy">
                <h3>Đóng góp ý kiến của Bạn là động lực để Bệnh viện hoàn thiện</h3>
                <p>
                  Bệnh viện Đa khoa Khu vực Thới Lai luôn trân trọng mọi phản hồi, ý kiến đóng góp hoặc phản ánh của người bệnh và thân nhân để không ngừng nâng cao chất lượng dịch vụ y tế.
                </p>
              </div>
              <div className="qualityFeedbackActions">
                <Link href="/gop-y" className="btnFeedbackPrimary">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Gửi ý kiến phản ánh</span>
                </Link>
                <Link href="/lien-he" className="btnFeedbackSecondary">
                  <span>Liên hệ Ban Quản lý Chất lượng</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
