import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { FeedbackForm } from '@/components/FeedbackForm'
import { getGlobal } from '@/lib/payload'

export const metadata = {
  title: 'Góp ý – Phản ánh chất lượng khám chữa bệnh — Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Cổng tiếp nhận ý kiến đóng góp, khen ngợi và phản ánh chất lượng phục vụ của Bệnh viện Đa khoa Khu vực Thới Lai. Có mã tra cứu tiến độ xử lý.',
}

export default async function FeedbackPage() {
  let siteSettings: any = {}
  let fbPage: any = {}
  try {
    const [specFb, settings] = await Promise.all([
      getGlobal('feedback-page-settings' as any).catch(() => null),
      getGlobal('site-settings' as any).catch(() => ({})),
    ])
    siteSettings = settings || {}
    fbPage = (specFb && Object.keys(specFb).length > 0) ? specFb : (siteSettings?.feedbackPage || {})
  } catch {}

  const hotline = siteSettings?.hotline || '02923686115'
  const emergencyHotline = siteSettings?.emergencyHotline || '02923686115'
  const eyebrow = fbPage.eyebrow || 'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN'
  const title = fbPage.title || 'Góp ý – Phản ánh Chất lượng'
  const description =
    fbPage.description ||
    'Mọi ý kiến đóng góp, phản ánh hoặc khen ngợi của quý vị đều được Ban Giám đốc tiếp nhận trực tiếp và giải quyết minh bạch, có mã theo dõi tiến độ.'

  const showNotice = fbPage.showNoticeBanner === true
  const noticeTitle = fbPage.noticeTitle || 'Quy trình tiếp nhận phản ánh'
  const noticeContent = fbPage.noticeContent || ''
  const noticeAlign = fbPage.noticeAlign || 'left'

  const DEFAULT_INFO_BOXES = [
    {
      icon: '📞',
      title: 'Đường dây nóng 24/7',
      desc: 'Trường hợp khẩn cấp, vui lòng gọi trực tiếp hotline: {{HOTLINE}} hoặc Cấp cứu: {{EMERGENCY_HOTLINE}}.',
    },
    {
      icon: '🔍',
      title: 'Cấp mã tra cứu minh bạch',
      desc: 'Sau khi gửi ý kiến, bạn sẽ nhận được mã tiếp nhận để tra cứu tiến độ xử lý và phản hồi công khai từ bệnh viện.',
    },
    {
      icon: '⚖️',
      title: 'Bảo mật & Tôn trọng',
      desc: 'Bệnh viện cam kết bảo mật danh tính người phản ánh theo đúng quy định của Luật Khám bệnh, chữa bệnh.',
    },
  ]

  const rawBoxes = Array.isArray(fbPage.infoBoxes) && fbPage.infoBoxes.length > 0
    ? fbPage.infoBoxes.filter((b: any) => b?.enabled !== false)
    : DEFAULT_INFO_BOXES

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Góp ý – Phản ánh"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="gop-y" />

          {/* Banner thông báo nếu được bật */}
          {showNotice && (noticeTitle || noticeContent) && (
            <div className="patientCareNoticeBanner" style={{ textAlign: noticeAlign as any }}>
              <div className="patientCareNoticeHeader" style={{ justifyContent: noticeAlign === 'center' ? 'center' : 'flex-start' }}>
                <div className="patientCareNoticeIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="patientCareNoticeTitle">{noticeTitle}</h3>
              </div>
              {noticeContent && (
                <p className="patientCareNoticeContent" style={{ whiteSpace: 'pre-line' }}>
                  {noticeContent}
                </p>
              )}
            </div>
          )}

          {rawBoxes.length > 0 && (
            <div className="patientCareInfoGrid" style={{ marginBottom: '28px' }}>
              {rawBoxes.map((box: any, bIdx: number) => {
                const formattedDesc = (box.desc || '')
                  .replace(/\{\{HOTLINE\}\}/g, hotline)
                  .replace(/\{\{EMERGENCY_HOTLINE\}\}/g, emergencyHotline)
                return (
                  <div className="patientCareInfoBox" key={bIdx}>
                    <div className="patientCareInfoIcon">{box.icon || '📞'}</div>
                    <div>
                      <h3 className="patientCareInfoTitle">{box.title}</h3>
                      <p className="patientCareInfoText" style={{ whiteSpace: 'pre-line' }}>{formattedDesc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)' }}>
              <FeedbackForm />
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', padding: '18px 24px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                Đã gửi phản ánh trước đó?{' '}
                <a href="/gop-y/tra-cuu" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
                  Tra cứu tiến độ giải quyết bằng Mã phản hồi →
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
