import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { getGlobal } from '@/lib/payload'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích — Bệnh viện Đa khoa Khu vực Thới Lai',
  description:
    'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

const DEFAULT_FLOORS = [
  {
    floorName: 'Tầng Trệt (Khu Tiếp đón & Cấp cứu)',
    overview: 'Khu vực tiếp đón ban đầu, khám bệnh đa khoa ngoại trú, cấp cứu khẩn cấp và nhà thuốc.',
    rooms: `• Quầy Tiếp nhận BHYT & Phát số tự động (Cửa số 1 – 4)
• Quầy Thu viện phí & Viện phí Ngoại trú
• Khoa Cấp cứu 24/24 & Phòng Hồi sức Cấp cứu chống sốc
• Khoa Khám bệnh (Các phòng khám: Nội, Ngoại, Sản, Nhi, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Y học cổ truyền)
• Nhà thuốc Bệnh viện đạt chuẩn GPP & Quầy Phát thuốc Ngoại trú BHYT
• Bàn Tổ Chăm sóc khách hàng & Chỉ dẫn di chuyển xe lăn`,
  },
  {
    floorName: 'Tầng 1 (Khu Cận lâm sàng & Chẩn đoán hình ảnh)',
    overview: 'Khu kỹ thuật xét nghiệm y học, chẩn đoán hình ảnh và thăm dò chức năng.',
    rooms: `• Phòng Xét nghiệm Huyết học – Sinh hóa – Vi sinh
• Phòng Chụp X-Quang kỹ thuật số & Chụp CT-Scanner
• Phòng Siêu âm Doppler màu (Tổng quát, Tim mạch, Sản phụ khoa)
• Phòng Đo điện tim (ECG) & Đo chức năng hô hấp
• Phòng Nội soi tiêu hóa (Dạ dày – Tá tràng – Đại trực tràng)
• Khu vực ghế chờ lấy máu và trả kết quả cận lâm sàng`,
  },
  {
    floorName: 'Tầng 2 (Khu Điều trị Nội trú 1 & Phẫu thuật)',
    overview: 'Các khoa điều trị nội trú hệ Ngoại, Sản và cụm phòng mổ vô khuẩn.',
    rooms: `• Khoa Ngoại Tổng hợp (Buồng bệnh nội trú Ngoại khoa)
• Khoa Phụ sản & Phòng sinh vô khuẩn
• Cụm Phẫu thuật – Gây mê hồi sức (Phòng mổ áp lực dương)
• Phòng Hồi tỉnh & Phòng Chăm sóc hậu phẫu tích cực
• Phòng Điều dưỡng trưởng khoa & Trực ban Bác sĩ`,
  },
  {
    floorName: 'Tầng 3 (Khu Điều trị Nội trú 2 & Ban Giám đốc)',
    overview: 'Các khoa điều trị nội trú hệ Nội, Nhi, YHCT và văn phòng hành chính.',
    rooms: `• Khoa Nội Tổng hợp & Khoa Nhi
• Khoa Y học Cổ truyền – Phục hồi chức năng
• Khoa Hồi sức tích cực – Chống độc (ICU)
• Hội trường giao ban chuyên môn & Phòng Đào tạo
• Văn phòng Ban Giám đốc & Các phòng chức năng (Kế hoạch tổng hợp, Tổ chức cán bộ, Tài chính kế toán)`,
  },
]

const DEFAULT_FACILITIES = [
  {
    icon: '💊',
    name: 'Nhà thuốc Bệnh viện GPP',
    location: 'Sảnh chính Tầng trệt (cạnh quầy tiếp đón)',
    hours: '06:00 – 21:00 hàng ngày',
    desc: 'Cung ứng đầy đủ thuốc điều trị chính hãng, vắc xin và vật tư y tế theo giá niêm yết của Bộ Y tế.',
  },
  {
    icon: '🚑',
    name: 'Cổng Cấp cứu 24/24',
    location: 'Cổng số 2 (Đường chuyên dụng xe cứu thương)',
    hours: 'Thường trực 24/7/365',
    desc: 'Đường tiếp cận riêng biệt, bằng phẳng, có mái che phục vụ tiếp nhận xe cấp cứu và ca bệnh nguy kịch.',
  },
  {
    icon: '🍵',
    name: 'Căn tin & Suất ăn Dinh dưỡng',
    location: 'Khuôn viên phía sau Tầng trệt',
    hours: '05:30 – 20:00 hàng ngày',
    desc: 'Phục vụ bữa ăn dinh dưỡng, nước giải khát hợp vệ sinh cho thân nhân và cung cấp suất ăn bệnh lý theo chỉ định.',
  },
  {
    icon: '🏧',
    name: 'Cây rút tiền ATM & Điểm thanh toán số',
    location: 'Cổng chính sảnh tiếp đón',
    hours: '24/24',
    desc: 'Cung cấp cây ATM rút tiền mặt và hỗ trợ quét mã VietQR tĩnh/động tại tất cả các quầy thu viện phí.',
  },
  {
    icon: '🛵',
    name: 'Bãi giữ xe 2 bánh & Ô tô',
    location: 'Hai bên cổng chính vào viện',
    hours: '24/24',
    desc: 'Khuôn viên có mái che, hệ thống camera an ninh giám sát và bảo vệ túc trực hỗ trợ người dân.',
  },
  {
    icon: '♿',
    name: 'Khu cấp phát Xe lăn & Xe cáng miễn phí',
    location: 'Tại Bàn Hướng dẫn CSKH (Sảnh chính)',
    hours: '24/24',
    desc: 'Hỗ trợ ngay lập tức người già yếu, bệnh nhân khó đi lại và phụ nữ chuyển dạ.',
  },
]

