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
  title: 'Dành cho người bệnh — Cổng tiện ích & Hướng dẫn y tế — BVĐK Khu vực Thới Lai',
  description: 'Cổng thông tin một cửa tổng hợp toàn bộ tiện ích dành cho người bệnh: Quy trình khám, Giờ làm việc, Khảo sát ý kiến, Góp ý phản ánh, Hỏi đáp y tế và Biểu mẫu điện tử.',
}

// Danh mục mặc định dự phòng khi CMS chưa khởi tạo dữ liệu
const DEFAULT_SERVICE_GROUPS = [
  {
    enabled: true,
    categoryTitle: 'HƯỚNG DẪN & THỦ TỤC THĂM KHÁM',
    items: [
      {
        enabled: true,
        title: 'Quy trình Khám bệnh',
        desc: 'Sơ đồ các bước thăm khám có thẻ BHYT, khám thu phí tự nguyện và tiếp nhận cấp cứu 24/24.',
        href: '/quy-trinh-kham-benh',
        icon: '🩺',
        badge: 'Cần xem trước',
        badgeType: 'active',
        buttonText: 'Truy cập dịch vụ →',
      },
      {
        enabled: true,
        title: 'Giờ làm việc & Khung giờ khám sớm',
        desc: 'Thời gian phát số từ 06:00, nhóm khoa khám sớm 06:30 sáng và lịch trực các phòng chức năng.',
        href: '/lich-lam-viec',
        icon: '⏰',
        badge: 'Từ 06:00 sáng',
        badgeType: 'periodic',
        buttonText: 'Xem giờ làm việc →',
      },
      {
        enabled: true,
        title: 'Lịch khám bệnh & Lịch trực cấp cứu',
        desc: 'Tra cứu danh sách bác sĩ trực, lịch phân công phòng khám theo tuần và lịch thường trực cấp cứu.',
        href: '/lich-kham',
        icon: '📅',
        badge: 'Cập nhật hàng tuần',
        badgeType: 'active',
        buttonText: 'Xem lịch khám →',
      },
      {
        enabled: true,
        title: 'Bảng giá Viện phí & Danh mục BHYT',
        desc: 'Biểu phí khám bệnh, giá ngày giường, phẫu thuật thủ thuật và quyền lợi chi trả bảo hiểm y tế.',
        href: '/bang-gia',
        icon: '💳',
        badge: 'Minh bạch',
        badgeType: 'periodic',
        buttonText: 'Tra cứu viện phí →',
      },
      {
        enabled: true,
        title: 'Hướng dẫn Điều trị Nội trú',
        desc: 'Thủ tục nhập viện, đồ dùng mang theo, quy định buồng bệnh, giờ thăm và chế độ dinh dưỡng.',
        href: '/dieu-tri-noi-tru',
        icon: '🛏️',
        badge: 'Người bệnh nội trú',
        badgeType: 'active',
        buttonText: 'Xem hướng dẫn nội trú →',
      },
      {
        enabled: true,
        title: 'Gói Khám Sức khỏe & Tầm soát',
        desc: 'Khám tổng quát, tầm soát tim mạch, khám lái xe, khám tiền hôn nhân với bảng giá chi tiết.',
        href: '/goi-kham',
        icon: '📦',
        badge: 'Chủ động',
        badgeType: 'active',
        buttonText: 'Xem các gói khám →',
      },
      {
        enabled: true,
        title: 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích',
        desc: 'Bản đồ phân tầng các phòng khám, xét nghiệm, nhà thuốc GPP, căn tin, ATM và bãi giữ xe.',
        href: '/so-do-benh-vien',
        icon: '🗺️',
        badge: 'Chỉ dẫn tiện ích',
        badgeType: 'periodic',
        buttonText: 'Xem sơ đồ bệnh viện →',
      },
    ],
  },
  {
    enabled: true,
    categoryTitle: 'TIẾP NHẬN Ý KIẾN, KHẢO SÁT & CSKH',
    items: [
      {
        enabled: true,
        title: 'Khảo sát ý kiến & Sự hài lòng',
        desc: 'Đánh giá chất lượng phục vụ nội trú và ngoại trú theo chuẩn 83 Tiêu chí Bộ Y tế (100% ẩn danh).',
        href: '/khao-sat',
        icon: '📝',
        badge: '100% Ẩn danh',
        badgeType: 'active',
        buttonText: 'Tham gia khảo sát →',
      },
      {
        enabled: true,
        title: 'Góp ý – Phản ánh chất lượng',
        desc: 'Gửi ý kiến đóng góp, phản ánh tinh thần thái độ hoặc khen ngợi tập thể y bác sĩ trực tiếp tới Ban Giám đốc.',
        href: '/gop-y',
        icon: '💬',
        badge: 'Tiếp nhận 24/7',
        badgeType: 'active',
        buttonText: 'Gửi phản ánh →',
      },
      {
        enabled: true,
        title: 'Tra cứu Tiến độ Phản ánh',
        desc: 'Nhập Mã tiếp nhận hoặc tra cứu theo Số điện thoại để theo dõi trực tuyến kết quả giải quyết và văn bản trả lời chính thức.',
        href: '/gop-y/tra-cuu',
        icon: '🔍',
        badge: 'Minh bạch tiến độ',
        badgeType: 'active',
        buttonText: 'Tra cứu tiến độ →',
      },
      {
        enabled: true,
        title: 'Hỏi đáp Y tế & Câu hỏi thường gặp',
        desc: 'Tổng hợp giải đáp thắc mắc về BHYT đúng tuyến, thủ tục chuyển viện và tiêm chủng mở rộng.',
        href: '/hoi-dap',
        icon: '❓',
        badge: 'Tra cứu nhanh',
        badgeType: 'periodic',
        buttonText: 'Xem hỏi đáp y tế →',
      },
      {
        enabled: true,
        title: 'Biểu mẫu Điện tử & Đăng ký số',
        desc: 'Khai báo thông tin trước khi đến viện, phiếu đăng ký khám và đơn xin sao lục hồ sơ bệnh án.',
        href: '/bieu-mau',
        icon: '📋',
        badge: 'Tiết kiệm thời gian',
        badgeType: 'periodic',
        buttonText: 'Mở biểu mẫu số →',
      },
      {
        enabled: true,
        title: 'Chất lượng Bệnh viện & Cam kết',
        desc: 'Bộ chỉ số đo lường chất lượng, tỷ lệ hài lòng 94.8% và các chương trình an toàn người bệnh.',
        href: '/chat-luong-benh-vien',
        icon: '⭐',
        badge: 'Chuẩn Bộ Y tế',
        badgeType: 'active',
        buttonText: 'Xem chỉ số chất lượng →',
      },
    ],
  },
]

