import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { getGlobal } from '@/lib/payload'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Gói Khám Sức khỏe & Tầm soát Bệnh lý — Bệnh viện Đa khoa Khu vực Thới Lai',
  description:
    'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

const DEFAULT_PACKAGES = [
  {
    badge: 'Phổ biến nhất',
    title: 'Gói Khám Sức khỏe Tổng quát Định kỳ',
    targetUser: 'Người lớn từ 18 tuổi trở lên, người lao động, cán bộ hưu trí',
    priceText: '850.000 đ',
    desc: 'Kiểm tra toàn diện các chỉ số sinh hiệu, chức năng gan, thận, mỡ máu, đường huyết và phát hiện sớm các bệnh lý chuyển hóa.',
    features: `• Khám lâm sàng toàn diện: Nội, Ngoại, Mắt, Tai Mũi Họng, Răng Hàm Mặt
• Xét nghiệm máu: Công thức máu 18 thông số, Đường huyết đói (Glucose)
• Đánh giá chức năng gan (AST/GOT, ALT/GPT) & Chức năng thận (Ure, Creatinin)
• Xét nghiệm mỡ máu toàn phần (Cholesterol, Triglycerid)
• Tổng phân tích nước tiểu 10 thông số
• Chụp X-Quang ngực thẳng kỹ thuật số
• Siêu âm màu ổ bụng tổng quát & Đo điện tâm đồ (ECG)
• Bác sĩ chuyên khoa kết luận và tư vấn chế độ ăn uống, sinh hoạt`,
    buttonText: 'Đăng ký khám ngay',
    buttonLink: '/dat-lich-kham',
  },
  {
    badge: 'Chuyên sâu',
    title: 'Gói Tầm soát Bệnh lý Tim mạch & Huyết áp',
    targetUser: 'Người trên 40 tuổi, người có tiền sử tăng huyết áp, đái tháo đường hoặc gia đình có bệnh tim',
    priceText: '1.250.000 đ',
    desc: 'Đánh giá nguy cơ xơ vữa động mạch, suy tim, bệnh mạch vành và các biến chứng tim mạch sớm.',
    features: `• Khám chuyên khoa Tim mạch cùng Bác sĩ Chuyên khoa I / II
• Đo điện tâm đồ 12 chuyển đạo (ECG)
• Siêu âm tim Doppler màu khảo sát cấu trúc van tim và co bóp cơ tim
• Xét nghiệm bộ lipid máu nâng cao (HDL-C, LDL-C, Triglycerid, Cholesterol)
• Xét nghiệm đường huyết & HbA1c (đánh giá đường huyết trung bình 3 tháng)
• Đo chức năng thận & Axit Uric máu
• Chụp X-Quang tim phổi thẳng
• Tư vấn phác đồ phòng ngừa nhồi máu cơ tim & đột quỵ`,
    buttonText: 'Đăng ký tầm soát',
    buttonLink: '/dat-lich-kham',
  },
  {
    badge: 'Đúng quy chuẩn',
    title: 'Gói Khám Cấp Giấy phép Lái xe (Hạng A1, B1, B2, C...)',
    targetUser: 'Người học lái xe mới hoặc gia hạn, đổi bằng lái xe các hạng',
    priceText: '360.000 đ',
    desc: 'Khám và cấp Giấy chứng nhận sức khỏe lái xe theo đúng Thông tư liên tịch của Bộ Y tế và Bộ Giao thông Vận tải.',
    features: `• Khám thể lực: Chiều cao, cân nặng, vòng ngực, huyết áp, mạch
• Khám Mắt: Thị lực, sắc giác (khả năng nhận biết màu sắc tín hiệu giao thông)
• Khám Tai Mũi Họng & Thần kinh, Tâm thần
• Khám Cơ xương khớp & Hệ hô hấp, Tim mạch
• Xét nghiệm ma túy 4 chất (Test nhanh que thử 4 chân)
• Xét nghiệm nồng độ cồn trong máu / hơi thở
• Ký duyệt hồ sơ và trả kết quả ngay trong buổi khám`,
    buttonText: 'Đăng ký khám lái xe',
    buttonLink: '/dat-lich-kham',
  },
  {
    badge: 'Hạnh phúc gia đình',
    title: 'Gói Khám Sức khỏe Tiền Hôn nhân',
    targetUser: 'Các cặp đôi chuẩn bị kết hôn hoặc có kế hoạch mang thai',
    priceText: '1.100.000 đ',
    desc: 'Kiểm tra sức khỏe sinh sản, phát hiện sớm các bệnh lý di truyền và bệnh lây truyền qua đường tình dục.',
    features: `• Khám chuyên khoa Sản phụ khoa (Nữ) và Khám Nam khoa (Nam)
• Xét nghiệm công thức máu, nhóm máu ABO & Rh
• Tầm soát viêm gan siêu vi B (HBsAg, Anti-HBs), Viêm gan C
• Xét nghiệm sàng lọc HIV, Giang mai
• Siêu âm tử cung - buồng trứng (Nữ) / Siêu âm tinh hoàn (Nam)
• Soi tươi dịch âm đạo & Tầm soát tế bào cổ tử cung
• Bác sĩ tư vấn tiêm ngừa phòng bệnh trước khi mang thai`,
    buttonText: 'Đăng ký tư vấn',
    buttonLink: '/dat-lich-kham',
  },
]

