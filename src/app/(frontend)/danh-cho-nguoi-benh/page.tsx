import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { getGlobal } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Dành cho người bệnh — Cổng tiện ích & Hướng dẫn y tế — BVĐK Khu vực Thới Lai',
  description: 'Cổng thông tin một cửa tổng hợp toàn bộ tiện ích dành cho người bệnh: Quy trình khám, Giờ làm việc, Khảo sát ý kiến, Góp ý phản ánh, Hỏi đáp y tế và Biểu mẫu điện tử.',
}

const PATIENT_PORTAL_SERVICES = [
  {
    category: 'HƯỚNG DẪN & THỦ TỤC THĂM KHÁM',
    items: [
      {
        title: 'Quy trình Khám bệnh',
        desc: 'Sơ đồ các bước thăm khám có thẻ BHYT, khám thu phí tự nguyện và tiếp nhận cấp cứu 24/24.',
        href: '/quy-trinh-kham-benh',
        icon: '🩺',
        badge: 'Cần xem trước',
        badgeColor: 'blue',
      },
      {
        title: 'Giờ làm việc & Khung giờ khám sớm',
        desc: 'Thời gian phát số từ 06:00, nhóm khoa khám sớm 06:30 sáng và lịch trực các phòng chức năng.',
        href: '/lich-lam-viec',
        icon: '⏰',
        badge: 'Từ 06:00 sáng',
        badgeColor: 'teal',
      },
      {
        title: 'Lịch khám bệnh & Lịch trực cấp cứu',
        desc: 'Tra cứu danh sách bác sĩ trực, lịch phân công phòng khám theo tuần và lịch thường trực cấp cứu.',
        href: '/lich-kham',
        icon: '📅',
        badge: 'Cập nhật hàng tuần',
        badgeColor: 'purple',
      },
      {
        title: 'Bảng giá Viện phí & Danh mục BHYT',
        desc: 'Biểu phí khám bệnh, giá ngày giường, phẫu thuật thủ thuật và quyền lợi chi trả bảo hiểm y tế.',
        href: '/bang-gia',
        icon: '💳',
        badge: 'Minh bạch',
        badgeColor: 'amber',
      },
    ],
  },
  {
    category: 'TIẾP NHẬN Ý KIẾN, KHẢO SÁT & CSKH',
    items: [
      {
        title: 'Khảo sát ý kiến & Sự hài lòng',
        desc: 'Đánh giá chất lượng phục vụ nội trú và ngoại trú theo chuẩn 83 Tiêu chí Bộ Y tế (100% ẩn danh).',
        href: '/khao-sat',
        icon: '📝',
        badge: '100% Ẩn danh',
        badgeColor: 'green',
      },
      {
        title: 'Góp ý – Phản ánh chất lượng',
        desc: 'Gửi ý kiến đóng góp, phản ánh tinh thần thái độ hoặc khen ngợi tập thể y bác sĩ trực tiếp tới Ban Giám đốc.',
        href: '/gop-y',
        icon: '💬',
        badge: 'Tiếp nhận 24/7',
        badgeColor: 'orange',
      },
      {
        title: 'Tra cứu Tiến độ Phản ánh',
        desc: 'Nhập Mã tiếp nhận để theo dõi trực tuyến kết quả giải quyết và văn bản trả lời chính thức.',
        href: '/gop-y/tra-cuu',
        icon: '🔍',
        badge: 'Minh bạch tiến độ',
        badgeColor: 'blue',
      },
      {
        title: 'Hỏi đáp Y tế & Câu hỏi thường gặp',
        desc: 'Tổng hợp giải đáp thắc mắc về BHYT đúng tuyến, thủ tục chuyển viện và tiêm chủng mở rộng.',
        href: '/hoi-dap',
        icon: '❓',
        badge: 'Tra cứu nhanh',
        badgeColor: 'teal',
      },
      {
        title: 'Biểu mẫu Điện tử & Đăng ký số',
        desc: 'Khai báo thông tin trước khi đến viện, phiếu đăng ký khám và đơn xin sao lục hồ sơ bệnh án.',
        href: '/bieu-mau',
        icon: '📋',
        badge: 'Tiết kiệm thời gian',
        badgeColor: 'indigo',
      },
      {
        title: 'Chất lượng Bệnh viện & Cam kết',
        desc: 'Bộ chỉ số đo lường chất lượng, tỷ lệ hài lòng 94.8% và các chương trình an toàn người bệnh.',
        href: '/chat-luong-benh-vien',
        icon: '⭐',
        badge: 'Chuẩn Bộ Y tế',
        badgeColor: 'amber',
      },
    ],
  },
]

