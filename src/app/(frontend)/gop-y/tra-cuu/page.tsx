import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { FeedbackLookup } from '@/components/FeedbackLookup'

export const metadata = {
  title: 'Tra cứu tiến độ xử lý phản ánh — Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Tra cứu tình trạng xử lý và câu trả lời chính thức của Bệnh viện Đa khoa Khu vực Thới Lai bằng Mã tiếp nhận và Số điện thoại.',
  robots: { index: false, follow: false },
}

export default async function FeedbackLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const params = await searchParams

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHĂM SÓC NGƯỜI BỆNH & MINH BẠCH THÔNG TIN"
        title="Tra cứu Tiến độ Phản ánh"
        description="Nhập Mã tiếp nhận đã được cấp cùng Số điện thoại liên hệ để theo dõi quá trình phân công, xác minh và phản hồi của Ban Giám đốc bệnh viện."
        breadcrumb="Tra cứu phản ánh"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="tra-cuu" />

          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)' }}>
              <FeedbackLookup initialCode={params?.code || ''} />
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', padding: '18px 24px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                Cần gửi ý kiến đóng góp hoặc phản ánh mới?{' '}
                <a href="/gop-y" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
                  Gửi phản ánh trực tuyến tại đây →
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
