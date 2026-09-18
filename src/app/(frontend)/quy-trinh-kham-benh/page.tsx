import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ExaminationFlowView } from './ExaminationFlowView'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { RichText } from '@/components/RichText'
import { getGlobal } from '@/lib/payload'
import './quy-trinh-kham-benh.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Quy trình Khám bệnh — Bệnh viện Đa khoa Khu vực Thới Lai',
  description:
    'Sơ đồ và hướng dẫn chi tiết quy trình khám bệnh có thẻ BHYT, khám thu phí dịch vụ và quy trình cấp cứu 24/24 tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function ExaminationFlowPage() {
  let medproUrl = process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
  let hotline = '0292 3861 234'
  let emergencyHotline = '0292 3861 115'
  let flowSettings: any = {}

  try {
    const [specFlow, siteSettingsData, contactSettingsData] = await Promise.all([
      getGlobal('examination-flow-settings' as any).catch(() => null),
      getGlobal('site-settings').catch(() => ({})),
      getGlobal('contact-settings').catch(() => ({})),
    ])
    const siteSettings: any = siteSettingsData
    const contactSettings: any = contactSettingsData
    flowSettings = (specFlow && Object.keys(specFlow).length > 0) ? specFlow : (siteSettings?.examinationFlowPage || {})
    medproUrl = siteSettings?.medproUrl || medproUrl
    hotline = contactSettings?.hotline || siteSettings?.hotline || hotline
    emergencyHotline = contactSettings?.emergencyHotline || siteSettings?.emergencyHotline || emergencyHotline
  } catch (err) {
    console.error('[ExaminationFlowPage] Lỗi lấy cấu hình site:', err)
  }

  const eyebrow = flowSettings.eyebrow || 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH'
  const title = flowSettings.title || 'Quy trình Khám chữa bệnh'
  const description =
    flowSettings.description ||
    'Sơ đồ và các bước hướng dẫn người bệnh khi đến thăm khám có thẻ BHYT, khám thu phí dịch vụ hoặc tiếp nhận cấp cứu tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Quy trình khám bệnh"
      />
      <main className="section">
        <div className="container">
          <PatientCareSubNav activeKey="quy-trinh" />

          {flowSettings.showNoticeBanner && (flowSettings.noticeContent || flowSettings.noticeTitle) && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #93c5fd',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '28px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
                textAlign: flowSettings.noticeAlign || 'left',
              }}
            >
              {flowSettings.noticeTitle && (
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
                      flowSettings.noticeAlign === 'center'
                        ? 'center'
                        : flowSettings.noticeAlign === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                    textWrap: 'balance',
                  }}
                >
                  <span>ℹ️</span> {flowSettings.noticeTitle}
                </h3>
              )}
              {flowSettings.noticeContent && (
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
                  {flowSettings.noticeContent}
                </p>
              )}
            </div>
          )}

          <ExaminationFlowView
            medproUrl={medproUrl}
            hotline={hotline}
            emergencyHotline={emergencyHotline}
            settings={flowSettings}
          />

          {/* Bài viết chi tiết & Hướng dẫn khám chữa bệnh (RichText) */}
          {flowSettings.contentBlock?.enabled !== false && (flowSettings.contentBlock?.title || flowSettings.contentBlock?.content) && (
            <article
              className="patientCareArticleCard"
              style={{
                marginTop: '44px',
                textAlign: (flowSettings.contentBlock?.textAlign || 'left') as any,
              }}
            >
              <div className="patientCareArticleHeader">
                {flowSettings.contentBlock?.title && (
                  <h2 className="patientCareArticleTitle">{flowSettings.contentBlock.title}</h2>
                )}
                {flowSettings.contentBlock?.subtitle && (
                  <p className="patientCareArticleSubtitle">{flowSettings.contentBlock.subtitle}</p>
                )}
              </div>
              {flowSettings.contentBlock?.content ? (
                <div className="patientCareArticleBody">
                  <RichText data={flowSettings.contentBlock.content} />
                </div>
              ) : (
                <div className="patientCareArticleBody">
                  <p>
                    <strong>Bệnh viện Đa khoa Khu vực Thới Lai</strong> áp dụng đầy đủ chính sách thông tuyến khám chữa bệnh Bảo hiểm Y tế (BHYT) theo quy định của Luật BHYT và Bộ Y tế. Người bệnh tham gia BHYT đăng ký nơi khám chữa bệnh ban đầu tại bất kỳ cơ sở y tế tuyến huyện/khu vực nào đều được tiếp nhận và hưởng 100% mức quyền lợi khi đến khám điều trị.
                  </p>
                  <p>
                    <strong>Thủ tục tiếp nhận không dùng giấy tờ:</strong>
                  </p>
                  <ul>
                    <li>Người bệnh có thể sử dụng Căn cước công dân gắn chip hoặc hình ảnh thẻ BHYT trên ứng dụng VNeID / VssID để đăng ký khám thay thế cho thẻ BHYT giấy.</li>
                    <li>Thời gian tiếp nhận khám sớm bắt đầu từ 06:30 sáng tại các phòng khám trọng điểm để tạo điều kiện thuận lợi nhất cho bà con nhân dân.</li>
                    <li>Người cao tuổi từ 75 tuổi trở lên, trẻ nhỏ dưới 6 tuổi và phụ nữ mang thai luôn được cấp số ưu tiên tại các quầy tiếp đón.</li>
                  </ul>
                </div>
              )}
            </article>
          )}

          {/* Các khối nội dung tùy biến thêm mới (Custom Blocks) */}
          {Array.isArray(flowSettings.customBlocks) && flowSettings.customBlocks.filter((b: any) => b?.enabled !== false).length > 0 && (
            <section style={{ marginTop: '24px', marginBottom: '40px' }}>
              {flowSettings.customBlocks.filter((b: any) => b?.enabled !== false).map((block: any, bIdx: number) => {
                const bAlign = block.textAlign || 'left'
                return (
                  <div key={block.id || bIdx} className="patientCareCustomBlockCard" style={bAlign !== 'left' ? { textAlign: bAlign } : undefined}>
                    {block.kicker && <span className="patientCareCustomKicker">{block.kicker}</span>}
                    <h3 className="patientCareCustomBlockTitle">{block.title}</h3>
                    {block.subtitle && <p className="patientCareCustomBlockSub">{block.subtitle}</p>}
                    {block.content && (
                      <div className="patientCareArticleBody">
                        <RichText data={block.content} />
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