export default async function PatientPortalPage() {
  let siteSettings: any = {}
  try {
    siteSettings = await getGlobal('site-settings').catch(() => ({}))
  } catch {}

  const hotline = siteSettings?.hotline || '02923686115'
  const emergencyHotline = siteSettings?.emergencyHotline || '02923686115'

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CỔNG TIỆN ÍCH DÀNH CHO NGƯỜI BỆNH"
        title="Dành cho Người bệnh"
        description="Tổng hợp đầy đủ hướng dẫn quy trình khám chữa bệnh, lịch làm việc, biểu phí, kênh tiếp nhận phản ánh và khảo sát ý kiến tại Bệnh viện Đa khoa Khu vực Thới Lai."
        breadcrumb="Dành cho người bệnh"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="danh-cho-nguoi-benh" />

          {/* Khối 3 cam kết phục vụ */}
          <div className="patientCareInfoGrid" style={{ marginBottom: '36px' }}>
            <div className="patientCareInfoBox">
              <div className="patientCareInfoIcon">❤️</div>
              <div>
                <h3 className="patientCareInfoTitle">Lấy người bệnh làm trung tâm</h3>
                <p className="patientCareInfoText">Mọi quy trình được tối ưu hóa nhằm rút ngắn thời gian chờ đợi, nâng cao an toàn và sự hài lòng của người bệnh.</p>
              </div>
            </div>
            <div className="patientCareInfoBox">
              <div className="patientCareInfoIcon">🛡️</div>
              <div>
                <h3 className="patientCareInfoTitle">Bảo đảm quyền lợi BHYT 100%</h3>
                <p className="patientCareInfoText">Người bệnh có thẻ BHYT được hưởng tối đa mức chi trả theo quy định của Luật BHYT, hỗ trợ tích hợp VssID và CCCD.</p>
              </div>
            </div>
            <div className="patientCareInfoBox">
              <div className="patientCareInfoIcon">📞</div>
              <div>
                <h3 className="patientCareInfoTitle">Hỗ trợ khẩn cấp 24/24</h3>
                <p className="patientCareInfoText">Khoa Cấp cứu thường trực 24/7. Đường dây nóng Ban Giám đốc tiếp nhận mọi ý kiến đóng góp kịp thời nhất.</p>
              </div>
            </div>
          </div>

          {/* Nhóm các danh mục dịch vụ */}
          {PATIENT_PORTAL_SERVICES.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '40px' }}>
              <div style={{ marginBottom: '18px', borderLeft: '4px solid #0284c7', paddingLeft: '14px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {section.category}
                </h2>
              </div>

              <div className="patientCareGrid">
                {section.items.map((item, iIdx) => (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className="patientCareCard"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="patientCareCardTop">
                      <div className="patientCareCardIcon">{item.icon}</div>
                      <span className="patientCareCardBadge badgeActive">{item.badge}</span>
                    </div>
                    <h3 className="patientCareCardTitle">{item.title}</h3>
                    <p className="patientCareCardDesc">{item.desc}</p>
                    <div className="patientCareCardActions" style={{ marginTop: 'auto' }}>
                      <span className="btnCarePrimary" style={{ width: '100%' }}>
                        Truy cập dịch vụ →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* CTA Banner liên kết hotline */}
          <div className="patientCareCtaBanner">
            <div className="patientCareCtaContent">
              <h3>Bạn cần hỗ trợ khẩn cấp hoặc cần hỏi thêm thông tin?</h3>
              <p>Đường dây nóng bệnh viện: <strong>{hotline}</strong> · Cấp cứu 24/24: <strong>{emergencyHotline}</strong>. Bệnh viện luôn sẵn sàng phục vụ!</p>
            </div>
            <div className="patientCareCtaActions">
              <Link href={`tel:${hotline.replace(/\s+/g, '')}`} className="btnCtaWhite">
                Gọi tư vấn ngay
              </Link>
              <Link href="/lien-he" className="btnCtaOutline">
                Thông tin liên hệ
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
