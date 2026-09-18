import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { RichText } from '@/components/RichText'
import { getGlobal } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Hướng dẫn Điều trị Nội trú — Bệnh viện Đa khoa Khu vực Thới Lai',
  description:
    'Thông tin chi tiết về thủ tục nhập viện, đồ dùng cần chuẩn bị, quy định buồng bệnh, giờ thăm bệnh và chế độ dinh dưỡng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

const DEFAULT_STEPS = [
  {
    step: 1,
    title: 'Tiếp nhận chỉ định Nhập viện',
    location: 'Phòng khám ban đầu hoặc Khoa Cấp cứu',
    desc: 'Khi có kết luận điều trị nội trú từ Bác sĩ khám, người bệnh nhận Giấy vào viện và được nhân viên y tế hướng dẫn hoàn thiện thủ tục.',
    note: 'Người bệnh hoặc người nhà kiểm tra kỹ thông tin hành chính trên Giấy vào viện.',
  },
  {
    step: 2,
    title: 'Nộp hồ sơ & Tạm ứng Viện phí',
    location: 'Quầy Thu viện phí Nội trú (Khu tiếp đón)',
    desc: 'Người nhà xuất trình Thẻ BHYT, CCCD gắn chip (hoặc ứng dụng VNeID/VssID) và nộp khoản tạm ứng viện phí theo quy định của bệnh viện.',
    note: 'Bệnh viện chấp nhận thanh toán quét mã QR qua ứng dụng ngân hàng hoặc tiền mặt.',
  },
  {
    step: 3,
    title: 'Nhận buồng bệnh & Tiếp đón ban đầu',
    location: 'Khoa Lâm sàng tương ứng (Nội, Ngoại, Sản, Nhi...)',
    desc: 'Điều dưỡng khoa tiếp đón, hướng dẫn người bệnh nhận giường bệnh, cấp phát trang phục bệnh nhân, vòng đeo tay nhận diện và dặn dò nội quy khoa.',
    note: 'Người bệnh phải đeo vòng nhận diện trong suốt thời gian điều trị để đảm bảo an toàn y tế.',
  },
  {
    step: 4,
    title: 'Bác sĩ điều trị thăm khám & Lên phác đồ',
    location: 'Tại giường bệnh',
    desc: 'Bác sĩ điều trị thăm khám lâm sàng toàn diện, giải thích tình trạng bệnh tật, phác đồ điều trị dự kiến và chế độ dinh dưỡng phù hợp.',
    note: 'Mọi thắc mắc của người bệnh hoặc thân nhân sẽ được Bác sĩ và Điều dưỡng trưởng giải đáp tận tình.',
  },
]

const DEFAULT_HOURS = [
  { session: 'Buổi sáng', timeRange: '06:00 – 07:00', note: 'Trước giờ bác sĩ đi buồng thăm khám' },
  { session: 'Buổi trưa', timeRange: '11:30 – 13:00', note: 'Giờ nghỉ ngơi và ăn trưa của người bệnh' },
  { session: 'Buổi chiều tối', timeRange: '17:00 – 21:00', note: 'Sau giờ làm việc hành chính của khoa' },
]

const DEFAULT_ITEMS = [
  {
    icon: '🪪',
    category: 'Người bệnh chuẩn bị mang theo',
    title: 'Giấy tờ tùy thân & Thẻ BHYT',
    desc: 'Bản gốc CCCD gắn chip hoặc ứng dụng VNeID mức 2 tích hợp thẻ BHYT, giấy chuyển tuyến hoặc giấy hẹn tái khám (nếu có).',
  },
  {
    icon: '💊',
    category: 'Người bệnh chuẩn bị mang theo',
    title: 'Toa thuốc & Hồ sơ bệnh cũ',
    desc: 'Tất cả các toa thuốc đang sử dụng tại nhà, kết quả xét nghiệm, phim chụp X-quang, CT gần nhất để bác sĩ điều trị đối chiếu.',
  },
  {
    icon: '🧼',
    category: 'Người bệnh chuẩn bị mang theo',
    title: 'Vật dụng vệ sinh cá nhân',
    desc: 'Bàn chải, kem đánh răng, khăn mặt, dép đi trong nhà, cốc nước cá nhân. Hạn chế mang đồ trang sức và tài sản có giá trị lớn.',
  },
  {
    icon: '👕',
    category: 'Bệnh viện cung cấp sẵn',
    title: 'Quần áo & Chăn drap giường bệnh',
    desc: 'Được thay mới định kỳ mỗi ngày hoặc đột xuất khi bẩn. Giặt ủi vô trùng theo tiêu chuẩn kiểm soát nhiễm khuẩn y tế.',
  },
  {
    icon: '🍲',
    category: 'Bệnh viện cung cấp sẵn',
    title: 'Suất ăn Bệnh lý Khoa Dinh dưỡng',
    desc: 'Cung cấp suất ăn chuyên biệt (tiểu đường, suy thận, sau mổ, cháo loãng...) theo chỉ định của Bác sĩ điều trị và Dược sĩ dinh dưỡng.',
  },
  {
    icon: '🏷️',
    category: 'Bệnh viện cung cấp sẵn',
    title: 'Vòng tay nhận diện an toàn & Thẻ nuôi bệnh',
    desc: 'Mỗi buồng bệnh cấp 01 thẻ nuôi bệnh cho người chăm sóc trực tiếp, bảo đảm an ninh trật tự toàn khoa.',
  },
]

