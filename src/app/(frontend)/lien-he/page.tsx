import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FeedbackForm } from '@/components/FeedbackForm'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { getGlobal } from '@/lib/payload'
import './lien-he.css'

export const revalidate = 60

const defaultAddress = 'Ấp Thới Phong, Xã Thới Lai, Thành phố Cần Thơ'

function getGoogleMapsUrl(value: unknown, address: string) {
  const raw = typeof value === 'string' ? value.trim() : ''
  const iframeSrc = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1]
  const candidate = (iframeSrc || raw).replaceAll('&amp;', '&')

  if (candidate) {
    try {
      const url = new URL(candidate)
      const googleHost = url.hostname === 'google.com' || url.hostname.endsWith('.google.com')
      if (
        url.protocol === 'https:' &&
        googleHost &&
        (url.pathname.includes('/embed') || url.searchParams.get('output') === 'embed')
      ) {
        return url.toString()
      }
    } catch {}
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
}

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {}
  try {
    settings = await getGlobal('contact-settings')
  } catch {}
  const title = settings?.hero?.title || 'Liên hệ & Tiếp nhận Thông tin'
  const description =
    settings?.hero?.description ||
    'Thông tin liên hệ, đường dây nóng cấp cứu 24/24, địa chỉ, bản đồ và kênh tiếp nhận phản ánh của Bệnh viện Đa khoa Khu vực Thới Lai.'
  return {
    title: `${title} — BVĐK Khu vực Thới Lai`,
    description,
  }
}

