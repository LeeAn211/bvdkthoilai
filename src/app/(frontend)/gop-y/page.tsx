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
  try {
    siteSettings = await getGlobal('site-settings' as any).catch(() => ({}))
  } catch {}

  const hotline = siteSettings?.hotline || '02923686115'
  const emergencyHotline = siteSettings?.emergencyHotline || '02923686115'

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN"
        title="Góp ý – Phản ánh Chất lượng"
        description="Mọi ý kiến đóng góp, phản ánh hoặc khen ngợi của quý vị đều được Ban Giám đốc tiếp nhận trực tiếp và giải quyết minh bạch, có mã theo dõi tiến độ."
        breadcrumb="Góp ý – Phản ánh"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="gop-y" />

          <div className="patientCareInfoGrid" style={{ marginBottom: '28px' }}>
            <div className="patientCareInfoBox">
              <div className="patientCareInfoIcon">📞</div>
              <div>
                <h3 className="patientCareInfoTitle">Đường dây nóng 24/7</h3>
                <p className="patientCareInfoText">Trường hợp khẩn cấp, vui lòng gọi trực tiếp hotline: <strong style={{ color: '#0284c7' }}>{hotline}</strong> hoặc Cấp cứu: <strong style={{ color: '#ef4444' }}>{emergencyHotline}</strong>.</p>
              </div>
            </div>
            <div className="patientCareInfoBox">
              <div className="patientCareInfoIcon">🔍</div>
              <div>
                <h3 className="patientCareInfoTitle">Cấp mã tra cứu minh bạch</h3>
                <p className="patientCareInfoText">Sau khi gửi ý kiến, bạn sẽ nhận được mã tiếp nhận để tra cứu tiến độ xử lý và phản hồi công khai từ bệnh viện.</p>
              </div>
            </div>
            <div className="patientCareInfoBox">
              <div className="patientCareInfoIcon">⚖️</div>
              <div>
                <h3 className="patientCareInfoTitle">Bảo mật & Tôn trọng</h3>
                <p className="patientCareInfoText">Bệnh viện cam kết bảo mật danh tính người phản ánh theo đúng quy định của Luật Khám bệnh, chữa bệnh.</p>
              </div>
            </div>
          </div>

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