export default async function InpatientPage() {
  let ipPage: any = {}
  try {
    const [specPage, siteSettingsData] = await Promise.all([
      getGlobal('inpatient-guide-settings' as any).catch(() => null),
      getGlobal('site-settings').catch(() => ({})),
    ])
    const siteSettings: any = siteSettingsData
    ipPage = (specPage && Object.keys(specPage).length > 0) ? specPage : (siteSettings?.inpatientPage || {})
  } catch {}
  const eyebrow = ipPage.eyebrow || 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH'
  const title = ipPage.title || 'Hướng dẫn Điều trị Nội trú'
  const description =
    ipPage.description ||
    'Thông tin chi tiết về thủ tục nhập viện, đồ dùng cần chuẩn bị, quy định buồng bệnh, giờ thăm bệnh và chế độ dinh dưỡng tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  const showNotice = ipPage.showNoticeBanner !== false
  const noticeTitle = ipPage.noticeTitle || 'Nội quy buồng bệnh và an toàn người bệnh'
  const noticeContent =
    ipPage.noticeContent ||
    '• Mỗi người bệnh được tối đa 01 người thân ở lại chăm sóc và phải đeo thẻ nuôi bệnh.\n• Giữ gìn trật tự chung, tuyệt đối không hút thuốc lá trong khuôn viên bệnh viện.\n• Bệnh viện phục vụ chế độ ăn bệnh lý đạt chuẩn an toàn vệ sinh thực phẩm.'
  const noticeAlign = ipPage.noticeAlign || 'left'

  const rawSteps = Array.isArray(ipPage.admissionSteps) && ipPage.admissionSteps.length > 0
    ? ipPage.admissionSteps.filter((s: any) => s?.enabled !== false)
    : DEFAULT_STEPS

  const rawHours = Array.isArray(ipPage.visitingHours) && ipPage.visitingHours.length > 0
    ? ipPage.visitingHours.filter((h: any) => h?.enabled !== false)
    : DEFAULT_HOURS

  const rawItems = Array.isArray(ipPage.belongingsChecklist) && ipPage.belongingsChecklist.length > 0
    ? ipPage.belongingsChecklist.filter((i: any) => i?.enabled !== false)
    : DEFAULT_ITEMS

  // Khối bài viết chi tiết & Khối tùy biến
  const contentBlock = ipPage.contentBlock || {}
  const showContentBlock = contentBlock.enabled !== false && (contentBlock.title || contentBlock.content)
  const cbAlign = contentBlock.textAlign || 'left'

  const rawCustomBlocks = Array.isArray(ipPage.customBlocks) ? ipPage.customBlocks : []
  const customBlocks = rawCustomBlocks.filter((b: any) => b?.enabled !== false)

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Điều trị nội trú"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="noi-tru" />

          {/* 1. Notice Banner */}
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

          {/* 2. Quy trình các bước nhập viện */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ marginBottom: '20px', borderLeft: '4px solid #0284c7', paddingLeft: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                1. Quy trình 4 bước làm thủ tục Nhập viện
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                Các bước tiếp nhận khoa học giúp người bệnh và thân nhân hoàn thành thủ tục nhanh chóng, an tâm điều trị.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              {rawSteps.map((step: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '14px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.step || idx + 1}
                    </span>
                    <span style={{ fontSize: '12px', background: '#f0f9ff', color: '#0369a1', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>
                      📍 {step.location}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{step.title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>{step.desc}</p>
                  {step.note && (
                    <div style={{ marginTop: '14px', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', fontSize: '12.5px', color: '#64748b', borderLeft: '3px solid #94a3b8' }}>
                      💡 {step.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3. Khung giờ thăm bệnh thân nhân */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ marginBottom: '20px', borderLeft: '4px solid #0284c7', paddingLeft: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                2. Quy định Khung giờ Thăm bệnh
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                Bảo đảm môi trường nghỉ ngơi yên tĩnh, phục hồi tốt nhất cho người bệnh và tránh lây nhiễm chéo.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {rawHours.map((hour: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '22px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <div style={{ fontSize: '32px' }}>⏰</div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.5px' }}>
                      {hour.session}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{hour.timeRange}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{hour.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Danh mục đồ dùng cần chuẩn bị */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ marginBottom: '20px', borderLeft: '4px solid #0284c7', paddingLeft: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                3. Đồ dùng mang theo & Trang thiết bị BV cung cấp
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
                Danh sách chi tiết giúp người bệnh và thân nhân chuẩn bị đầy đủ, tiện lợi khi nằm viện.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              {rawItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '22px 24px',
                    display: 'flex',
                    gap: '16px',
                  }}
                >
                  <div style={{ fontSize: '28px', flexShrink: 0 }}>{item.icon || '🎒'}</div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: item.category?.includes('Bệnh viện') ? '#059669' : '#0284c7' }}>
                      {item.category}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '4px 0 6px' }}>{item.title}</h3>
                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Bài viết chi tiết & Hướng dẫn chuyên sâu (RichText) */}
          {showContentBlock && (
            <article className="patientCareArticleCard" style={cbAlign !== 'left' ? { textAlign: cbAlign as any } : undefined}>
              <div className="patientCareArticleHeader">
                {contentBlock.title && <h2 className="patientCareArticleTitle">{contentBlock.title}</h2>}
                {contentBlock.subtitle && <p className="patientCareArticleSubtitle">{contentBlock.subtitle}</p>}
              </div>
              {contentBlock.content ? (
                <div className="patientCareArticleBody">
                  <RichText data={contentBlock.content} />
                </div>
              ) : (
                <div className="patientCareArticleBody">
                  <p>
                    Tại <strong>Bệnh viện Đa khoa Khu vực Thới Lai</strong>, người bệnh điều trị nội trú được hưởng chế độ chăm sóc y tế toàn diện, bảo đảm an toàn người bệnh theo đúng quy chuẩn của Bộ Y tế.
                  </p>
                  <p>
                    <strong>Quyền lợi và trách nhiệm của người bệnh:</strong>
                  </p>
                  <ul>
                    <li>Được Bác sĩ điều trị và Điều dưỡng viên theo dõi sát diễn biến sức khỏe 24/24.</li>
                    <li>Được giải thích rõ ràng về tình trạng bệnh lý, phương pháp phác đồ điều trị và các dịch vụ kỹ thuật được chỉ định.</li>
                    <li>Bảo đảm hưởng 100% quyền lợi chi trả của Bảo hiểm Y tế theo đúng quy định hiện hành.</li>
                    <li>Tuân thủ nội quy buồng bệnh, giữ gìn vệ sinh chung và không hút thuốc lá trong khuôn viên bệnh viện.</li>
                  </ul>
                </div>
              )}
            </article>
          )}

          {/* 5. Các khối nội dung tùy biến thêm mới (Custom Blocks) */}
          {customBlocks.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              {customBlocks.map((block: any, bIdx: number) => {
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

          {/* 6. CTA Banner */}
          <div className="patientCareCtaBanner">
            <div className="patientCareCtaContent">
              <h3>Bạn cần hỗ trợ thêm thông tin về thủ tục Nội trú?</h3>
              <p>Khoa Khám bệnh và Tổ Chăm sóc khách hàng luôn sẵn sàng hỗ trợ người bệnh và thân nhân trong mọi tình huống.</p>
            </div>
            <div className="patientCareCtaActions">
              <Link href="/quy-trinh-kham-benh" className="btnCtaWhite">
                Xem Quy trình khám
              </Link>
              <Link href="/lien-he" className="btnCtaOutline">
                Hotline viện
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