export default async function ContactPage() {
  let contactSettings: any = {}
  let siteSettings: any = {}
  let socialSettings: any = {}

  try {
    const [contact, site, social] = await Promise.all([
      getGlobal('contact-settings').catch(() => ({})),
      getGlobal('site-settings').catch(() => ({})),
      getGlobal('social-settings').catch(() => ({})),
    ])
    contactSettings = contact || {}
    siteSettings = site || {}
    socialSettings = social || {}
  } catch (err) {
    console.error('[ContactPage] Lỗi lấy dữ liệu cấu hình:', err)
  }

  // 1. Phân giải cấu hình từ Admin CMS
  const hero = contactSettings.hero || {}
  const notice = contactSettings.notice || {}
  const core = contactSettings.coreInfo || {}
  const toggles = contactSettings.displayToggles || {}

  const eyebrow = hero.eyebrow || 'KẾT NỐI VỚI CHÚNG TÔI'
  const title = hero.title || 'Liên hệ & Tiếp nhận Thông tin'
  const description =
    hero.description ||
    'Bệnh viện Đa khoa Khu vực Thới Lai luôn sẵn sàng lắng nghe, tư vấn khám chữa bệnh và tiếp nhận mọi ý kiến đóng góp từ Quý người bệnh và thân nhân.'

  const hospitalName = siteSettings.hospitalName || 'Bệnh viện Đa khoa Khu vực Thới Lai'
  const address = core.address || contactSettings.address || siteSettings.address || defaultAddress
  const hotline = core.hotline || contactSettings.hotline || siteSettings.hotline || '0292 3861 234'
  const emergencyHotline =
    core.emergencyHotline ||
    contactSettings.emergencyHotline ||
    siteSettings.emergencyHotline ||
    '0292 3861 115'
  const email = core.email || contactSettings.email || siteSettings.email || 'bvdkthoilai@cantho.gov.vn'
  const workingHours =
    core.workingHours ||
    contactSettings.workingHours ||
    siteSettings.workingHours ||
    'Thứ 2 – Thứ 7: Sáng 06:30 – 11:30 | Chiều 13:00 – 17:00 (Cấp cứu trực 24/24)'
  const googleMapsUrl = core.googleMapsUrl || contactSettings.googleMapsUrl || 'https://maps.google.com'
  const rawEmbed = core.googleMapsEmbed || contactSettings.googleMapsEmbed || siteSettings.googleMapsEmbed
  const mapEmbedUrl = getGoogleMapsUrl(rawEmbed, address)

  const facebookUrl = socialSettings.facebookUrl || siteSettings.facebookUrl
  const zaloUrl = socialSettings.zaloUrl || siteSettings.zaloUrl

  const showCards = toggles.showContactCards !== false
  const showMap = toggles.showMap !== false
  const showForm = toggles.showFeedbackForm !== false
  const showHours = toggles.showSupportHours !== false
  const showSocial = toggles.showSocialLinks !== false

  return (
    <>
      <SiteHeader />
      <PageHero eyebrow={eyebrow} title={title} description={description} breadcrumb="Liên hệ" />

      <main className="section">
        <div className="container contactPageWrapper">
          <PatientCareSubNav activeKey="lien-he" />

          {/* BẢNG THÔNG BÁO / LƯU Ý QUAN TRỌNG TỪ ADMIN */}
          {notice.enabled && (notice.content || notice.title) && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #93c5fd',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
                textAlign: notice.textAlign || 'left',
              }}
            >
              {notice.title && (
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
                      notice.textAlign === 'center'
                        ? 'center'
                        : notice.textAlign === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                    textWrap: 'balance',
                  }}
                >
                  <span>📢</span> {notice.title}
                </h3>
              )}
              {notice.content && (
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
                  {notice.content}
                </p>
              )}
            </div>
          )}

          {/* 1. LƯỚI 4 THẺ THÔNG TIN TIẾP ĐÓN NHANH */}
          {showCards && (
            <div className="contactQuickCardsGrid">
              {/* Thẻ Cấp cứu 24/24 */}
              <div className="contactQuickCard emergencyCard">
                <div className="contactCardIconWrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <span className="contactCardLabel">Đường dây nóng Cấp cứu</span>
                <div className="contactCardMainValue">
                  <a href={`tel:${emergencyHotline.replace(/\s+/g, '')}`}>{emergencyHotline}</a>
                </div>
                <p className="contactCardSubText">Trực cấp cứu 24/24 tất cả các ngày trong tuần, kể cả ngày Lễ, Tết.</p>
                <div className="contactCardAction">
                  <a href={`tel:${emergencyHotline.replace(/\s+/g, '')}`} className="contactActionLink">
                    Gọi cấp cứu ngay →
                  </a>
                </div>
              </div>

              {/* Thẻ Hotline Tổng đài */}
              <div className="contactQuickCard">
                <div className="contactCardIconWrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <span className="contactCardLabel">Tổng đài tư vấn & Đặt lịch</span>
                <div className="contactCardMainValue">
                  <a href={`tel:${hotline.replace(/\s+/g, '')}`}>{hotline}</a>
                </div>
                <p className="contactCardSubText">Hỗ trợ thông tin khám bệnh, thủ tục BHYT và lịch phân công bác sĩ.</p>
                <div className="contactCardAction">
                  <a href={`tel:${hotline.replace(/\s+/g, '')}`} className="contactActionLink">
                    Liên hệ tư vấn →
                  </a>
                </div>
              </div>

              {/* Thẻ Hòm thư điện tử */}
              <div className="contactQuickCard">
                <div className="contactCardIconWrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <span className="contactCardLabel">Thư điện tử / Văn thư</span>
                <div className="contactCardMainValue" style={{ fontSize: '16px', wordBreak: 'break-all' }}>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
                <p className="contactCardSubText">Tiếp nhận công văn, liên hệ công tác và hồ sơ hành chính điện tử.</p>
                <div className="contactCardAction">
                  <a href={`mailto:${email}`} className="contactActionLink">
                    Gửi thư điện tử →
                  </a>
                </div>
              </div>

              {/* Thẻ Khung giờ làm việc */}
              <div className="contactQuickCard">
                <div className="contactCardIconWrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <span className="contactCardLabel">Khám bệnh sớm</span>
                <div className="contactCardMainValue" style={{ fontSize: '18px' }}>
                  Từ 06:30 Sáng
                </div>
                <p className="contactCardSubText">Bắt đầu khám sớm tại các khoa chủ lực giúp người bệnh giảm chờ đợi.</p>
                <div className="contactCardAction">
                  <a href="/lich-lam-viec" className="contactActionLink">
                    Chi tiết khung giờ →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 2. KHỐI CHÍNH: 2 CỘT HIỆN ĐẠI (BẢN ĐỒ & THÔNG TIN VIỆN + FORM PHẢN ÁNH) */}
          <div className="contactMainLayoutGrid">
            {/* Cột trái: Thông tin vị trí, bản đồ và các kênh kết nối */}
            <div className="contactLocationColumn">
              <div className="contactLocationCard">
                <div className="contactLocationHeader">
                  <h3>Trụ sở chính {hospitalName}</h3>
                  <p>Quý khách có thể đến trực tiếp viện để được phục vụ hoặc tra cứu bản đồ chỉ đường bên dưới:</p>
                </div>

                <div className="contactDetailList">
                  <div className="contactDetailItem">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div>
                      <strong>Địa chỉ:</strong> <span>{address}</span>
                    </div>
                  </div>

                  <div className="contactDetailItem">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div>
                      <strong>Thời gian khám:</strong> <span>{workingHours}</span>
                    </div>
                  </div>

                  <div className="contactDetailItem">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <div>
                      <strong>Đặt lịch trực tuyến:</strong>{' '}
                      <a href="/dat-lich-kham">Đăng ký phiếu hẹn khám tại đây</a>
                    </div>
                  </div>
                </div>

                {showMap && (
                  <>
                    <div className="contactMapContainer">
                      <iframe
                        src={mapEmbedUrl}
                        title={`Bản đồ chỉ đường đến ${hospitalName}`}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    <div className="contactMapActions">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contactDirectionsBtn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        <span>Mở bản đồ chỉ đường Google Maps</span>
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* Khối mạng xã hội */}
              {showSocial && (facebookUrl || zaloUrl) && (
                <div className="contactSocialCard">
                  <div className="contactSocialText">
                    <h4>Kênh tương tác trực tuyến</h4>
                    <p>Theo dõi các tin tức y tế, khuyến cáo sức khỏe và thông báo mới nhất.</p>
                  </div>
                  <div className="contactSocialLinks">
                    {facebookUrl && (
                      <a href={facebookUrl} target="_blank" rel="noreferrer" className="contactSocialBadge facebook">
                        <span>Facebook</span>
                      </a>
                    )}
                    {zaloUrl && zaloUrl !== '#' && (
                      <a href={zaloUrl} target="_blank" rel="noreferrer" className="contactSocialBadge zalo">
                        <span>Zalo OA</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cột phải: Form tiếp nhận ý kiến phản ánh & đóng góp */}
            {showForm && (
              <div className="contactFormColumn">
                <div className="contactFeedbackCard">
                  <div className="contactFormHeader">
                    <span className="contactFormEyebrow">HỘM THƯ ĐÓNG GÓP</span>
                    <h3>Gửi ý kiến phản ánh & Góp ý</h3>
                    <p>
                      Ý kiến của Quý khách là cơ sở quan trọng giúp bệnh viện liên tục cải tiến chất lượng khám chữa bệnh và thái độ phục vụ.
                    </p>
                  </div>
                  <FeedbackForm />
                </div>
              </div>
            )}
          </div>

          {/* 3. KHỐI KHUNG GIỜ HỖ TRỢ CHUYÊN KHOA */}
          {showHours && (
            <section className="contactSupportHoursSection">
              <div className="supportHoursHead">
                <span className="supportHoursEyebrow">LỊCH TIẾP NHẬN BỆNH NHÂN</span>
                <h3>Thời gian làm việc các bộ phận chuyên môn</h3>
              </div>
              <div className="supportHoursGrid">
                <div className="supportHourCard emergency">
                  <h4 className="supportHourTitle">Khoa Cấp cứu 24/24</h4>
                  <div className="supportHourTime">24 giờ / ngày – 7 ngày / tuần</div>
                  <p className="supportHourNote">Tiếp nhận và xử trí mọi trường hợp cấp cứu khẩn cấp liên tục.</p>
                </div>

                <div className="supportHourCard">
                  <h4 className="supportHourTitle">Khoa Khám bệnh Ngoại trú</h4>
                  <div className="supportHourTime">Sáng 06:30 – 11:30 | Chiều 13:00 – 17:00</div>
                  <p className="supportHourNote">Bắt đầu khám sớm từ 06:30 sáng Thứ 2 đến Thứ 7 hàng tuần.</p>
                </div>

                <div className="supportHourCard">
                  <h4 className="supportHourTitle">Lấy mẫu Xét nghiệm sớm</h4>
                  <div className="supportHourTime">Bắt đầu từ 06:00 Sáng</div>
                  <p className="supportHourNote">Thuận tiện cho người bệnh cần nhịn ăn sáng lấy mẫu xét nghiệm.</p>
                </div>

                <div className="supportHourCard">
                  <h4 className="supportHourTitle">Phòng Tiêm chủng Vắc xin</h4>
                  <div className="supportHourTime">Sáng 07:30 – 11:00 | Chiều 13:30 – 16:30</div>
                  <p className="supportHourNote">Phục vụ tiêm chủng mở rộng và các loại vắc xin dịch vụ.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