export default async function HospitalMapPage() {
  let mapPage: any = {}
  try {
    const [specPage, siteSettingsData] = await Promise.all([
      getGlobal('hospital-map-settings' as any).catch(() => null),
      getGlobal('site-settings').catch(() => ({})),
    ])
    const siteSettings: any = siteSettingsData
    mapPage = (specPage && Object.keys(specPage).length > 0) ? specPage : (siteSettings?.hospitalMapPage || {})
  } catch {}
  const eyebrow = mapPage.eyebrow || 'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH'
  const title = mapPage.title || 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích'
  const description =
    mapPage.description ||
    'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  const showNotice = mapPage.showNoticeBanner !== false
  const noticeTitle = mapPage.noticeTitle || 'Bàn Hướng dẫn & Hỗ trợ người bệnh di chuyển'
  const noticeContent =
    mapPage.noticeContent ||
    '• Tại sảnh chính Tầng trệt có Tổ Chăm sóc khách hàng trực tiếp chỉ dẫn và xe lăn hỗ trợ người già, người khuyết tật.\n• Thang máy vận chuyển ưu tiên người bệnh nội trú và xe cáng cấp cứu.'
  const noticeAlign = mapPage.noticeAlign || 'left'

  const rawFloors = Array.isArray(mapPage.floors) && mapPage.floors.length > 0
    ? mapPage.floors.filter((f: any) => f?.enabled !== false)
    : DEFAULT_FLOORS

  const rawFacils = Array.isArray(mapPage.facilities) && mapPage.facilities.length > 0
    ? mapPage.facilities.filter((f: any) => f?.enabled !== false)
    : DEFAULT_FACILITIES

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Sơ đồ bệnh viện"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="so-do" />

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

          {/* 1. Sơ đồ phân tầng khoa phòng */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ marginBottom: '20px', borderLeft: '4px solid #0284c7', paddingLeft: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                Sơ đồ Phân tầng Khoa / Phòng chức năng
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                Tra cứu nhanh vị trí phòng khám và các khu vực chuyên môn tại các tầng trong khuôn viên bệnh viện.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {rawFloors.map((floor: any, idx: number) => {
                const roomList = typeof floor.rooms === 'string'
                  ? floor.rooms.split('\n').filter(Boolean)
                  : Array.isArray(floor.rooms) ? floor.rooms : []

                return (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      borderRadius: '18px',
                      border: '1px solid #e2e8f0',
                      padding: '24px',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '24px' }}>🏢</span>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {floor.floorName}
                      </h3>
                    </div>

                    <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, margin: '0 0 14px', lineHeight: 1.5 }}>
                      {floor.overview}
                    </p>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', flexGrow: 1 }}>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.7 }}>
                        {roomList.map((room: string, rIdx: number) => (
                          <li key={rIdx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ color: '#0284c7' }}>•</span>
                            <span>{room.replace(/^[•\-]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 2. Tiện ích công cộng phục vụ người bệnh */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ marginBottom: '20px', borderLeft: '4px solid #0284c7', paddingLeft: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                Khu vực Dịch vụ Tiện ích & Hỗ trợ Thân nhân
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                Vị trí các điểm hỗ trợ thiết yếu phục vụ nhu cầu sinh hoạt, đi lại của người bệnh và người nhà.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
              {rawFacils.map((fac: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '22px 24px',
                    display: 'flex',
                    gap: '16px',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{fac.icon || '📍'}</div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{fac.name}</h3>
                    <div style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, marginBottom: '4px' }}>
                      📍 {fac.location}
                    </div>
                    {fac.hours && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                        ⏰ {fac.hours}
                      </div>
                    )}
                    {fac.desc && (
                      <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {fac.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. CTA Banner */}
          <div className="patientCareCtaBanner">
            <div className="patientCareCtaContent">
              <h3>Bạn chưa tìm được khoa phòng hoặc cần hỗ trợ xe lăn đưa đón?</h3>
              <p>Tổ Chăm sóc khách hàng tại sảnh chính Tầng trệt luôn túc trực để hướng dẫn và hỗ trợ người bệnh tận tình.</p>
            </div>
            <div className="patientCareCtaActions">
              <Link href="/lien-he" className="btnCtaWhite">
                Thông tin liên hệ
              </Link>
              <Link href="/danh-cho-nguoi-benh" className="btnCtaOutline">
                Cổng người bệnh
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
