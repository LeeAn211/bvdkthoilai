import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import './gioi-thieu.css'

export const revalidate = 120

export async function generateMetadata(): Promise<Metadata> {
  const aboutData: any = await getGlobal('about-page').catch(() => null)
  return {
    title: aboutData?.seo?.title || 'Giới thiệu Bệnh viện Đa khoa Khu vực Thới Lai',
    description: aboutData?.seo?.description || 'Tổng quan về Bệnh viện Đa khoa Khu vực Thới Lai: quy mô, chức năng nhiệm vụ, cơ sở vật chất và cam kết chất lượng phục vụ.',
  }
}

// Bộ icon SVG y tế to, sắc nét, hiện đại
function HeartIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l.96-.94.96.94c.87.78 2.18.75 3-.07a2.17 2.17 0 0 0 0-3.08L12 5Z" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function HandshakeIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 0 0 1.42 0l4.24-4.24a1 1 0 0 0 0-1.42l-2.12-2.12a1 1 0 0 0-1.42 0L11 15.4" />
      <path d="m18 10 3.5-3.5a1 1 0 0 0 0-1.42l-1.58-1.58a1 1 0 0 0-1.42 0L15 7" />
      <path d="m7 21 2-2" />
      <path d="m2 16 4.5-4.5" />
      <path d="M14 4.5 12 2.5a1 1 0 0 0-1.42 0L6.34 6.74a1 1 0 0 0 0 1.42L9 10.8" />
      <path d="M9.8 14.2 8.4 12.8" />
    </svg>
  )
}

function CpuIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" />
      <path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" /><path d="M12 16v3" /><path d="M12 5v3" />
    </svg>
  )
}

function FlaskIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.31M14 2v7.31" />
      <path d="M8.5 2h7" />
      <path d="M14 9.3 18.9 18a3 3 0 0 1-2.6 4.5H7.7A3 3 0 0 1 5.1 18L10 9.3" />
      <path d="M7 16h10" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v12" /><path d="M6 12h12" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

function SirenIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
      <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
      <path d="M21 12h1" /><path d="M18.5 4.5 19 4" /><path d="M2 12h1" /><path d="M5 4l.5.5" />
    </svg>
  )
}

const coreSVGs: ReactNode[] = [
  <HeartIcon key="heart" />,
  <ShieldCheckIcon key="shield" />,
  <HandshakeIcon key="handshake" />,
  <CpuIcon key="cpu" />,
]

const facSVGs: ReactNode[] = [
  <ScanIcon key="scan" />,
  <FlaskIcon key="flask" />,
  <CrossIcon key="cross" />,
  <SirenIcon key="siren" />,
]