export default async function CheckupPackagesPage() {
  let pkgPage: any = {}
  try {
    const [specPage, siteSettingsData] = await Promise.all([
      getGlobal('checkup-packages-settings' as any).catch(() => null),
      getGlobal('site-settings').catch(() => ({})),
    ])
    const siteSettings: any = siteSettingsData
    pkgPage = (specPage && Object.keys(specPage).length > 0) ? specPage : (siteSettings?.checkupPackagesPage || {})
  } catch {}
  const eyebrow = pkgPage.eyebrow || 'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE'
  const title = pkgPage.title || 'Gói Khám Sức khỏe & Tầm soát Bệnh lý'
  const description =
    pkgPage.description ||
    'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  const showNotice = pkgPage.showNoticeBanner !== false
  const noticeTitle = pkgPage.noticeTitle || 'Lưu ý quan trọng trước khi đi khám sức khỏe'
  const noticeContent =
    pkgPage.noticeContent ||
    '• Nhịn ăn sáng từ 8 - 10 tiếng nếu gói khám có xét nghiệm đường huyết, mỡ máu.\n• Uống nhiều nước lọc và nhịn tiểu trước khi làm siêu âm ổ bụng.\n• Không sử dụng rượu bia, chất kích thích 24 giờ trước khi khám.'
  const noticeAlign = pkgPage.noticeAlign || 'left'

  const rawPackages = Array.isArray(pkgPage.packages) && pkgPage.packages.length > 0
    ? pkgPage.packages.filter((p: any) => p?.enabled !== false)
    : DEFAULT_PACKAGES

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Gói khám sức khỏe"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="goi-kham" />

          {/* Notice Banner */}
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

          {/* Danh sách các gói khám */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {rawPackages.map((pkg: any, idx: number) => {
              const featuresList = typeof pkg.features === 'string'
                ? pkg.features.split('\n').filter(Boolean)
                : Array.isArray(pkg.features) ? pkg.features : []

              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    padding: '32px 28px',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  {pkg.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '24px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '20px',
                      }}
                    >
                      {pkg.badge}
                    </span>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', paddingRight: '90px' }}>
                      {pkg.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, margin: 0 }}>
                      👥 {pkg.targetUser}
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '14px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Chi phí trọn gói</span>
                    <span style={{ fontSize: '26px', fontWeight: 900, color: '#0284c7' }}>{pkg.priceText}</span>
                  </div>

                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 18px' }}>
                    {pkg.desc}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '24px', flexGrow: 1 }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '10px' }}>
                      Danh mục kỹ thuật bao gồm:
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.7 }}>
                      {featuresList.map((feat: string, fIdx: number) => (
                        <li key={fIdx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                          <span>{feat.replace(/^[•\-✓]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={pkg.buttonLink || '/dat-lich-kham'}
                    className="btnCarePrimary"
                    style={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}
                  >
                    {pkg.buttonText || 'Đăng ký gói khám'} →
                  </Link>
                </div>
              )
            })}
          </div>

          {/* CTA Banner */}
          <div className="patientCareCtaBanner">
            <div className="patientCareCtaContent">
              <h3>Bạn cần tư vấn gói khám phù hợp hoặc đặt lịch cho cơ quan, đoàn thể?</h3>
              <p>Phòng Kế hoạch tổng hợp & CSKH hỗ trợ thiết kế gói khám sức khỏe định kỳ theo yêu cầu của doanh nghiệp.</p>
            </div>
            <div className="patientCareCtaActions">
              <Link href="/dat-lich-kham" className="btnCtaWhite">
                Đặt hẹn khám
              </Link>
              <Link href="/lien-he" className="btnCtaOutline">
                Liên hệ hợp tác
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