const DEFAULT_COMMITMENTS = [
  {
    enabled: true,
    icon: '❤️',
    title: 'Lấy người bệnh làm trung tâm',
    desc: 'Mọi quy trình được tối ưu hóa nhằm rút ngắn thời gian chờ đợi, nâng cao an toàn và sự hài lòng của người bệnh.',
  },
  {
    enabled: true,
    icon: '🛡️',
    title: 'Bảo đảm quyền lợi BHYT 100%',
    desc: 'Người bệnh có thẻ BHYT được hưởng tối đa mức chi trả theo quy định của Luật BHYT, hỗ trợ tích hợp VssID và CCCD.',
  },
  {
    enabled: true,
    icon: '📞',
    title: 'Hỗ trợ khẩn cấp 24/24',
    desc: 'Khoa Cấp cứu thường trực 24/7. Đường dây nóng Ban Giám đốc tiếp nhận mọi ý kiến đóng góp kịp thời nhất.',
  },
]

export default async function PatientPortalPage() {
  let siteSettings: any = {}
  let portalSettings: any = {}

  try {
    siteSettings = await getGlobal('site-settings').catch(() => ({}))
  } catch {}

  try {
    portalSettings = await getGlobal('patient-portal-settings').catch(() => ({}))
  } catch {}

  const hotline = siteSettings?.hotline || '02923686115'
  const emergencyHotline = siteSettings?.emergencyHotline || '02923686115'

  // 1. Banner Hero & Thông báo
  const hero = portalSettings?.hero || {}
  const eyebrow = hero.eyebrow || 'CỔNG TIỆN ÍCH DÀNH CHO NGƯỜI BỆNH'
  const title = hero.title || 'Dành cho Người bệnh'
  const description = hero.description || 'Tổng hợp đầy đủ hướng dẫn quy trình khám chữa bệnh, lịch làm việc, biểu phí, kênh tiếp nhận phản ánh và khảo sát ý kiến tại Bệnh viện Đa khoa Khu vực Thới Lai.'
  const showNoticeBanner = Boolean(hero.showNoticeBanner)
  const noticeTitle = hero.noticeTitle || 'Thông báo dành cho người bệnh & thân nhân'
  const noticeContent = hero.noticeContent || ''
  const noticeAlign = hero.noticeAlign || 'left'

  // 2. Tabs Sub-Nav
  const subNavTabs = Array.isArray(portalSettings?.subNavTabs) && portalSettings.subNavTabs.length > 0
    ? portalSettings.subNavTabs.filter((t: any) => t?.enabled !== false)
    : undefined

  // 3. Cam kết phục vụ
  const commitmentsSection = portalSettings?.commitmentsSection || {}
  const showCommitments = commitmentsSection.enabled !== false
  const rawCommitments = Array.isArray(commitmentsSection.items) && commitmentsSection.items.length > 0
    ? commitmentsSection.items
    : DEFAULT_COMMITMENTS
  const commitments = rawCommitments.filter((c: any) => c?.enabled !== false)

  // 4. Nhóm danh mục tiện ích dịch vụ
  const rawGroups = Array.isArray(portalSettings?.serviceGroups) && portalSettings.serviceGroups.length > 0
    ? portalSettings.serviceGroups
    : DEFAULT_SERVICE_GROUPS
  const serviceGroups = rawGroups
    .filter((g: any) => g?.enabled !== false)
    .map((g: any) => ({
      ...g,
      items: (Array.isArray(g.items) ? g.items : []).filter((i: any) => i?.enabled !== false),
    }))
    .filter((g: any) => g.items.length > 0)

  // 5. Khối CTA Hotline cuối trang
  const ctaSection = portalSettings?.ctaSection || {}
  const showCta = ctaSection.enabled !== false
  const ctaTitle = ctaSection.title || 'Bạn cần hỗ trợ khẩn cấp hoặc cần hỏi thêm thông tin?'
  const ctaDesc = (ctaSection.description || 'Đường dây nóng bệnh viện: {{HOTLINE}} · Cấp cứu 24/24: {{EMERGENCY_HOTLINE}}. Bệnh viện luôn sẵn sàng phục vụ!')
    .replace(/\{\{HOTLINE\}\}/g, hotline)
    .replace(/\{\{EMERGENCY_HOTLINE\}\}/g, emergencyHotline)
  const ctaPrimaryText = ctaSection.primaryBtnText || 'Gọi tư vấn ngay'
  const ctaSecondaryText = ctaSection.secondaryBtnText || 'Thông tin liên hệ'
  const ctaSecondaryLink = ctaSection.secondaryBtnLink || '/lien-he'

  // Badge class mapper
  const getBadgeClass = (type: string) => {
    if (type === 'periodic') return 'patientCareCardBadge badgePeriodic'
    if (type === 'closed') return 'patientCareCardBadge badgeClosed'
    return 'patientCareCardBadge badgeActive'
  }

  // 6. Khối bài viết chi tiết & Khối tùy biến
  const contentBlock = portalSettings?.contentBlock || {}
  const showContentBlock = contentBlock.enabled !== false && (contentBlock.title || contentBlock.content)
  const cbAlign = contentBlock.textAlign || 'left'

  const rawCustomBlocks = Array.isArray(portalSettings?.customBlocks) ? portalSettings.customBlocks : []
  const customBlocks = rawCustomBlocks.filter((b: any) => b?.enabled !== false)

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Dành cho người bệnh"
      />

      <main className="patientCareSection">
        <div className="container">
          {/* Sub-navigation điều hướng linh hoạt quản lý từ CMS */}
          <PatientCareSubNav activeKey="danh-cho-nguoi-benh" customTabs={subNavTabs} />

          {/* Banner Thông báo lưu ý đầu trang (nếu được bật từ CMS) */}
          {showNoticeBanner && (
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

          {/* Khối các cam kết phục vụ */}
          {showCommitments && commitments.length > 0 && (
            <div className="patientCareInfoGrid" style={{ marginBottom: '36px' }}>
              {commitments.map((commit: any, cIdx: number) => (
                <div key={cIdx} className="patientCareInfoBox">
                  <div className="patientCareInfoIcon">{commit.icon || '❤️'}</div>
                  <div>
                    <h3 className="patientCareInfoTitle">{commit.title}</h3>
                    <p className="patientCareInfoText">{commit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nhóm các danh mục dịch vụ tiện ích */}
          {serviceGroups.map((section: any, sIdx: number) => (
            <div key={sIdx} style={{ marginBottom: '40px' }}>
              <div style={{ marginBottom: '18px', borderLeft: '4px solid #0284c7', paddingLeft: '14px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {section.categoryTitle}
                </h2>
              </div>

              <div className="patientCareGrid">
                {section.items.map((item: any, iIdx: number) => (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className="patientCareCard"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="patientCareCardTop">
                      <div className="patientCareCardIcon">{item.icon || '🩺'}</div>
                      {item.badge && (
                        <span className={getBadgeClass(item.badgeType)}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="patientCareCardTitle">{item.title}</h3>
                    <p className="patientCareCardDesc">{item.desc}</p>
                    <div className="patientCareCardActions" style={{ marginTop: 'auto' }}>
                      <span className="btnCarePrimary" style={{ width: '100%' }}>
                        {item.buttonText || 'Truy cập dịch vụ →'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Bài viết chi tiết & Hướng dẫn tổng quan (RichText) */}
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
                    Chào mừng quý người bệnh và thân nhân đến với <strong>Cổng tiện ích dành cho người bệnh</strong> của <strong>Bệnh viện Đa khoa Khu vực Thới Lai</strong>. Hệ thống được xây dựng nhằm mang đến sự thuận tiện, minh bạch và an toàn tối đa cho bà con trong suốt quá trình thăm khám và điều trị.
                  </p>
                  <p>
                    <strong>Tiện ích nổi bật tại bệnh viện:</strong>
                  </p>
                  <ul>
                    <li>Tra cứu lịch khám bệnh, lịch trực cấp cứu và danh sách bác sĩ chuyên khoa phụ trách hàng tuần.</li>
                    <li>Đăng ký số thứ tự khám trực tuyến, khám sớm từ 06:30 sáng, giảm thiểu thời gian chờ đợi tại viện.</li>
                    <li>Áp dụng thẻ Căn cước công dân gắn chip hoặc ứng dụng VNeID / VssID thay thế hoàn toàn thẻ BHYT giấy.</li>
                    <li>Kênh tiếp nhận góp ý, phản ánh và khảo sát ý kiến người bệnh hoạt động liên tục 24/7 trực tiếp tới Ban Giám đốc.</li>
                  </ul>
                </div>
              )}
            </article>
          )}

          {/* Các khối nội dung tùy biến thêm mới (Custom Blocks) */}
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

          {/* CTA Banner liên kết hotline */}
          {showCta && (
            <div className="patientCareCtaBanner">
              <div className="patientCareCtaContent">
                <h3>{ctaTitle}</h3>
                <p>{ctaDesc}</p>
              </div>
              <div className="patientCareCtaActions">
                <Link href={`tel:${hotline.replace(/\s+/g, '')}`} className="btnCtaWhite">
                  {ctaPrimaryText}
                </Link>
                <Link href={ctaSecondaryLink} className="btnCtaOutline">
                  {ctaSecondaryText}
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