export default async function AboutHospitalPage() {
  let siteSettings: any = null
  let aboutData: any = null

  try {
    const [siteRes, aboutRes] = await Promise.all([
      getGlobal('site-settings'),
      getGlobal('about-page').catch(() => null),
    ])
    siteSettings = siteRes
    aboutData = aboutRes
  } catch {}

  const hospitalName = siteSettings?.hospitalName || 'Bệnh viện Đa khoa Khu vực Thới Lai'

  // Hero config
  const hero = aboutData?.hero || {}
  const appearance = aboutData?.appearance || {}
  const eyebrow = hero.eyebrow || 'TỔNG QUAN BỆNH VIỆN'
  const tagline = hero.tagline || (siteSettings?.headerSlogan || 'Điều trị bằng trái tim – Chăm sóc bằng tấm lòng')
  const intro = hero.intro || 'Bệnh viện Đa khoa Khu vực Thới Lai là cơ sở y tế đa khoa công lập trực thuộc Sở Y tế thành phố Cần Thơ, giữ vai trò khám chữa bệnh trọng điểm tại cửa ngõ phía Tây, không ngừng đổi mới chất lượng chuyên môn và phong cách phục vụ.'
  
  const bannerImg = mediaUrl(hero.bannerImage) || '/banners/gioi-thieu-chung.jpg'

  // Stats
  const statsFallback = [
    { number: 'Hạng II', label: 'Xếp hạng bệnh viện', icon: '🎖️' },
    { number: '200+', label: 'Giường bệnh kế hoạch', icon: '🛏️' },
    { number: '100+', label: 'Cán bộ, viên chức y tế', icon: '👨‍⚕️' },
    { number: '96%+', label: 'Hài lòng người bệnh', icon: '⭐' },
  ]
  const stats = Array.isArray(aboutData?.stats) && aboutData.stats.length > 0 ? aboutData.stats : statsFallback

  // Core Principles
  const corePrinciples = aboutData?.corePrinciples || {}
  const coreTitle = corePrinciples.title || 'Giá trị cốt lõi & Văn hóa phục vụ'
  const coreSubtitle = corePrinciples.subtitle || 'Lấy người bệnh làm trung tâm trong mọi quyết định chuyên môn và quy trình chăm sóc y tế.'
  const coreItemsFallback = [
    { title: 'Y đức & Tận tâm', desc: 'Thực hiện lời dạy Lương y như từ mẫu, lắng nghe, đồng cảm và chia sẻ cùng người bệnh và thân nhân.' },
    { title: 'Chuyên môn & An toàn', desc: 'Tuân thủ nghiêm ngặt phác đồ điều trị, quy chuẩn kiểm soát nhiễm khuẩn và bảo đảm an toàn người bệnh tuyệt đối.' },
    { title: 'Chuyên nghiệp & Văn minh', desc: 'Giao tiếp hòa nhã, giải quyết thủ tục nhanh chóng, môi trường bệnh viện xanh – sạch – đẹp – thân thiện.' },
    { title: 'Đổi mới & Chuyển đổi số', desc: 'Đẩy mạnh ứng dụng công nghệ thông tin, thanh toán không tiền mặt, đặt lịch khám trước và số hóa hồ sơ y tế.' },
  ]
  const coreItems = Array.isArray(corePrinciples.items) && corePrinciples.items.length > 0 ? corePrinciples.items : coreItemsFallback

  // Facilities
  const facilities = aboutData?.facilities || {}
  const facTitle = facilities.title || 'Cơ sở hạ tầng & Trang thiết bị y tế'
  const facDesc = facilities.description || 'Bệnh viện được đầu tư đồng bộ hệ thống máy móc cận lâm sàng hiện đại, phòng mổ đạt chuẩn vô khuẩn và khu điều trị nội trú khang trang.'
  const facItemsFallback = [
    { title: 'Chẩn đoán hình ảnh kỹ thuật số', desc: 'Hệ thống chụp X-quang kỹ thuật số hiện đại, siêu âm màu Doppler 4D hỗ trợ chẩn đoán nhanh, chính xác.' },
    { title: 'Xét nghiệm tự động hoàn toàn', desc: 'Hệ thống sinh hóa, huyết học, miễn dịch tự động đạt chuẩn nội kiểm, ngoại kiểm chất lượng nghiêm ngặt.' },
    { title: 'Phòng mổ vô trùng & Gây mê hồi sức', desc: 'Khu phẫu thuật hiện đại với hệ thống khí sạch áp lực dương, đảm bảo an toàn tối đa cho các ca phẫu thuật.' },
    { title: 'Khoa Cấp cứu & Điều trị tích cực', desc: 'Trực cấp cứu 24/7 với đầy đủ máy thở, monitor theo dõi đa thông số, máy sốc điện và xe cứu thương chuyên dụng.' },
  ]
  const facItems = Array.isArray(facilities.items) && facilities.items.length > 0 ? facilities.items : facItemsFallback

  // Commitment
  const commitment = aboutData?.commitment || {}
  const commitTitle = commitment.title || 'Cam kết chất lượng phục vụ nhân dân'
  const commitQuote = commitment.quote || 'Mỗi cán bộ y tế Bệnh viện Đa khoa Khu vực Thới Lai luôn nêu cao tinh thần trách nhiệm, không ngừng học hỏi nâng cao tay nghề, coi sức khỏe và sự hài lòng của người bệnh là thước đo cao nhất cho hiệu quả công tác.'
  const commitAuthor = commitment.author || 'Ban Giám đốc Bệnh viện Đa khoa Khu vực Thới Lai'

  const cssVars = {
    '--about-primary': appearance.primaryColor || '#0878D1',
    '--about-accent': appearance.accentColor || '#16A36A',
  } as CSSProperties

  return (
    <>
      <SiteHeader />
      <main className="aboutPage" style={cssVars}>
        {/* ── BANNER HERO ─────────────────────────────────── */}
        <section className="aboutHero" style={{ backgroundImage: `url("${bannerImg}")` }}>
          <div className="aboutHeroOverlay" />
          <div className="container aboutHeroInner">
            <span className="aboutBadge">{eyebrow}</span>
            <h1>{hospitalName}</h1>
            <p className="aboutSlogan">"{tagline}"</p>
            <p className="aboutIntro">{intro}</p>

            {/* Quy mô & Chỉ số hoạt động */}
            <div className="aboutHeroStats">
              {stats.map((s: any, i: number) => (
                <div className="aboutHeroStat" key={i}>
                  {s.icon && <span className="aboutHeroStatIcon">{s.icon}</span>}
                  <span className="aboutHeroStatNum">{s.number}</span>
                  <span className="aboutHeroStatLabel">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUB-NAV ĐIỀU HƯỚNG CÁC TRANG LIÊN QUAN ─────── */}
        <nav className="aboutSubNav" aria-label="Điều hướng chuyên mục Giới thiệu">
          <div className="container aboutSubNavInner">
            <a href="/gioi-thieu" className="aboutNavLink active">Giới thiệu chung</a>
            <a href="/gioi-thieu/lich-su-phat-trien" className="aboutNavLink">Lịch sử phát triển</a>
            <a href="/so-do-to-chuc" className="aboutNavLink">Sơ đồ tổ chức</a>
            <a href="/khoa-phong" className="aboutNavLink">Khoa – Phòng</a>
            <a href="/bac-si" className="aboutNavLink">Đội ngũ Bác sĩ</a>
          </div>
        </nav>

        {/* ── GIÁ TRỊ CỐT LÕI & VĂN HÓA PHỤC VỤ (MODERN ICONS CANH GIỮA) ─────────── */}
        <section className="container aboutSection">
          <div className="aboutSectionHead">
            <span className="aboutKicker">NGUYÊN TẮC HOẠT ĐỘNG</span>
            <h2>{coreTitle}</h2>
            <p>{coreSubtitle}</p>
          </div>

          <div className="aboutCoreGrid">
            {coreItems.map((item: any, idx: number) => {
              const svgIcon = coreSVGs[idx % coreSVGs.length]
              const colorClass = `coreTheme${idx % 4}`
              return (
                <div className={`aboutCoreCard ${colorClass}`} key={idx}>
                  <div className="aboutCoreIconBox">
                    {svgIcon}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="aboutCoreCardGlow" />
                </div>
              )
            })}
          </div>
        </section>

        {/* ── CƠ SỞ VẬT CHẤT & NĂNG LỰC KỸ THUẬT (MODERN CARDS CANH GIỮA) ───────── */}
        <section className="aboutFacSection">
          <div className="container">
            <div className="aboutSectionHead">
              <span className="aboutKicker">NĂNG LỰC ĐIỀU TRỊ</span>
              <h2>{facTitle}</h2>
              <p>{facDesc}</p>
            </div>

            <div className="aboutFacGrid">
              {facItems.map((f: any, idx: number) => {
                const facIcon = facSVGs[idx % facSVGs.length]
                return (
                  <div className="aboutFacCard" key={idx}>
                    <div className="aboutFacTopRow">
                      <div className="aboutFacIconBox">
                        {facIcon}
                      </div>
                      <span className="aboutFacIndex">0{idx + 1}</span>
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CAM KẾT CHẤT LƯỢNG PHỤC VỤ (NỔI BẬT KHÔNG TIỆP VỚI FOOTER) ──────── */}
        <section className="container aboutCommitSection">
          <div className="aboutCommitCard">
            <div className="aboutCommitIconBox">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" />
              </svg>
            </div>
            <h2>{commitTitle}</h2>
            <blockquote>"{commitQuote}"</blockquote>
            <p className="aboutCommitAuthor">— {commitAuthor}</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
