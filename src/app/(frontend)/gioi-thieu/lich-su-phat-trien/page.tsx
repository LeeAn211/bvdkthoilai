import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import './history.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Lịch sử phát triển',
  description: 'Quá trình hình thành, phát triển và những cột mốc son đáng nhớ của Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function HospitalHistoryPage() {
  let historyData: any = null
  let siteSettings: any = null

  try {
    const [historyRes, siteRes] = await Promise.all([
      getGlobal('hospital-history'),
      getGlobal('site-settings'),
    ])
    historyData = historyRes
    siteSettings = siteRes
  } catch {}

  const primaryColor = historyData?.primaryColor || '#0878D1'
  const accentColor = historyData?.accentColor || '#16A36A'
  const headingColor = historyData?.headingColor || '#102a43'
  const textColor = historyData?.textColor || '#486581'
  const cardBgColor = historyData?.cardBgColor || '#ffffff'
  const fontFamily = historyData?.fontFamily && historyData.fontFamily !== 'inherit' ? historyData.fontFamily : 'inherit'
  const cardPadding = historyData?.cardPadding ? `${historyData.cardPadding}px` : '24px'

  const style = {
    '--hist-primary': primaryColor,
    '--hist-accent': accentColor,
    '--hist-heading': headingColor,
    '--hist-text': textColor,
    '--hist-card-bg': cardBgColor,
    '--hist-card-padding': cardPadding,
    fontFamily: fontFamily,
  } as CSSProperties

  // Toggles (Mặc định là true nếu không đặt là false)
  const showHero = historyData?.showHero !== false
  const showQuickStats = historyData?.showQuickStats !== false
  const showLead = historyData?.showLead !== false
  const showTimeline = historyData?.showTimeline !== false
  const showCoreValues = historyData?.showCoreValues !== false
  const showJourney = historyData?.showJourney !== false
  const showAchievements = historyData?.showAchievements !== false
  const showContent = historyData?.showContent !== false
  const showCta = historyData?.showCta !== false

  // Banner & Hero
  const bannerImg = mediaUrl(historyData?.bannerImage) || '/banners/lich-su-phat-trien.jpg'
  const eyebrow = historyData?.eyebrow || 'LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN'
  const title = historyData?.pageTitle || 'Lịch sử hình thành & phát triển Bệnh viện Đa khoa Khu vực Thới Lai'
  const subtitle = historyData?.subtitle || 'Hơn hai thập kỷ tận tụy vì sức khỏe nhân dân – Đổi mới, phát triển và vươn tầm chuyên nghiệp'
  const heroMinHeight = historyData?.heroMinHeight ? `${historyData.heroMinHeight}px` : '380px'
  const heroAlign = historyData?.heroAlign || 'left'

  // Quick stats
  const fallbackQuickStats = [
    { number: '2009', label: 'Khởi nguồn nền móng' },
    { number: '100+', label: 'Giường bệnh thiết kế' },
    { number: '100%', label: 'Bệnh án điện tử' },
    { number: 'Khu vực', label: 'Mô hình Đa khoa hiện đại' },
  ]
  const quickStats = Array.isArray(historyData?.quickStats) && historyData.quickStats.length > 0
    ? historyData.quickStats
    : fallbackQuickStats

  // Lead Section
  const leadSummary = historyData?.leadSummary || 'Bệnh viện Đa khoa khu vực Thới Lai có quá trình hình thành và phát triển gắn liền với sự phát triển của huyện Thới Lai trước đây và quá trình kiện toàn hệ thống y tế thành phố Cần Thơ. Từ những ngày đầu còn nhiều khó khăn về cơ sở vật chất, trang thiết bị và nhân lực, qua nhiều giai đoạn tổ chức và phát triển, đơn vị từng bước nâng cao năng lực chuyên môn, đầu tư cơ sở vật chất, ứng dụng công nghệ thông tin và mở rộng các dịch vụ kỹ thuật, đáp ứng ngày càng tốt hơn nhu cầu khám bệnh, chữa bệnh và chăm sóc sức khỏe của Nhân dân.'
  const leadAlign = historyData?.leadAlign || 'left'
  const leadFontSize = historyData?.leadFontSize ? `${historyData.leadFontSize}px` : '18px'

  // Timeline
  const timelineKicker = historyData?.timelineKicker || 'DÒNG THỜI GIAN'
  const timelineTitle = historyData?.timelineTitle || 'Những dấu mốc phát triển tiêu biểu'
  const timelineDesc = historyData?.timelineDesc || 'Hành trình xây dựng và phát triển của Bệnh viện Đa khoa khu vực Thới Lai qua các thời kỳ.'

  const fallbackMilestones = [
    {
      year: '2009–2010',
      title: 'Bệnh viện Đa khoa huyện Thới Lai',
      tag: 'Hình thành',
      description: 'Sau khi huyện Thới Lai được thành lập và chính thức đi vào hoạt động, hệ thống y tế trên địa bàn được từng bước kiện toàn. Bệnh viện Đa khoa huyện Thới Lai được hình thành nhằm đáp ứng nhu cầu khám bệnh, chữa bệnh của người dân trên địa bàn. Các nguồn tư liệu hiện có ghi nhận đơn vị bắt đầu hoạt động về mặt đăng ký từ năm 2009; Báo Cần Thơ ghi nhận Bệnh viện Đa khoa huyện Thới Lai được thành lập vào năm 2010. Đây là nền móng quan trọng cho quá trình hình thành và phát triển của Bệnh viện Đa khoa khu vực Thới Lai ngày nay.',
      highlight: false,
      textAlign: 'left',
    },
    {
      year: '2011',
      title: 'Đưa cơ sở Bệnh viện Đa khoa huyện Thới Lai vào sử dụng',
      tag: 'Phát triển cơ sở vật chất',
      description: 'Đầu năm 2011, giai đoạn 1 của công trình Bệnh viện Đa khoa huyện Thới Lai được đưa vào sử dụng. Bệnh viện được đầu tư với quy mô thiết kế khoảng 100 giường bệnh, tổng kinh phí xây dựng trên 100 tỷ đồng. Việc đưa công trình vào hoạt động tạo bước chuyển quan trọng về cơ sở vật chất và điều kiện khám, chữa bệnh cho người dân Thới Lai và khu vực lân cận.',
      highlight: false,
      textAlign: 'left',
    },
    {
      year: '2017',
      title: 'Thành lập Trung tâm Y tế huyện Thới Lai',
      tag: 'Kiện toàn hệ thống y tế',
      description: 'Ngày 01 tháng 3 năm 2017, Sở Y tế thành phố Cần Thơ công bố quyết định thành lập Trung tâm Y tế huyện Thới Lai, trực thuộc Sở Y tế thành phố Cần Thơ. Trung tâm được thành lập trên cơ sở sáp nhập Bệnh viện Đa khoa huyện Thới Lai và Trung tâm Y tế dự phòng huyện Thới Lai. Việc tổ chức lại giúp thống nhất nguồn lực y tế tuyến huyện, kết hợp công tác khám bệnh, chữa bệnh với y tế dự phòng, phòng chống dịch bệnh và chăm sóc sức khỏe cộng đồng.',
      highlight: false,
      textAlign: 'left',
    },
    {
      year: '2025',
      title: 'Trung tâm Y tế khu vực Thới Lai',
      tag: 'Chuyển sang mô hình y tế khu vực',
      description: 'Từ ngày 01 tháng 7 năm 2025, thực hiện chủ trương sắp xếp hệ thống đơn vị sự nghiệp y tế của thành phố Cần Thơ, Trung tâm Y tế khu vực Thới Lai được thành lập trên cơ sở sắp xếp Trung tâm Y tế huyện Thới Lai và Trung tâm Y tế huyện Cờ Đỏ. Đây là giai đoạn đơn vị tiếp tục mở rộng phạm vi phục vụ, nâng cao năng lực chuyên môn và đẩy mạnh chuyển đổi số trong hoạt động khám bệnh, chữa bệnh. Tháng 9 năm 2025, Trung tâm chính thức ban hành quyết định sử dụng và lưu trữ hồ sơ bệnh án điện tử, lưu trữ và truyền tải hình ảnh y tế thay cho in phim và lưu trữ thông tin xét nghiệm điện tử, đánh dấu một bước tiến quan trọng trong quá trình chuyển đổi số y tế.',
      highlight: true,
      textAlign: 'left',
    },
    {
      year: '2026',
      title: 'Thành lập Bệnh viện Đa khoa khu vực Thới Lai',
      tag: 'Dấu mốc mới',
      description: 'Thực hiện chủ trương tổ chức lại hệ thống y tế thành phố Cần Thơ, kể từ ngày 31 tháng 8 năm 2026, Trung tâm Y tế khu vực Thới Lai được tổ chức lại thành BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI. Việc chuyển đổi sang mô hình bệnh viện đa khoa khu vực giúp đơn vị tập trung nguồn lực cho công tác khám bệnh, chữa bệnh, cấp cứu, điều trị nội trú, phục hồi chức năng và phát triển các kỹ thuật chuyên môn. Bệnh viện tiếp tục kế thừa cơ sở vật chất, đội ngũ nhân lực, kinh nghiệm chuyên môn và truyền thống của các giai đoạn trước, đồng thời từng bước nâng cao chất lượng dịch vụ y tế, hướng đến sự hài lòng và an toàn của người bệnh.',
      highlight: true,
      textAlign: 'left',
    },
    {
      year: 'Hiện nay & Tương lai',
      title: 'Hướng đến bệnh viện đa khoa khu vực hiện đại, chất lượng',
      tag: 'Phát triển bền vững',
      description: 'Bệnh viện Đa khoa khu vực Thới Lai tiếp tục phát triển chuyên môn, tăng cường ứng dụng khoa học kỹ thuật và công nghệ thông tin, cải tiến chất lượng bệnh viện và xây dựng môi trường khám chữa bệnh an toàn, thân thiện. Mục tiêu của Bệnh viện là từng bước đáp ứng ngày càng tốt hơn nhu cầu chăm sóc sức khỏe của Nhân dân trên địa bàn Thới Lai và các khu vực lân cận.',
      highlight: true,
      textAlign: 'left',
    },
  ]

  const milestones = Array.isArray(historyData?.milestones) && historyData.milestones.length > 0
    ? historyData.milestones
    : fallbackMilestones

  // Core values & Mission/Vision
  const coreValuesKicker = historyData?.coreValuesKicker || 'KIM CHỈ NAM HÀNH ĐỘNG'
  const coreValuesTitle = historyData?.coreValuesTitle || 'Sứ mệnh – Tầm nhìn – Giá trị cốt lõi'
  const coreValuesDesc = historyData?.coreValuesDesc || 'Những định hướng nền tảng để tập thể viên chức, người lao động Bệnh viện Đa khoa khu vực Thới Lai không ngừng nâng cao chất lượng phục vụ người bệnh.'
  const mission = historyData?.coreValues?.missionTitle || 'Cung cấp dịch vụ khám bệnh, chữa bệnh an toàn, chất lượng và tận tâm; góp phần bảo vệ, chăm sóc và nâng cao sức khỏe Nhân dân.'
  const vision = historyData?.coreValues?.visionTitle || 'Xây dựng Bệnh viện Đa khoa khu vực Thới Lai từng bước hiện đại, chuyên nghiệp, thân thiện; phát triển chuyên môn kỹ thuật phù hợp với nhu cầu chăm sóc sức khỏe của người dân trong khu vực.'

  const fallbackValues = [
    { iconType: 'heart', title: 'TẬN TÂM', description: 'Lấy người bệnh làm trung tâm; luôn quan tâm đến an toàn, sức khỏe và quyền lợi của người bệnh.' },
    { iconType: 'star', title: 'CHUYÊN NGHIỆP', description: 'Chuẩn hóa quy trình chuyên môn, nâng cao năng lực đội ngũ và không ngừng cập nhật tiến bộ khoa học kỹ thuật.' },
    { iconType: 'caduceus', title: 'Y ĐỨC', description: 'Giữ gìn phẩm chất người thầy thuốc, thực hiện tốt quy tắc ứng xử, phục vụ người bệnh bằng tinh thần trách nhiệm và nhân ái.' },
    { iconType: 'handshake', title: 'ĐOÀN KẾT', description: 'Phát huy tinh thần phối hợp, chia sẻ và gắn kết giữa các khoa, phòng và các thế hệ viên chức, người lao động vì sự phát triển chung của Bệnh viện.' },
  ]
  const valuesList = Array.isArray(historyData?.coreValues?.valuesList) && historyData.coreValues.valuesList.length > 0
    ? historyData.coreValues.valuesList
    : fallbackValues

  const renderValueIcon = (val: any, idx: number) => {
    if (val.customIcon) {
      const iconUrl = mediaUrl(val.customIcon)
      if (iconUrl) return <img src={iconUrl} alt={val.title} className="coreValueCustomIcon" />
    }
    const type = val.iconType || (idx === 0 ? 'heart' : idx === 1 ? 'star' : idx === 2 ? 'caduceus' : 'handshake')
    switch (type) {
      case 'heart': return '♥'
      case 'star': return '✦'
      case 'caduceus': return '⚕'
      case 'handshake': return '🤝'
      case 'shield': return '🛡️'
      case 'lightbulb': return '💡'
      default: return '♥'
    }
  }

  // Journey
  const journeyKicker = historyData?.journeyKicker || 'HÀNH TRÌNH TIẾP NỐI'
  const journeyTitle = historyData?.journeyTitle || 'Kế thừa và Vươn tầm phát triển'
  const journeyDesc = historyData?.journeyDesc || 'Trải qua nhiều giai đoạn tổ chức và phát triển, mỗi giai đoạn đều đánh dấu một bước chuyển quan trọng trong quá trình xây dựng hệ thống y tế phục vụ Nhân dân.'
  const fallbackJourneySteps = [
    { stepNumber: 'Giai đoạn 1', title: 'Bệnh viện Đa khoa huyện Thới Lai', isHighlight: false },
    { stepNumber: 'Giai đoạn 2', title: 'Trung tâm Y tế huyện Thới Lai', isHighlight: false },
    { stepNumber: 'Giai đoạn 3', title: 'Trung tâm Y tế khu vực Thới Lai', isHighlight: false },
    { stepNumber: 'Hiện tại & Tương lai', title: 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI', isHighlight: true },
  ]
  const journeySteps = Array.isArray(historyData?.journeySteps) && historyData.journeySteps.length > 0
    ? historyData.journeySteps
    : fallbackJourneySteps
  const journeyBottomText = historyData?.journeyBottomText || 'Bệnh viện Đa khoa khu vực Thới Lai hôm nay tiếp tục kế thừa những giá trị đã được xây dựng qua nhiều thế hệ cán bộ, viên chức và người lao động; đồng thời không ngừng đổi mới, nâng cao chất lượng chuyên môn, ứng dụng công nghệ và cải tiến phong cách phục vụ, hướng đến mục tiêu chăm sóc sức khỏe người dân ngày càng tốt hơn.'

  // Achievements
  const achievementsKicker = historyData?.achievementsKicker || 'THÀNH QUẢ ĐẠT ĐƯỢC'
  const achievementsTitle = historyData?.achievementsTitle || 'Thành tựu tiêu biểu'
  const achievementsDesc = historyData?.achievementsDesc || 'Ghi nhận những đóng góp bền bỉ vì sự nghiệp bảo vệ, chăm sóc và nâng cao sức khỏe cộng đồng.'
  const fallbackAchievements = [
    { title: 'Huân chương & Bằng khen', description: 'Nhiều năm liền nhận Cờ thi đua, Bằng khen của UBND thành phố Cần Thơ và Sở Y tế về thành tích xuất sắc trong công tác chăm sóc sức khỏe nhân dân.' },
    { title: 'Năng lực chuyên môn vững vàng', description: 'Thực hiện thành công hàng ngàn ca phẫu thuật, can thiệp cấp cứu phức tạp mỗi năm, làm chủ nhiều kỹ thuật điều trị tuyến khu vực.' },
    { title: 'Chuyển đổi số & Đổi mới dịch vụ', description: 'Tích hợp hồ sơ bệnh án điện tử, lưu trữ truyền tải hình ảnh số và đặt lịch trực tuyến, giảm thiểu tối đa thời gian chờ đợi cho người dân.' },
  ]
  const achievements = Array.isArray(historyData?.achievements) && historyData.achievements.length > 0
    ? historyData.achievements
    : fallbackAchievements

  // CTA
  const ctaTitle = historyData?.ctaTitle || 'Tiếp tục phát triển vì sức khỏe của bạn và gia đình'
  const ctaDesc = historyData?.ctaDesc || 'Bệnh viện Đa khoa Khu vực Thới Lai luôn sẵn sàng đồng hành, lắng nghe và phục vụ với sự chuyên nghiệp, tận tình nhất.'
  const ctaBtnPrimaryText = historyData?.ctaBtnPrimaryText || 'Xem Sơ đồ tổ chức →'
  const ctaBtnPrimaryUrl = historyData?.ctaBtnPrimaryUrl || '/so-do-to-chuc'
  const ctaBtnSecondaryText = historyData?.ctaBtnSecondaryText || 'Danh sách Khoa – Phòng'
  const ctaBtnSecondaryUrl = historyData?.ctaBtnSecondaryUrl || '/khoa-phong'

  return (
    <>
      <SiteHeader />
      <main className="historyPage" style={style}>
        {/* Hero Section */}
        {showHero && (
          <section
            className="historyHero"
            style={{
              backgroundImage: `url("${bannerImg}")`,
              minHeight: heroMinHeight,
              textAlign: heroAlign as any,
            }}
          >
            <div className="historyHeroOverlay" />
            <div className={`container historyHeroContent ${heroAlign === 'center' ? 'heroCenter' : heroAlign === 'right' ? 'heroRight' : ''}`}>
              <span className="historyEyebrow">{eyebrow}</span>
              <h1>{title}</h1>
              <p className="historyHeroSubtitle">{subtitle}</p>

              {showQuickStats && (
                <div className="historyQuickStats">
                  {quickStats.map((st: any, idx: number) => (
                    <div className="historyStatCard" key={idx}>
                      <span className="historyStatNumber">{st.number}</span>
                      <span className="historyStatLabel">{st.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Lead Introduction */}
        {showLead && (
          <section className="container historyLeadSection">
            <div className="historyLeadCard">
              <p
                className="historyLeadLead"
                style={{
                  textAlign: leadAlign as any,
                  fontSize: leadFontSize,
                }}
              >
                {leadSummary}
              </p>
            </div>
          </section>
        )}

        {/* Timeline Section */}
        {showTimeline && (
          <section className="container historyTimelineSection">
            <div className="historySectionHeader">
              <span className="historySectionKicker">{timelineKicker}</span>
              <h2 className="historySectionTitle">{timelineTitle}</h2>
              {timelineDesc && <p className="historySectionDesc">{timelineDesc}</p>}
            </div>

            <div className="historyTimeline">
              {milestones.map((item: any, idx: number) => {
                const imgUrl = mediaUrl(item.image)
                const textAlign = item.textAlign || 'left'
                return (
                  <article
                    className={`timelineItem ${item.highlight ? 'highlight' : ''}`}
                    key={item.id || idx}
                  >
                    <div className="timelineMarker" aria-hidden="true" />
                    <div className="timelineCard" style={{ textAlign: textAlign as any }}>
                      <div className="timelineHeader">
                        <span className="timelineYear">{item.year}</span>
                        {item.tag && <span className="timelineTag">{item.tag}</span>}
                      </div>
                      <h3 className="timelineTitle">{item.title}</h3>
                      <p className="timelineDesc">{item.description}</p>
                      {imgUrl && (
                        <div className="timelineImage">
                          <img src={imgUrl} alt={item.title} loading="lazy" />
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* Mission, Vision & Core Values */}
        {showCoreValues && (
          <section className="container historyCoreValuesSection">
            <div className="historySectionHeader">
              <span className="historySectionKicker">{coreValuesKicker}</span>
              <h2 className="historySectionTitle">{coreValuesTitle}</h2>
              {coreValuesDesc && <p className="historySectionDesc">{coreValuesDesc}</p>}
            </div>

            <div className="missionVisionWrap">
              <div className="missionCard">
                <span>SỨ MỆNH</span>
                <h3>{mission}</h3>
              </div>
              <div className="visionCard">
                <span>TẦM NHÌN</span>
                <h3>{vision}</h3>
              </div>
            </div>

            <div className="coreValuesGrid">
              {valuesList.map((val: any, idx: number) => (
                <div className="coreValueCard" key={idx}>
                  <div className="coreValueIcon">
                    {renderValueIcon(val, idx)}
                  </div>
                  <h3>{val.title}</h3>
                  <p>{val.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Journey Continuity Section: HÀNH TRÌNH TIẾP NỐI */}
        {showJourney && (
          <section className="container historyJourneySection">
            <div className="historySectionHeader">
              <span className="historySectionKicker">{journeyKicker}</span>
              <h2 className="historySectionTitle">{journeyTitle}</h2>
              {journeyDesc && <p className="historySectionDesc">{journeyDesc}</p>}
            </div>

            <div className="journeyStepsFlow">
              {journeySteps.map((step: any, idx: number) => (
                <div key={idx} className="journeyStepWrapper">
                  <div className={`journeyStepCard ${step.isHighlight ? 'journeyStepActive' : ''}`}>
                    <span className="journeyStepNum">{step.stepNumber}</span>
                    <h4>{step.title}</h4>
                  </div>
                  {idx < journeySteps.length - 1 && (
                    <div className="journeyArrow" aria-hidden="true">→</div>
                  )}
                </div>
              ))}
            </div>

            {journeyBottomText && (
              <div className="historyLeadCard journeyTextCard" style={{ marginTop: '24px' }}>
                <p className="historyLeadLead">{journeyBottomText}</p>
              </div>
            )}
          </section>
        )}

        {/* Key Achievements */}
        {showAchievements && (
          <section className="container historyAchievementsSection">
            <div className="historySectionHeader">
              <span className="historySectionKicker">{achievementsKicker}</span>
              <h2 className="historySectionTitle">{achievementsTitle}</h2>
              {achievementsDesc && <p className="historySectionDesc">{achievementsDesc}</p>}
            </div>

            <div className="achievementsGrid">
              {achievements.map((ach: any, idx: number) => {
                const achImg = mediaUrl(ach.image)
                return (
                  <div className="achievementCard" key={idx}>
                    {achImg ? (
                      <img className="achievementImage" src={achImg} alt={ach.title} loading="lazy" />
                    ) : (
                      <div className="achievementImage" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', display: 'grid', placeItems: 'center', fontSize: '32px' }}>
                        🏆
                      </div>
                    )}
                    <div className="achievementBody">
                      <h3>{ach.title}</h3>
                      <p>{ach.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Optional Rich Text Content if provided and toggled */}
        {showContent && historyData?.content && (
          <section className="container" style={{ marginTop: '50px' }}>
            <div className="historyLeadCard">
              <RichText data={historyData.content} />
            </div>
          </section>
        )}

        {/* CTA Bottom Box */}
        {showCta && (
          <section className="container">
            <div className="historyCtaBox">
              <div className="historyCtaCopy">
                <h2>{ctaTitle}</h2>
                <p>{ctaDesc}</p>
              </div>
              <div className="historyCtaActions">
                {ctaBtnPrimaryText && (
                  <a href={ctaBtnPrimaryUrl} className="historyBtnPrimary">
                    {ctaBtnPrimaryText}
                  </a>
                )}
                {ctaBtnSecondaryText && (
                  <a href={ctaBtnSecondaryUrl} className="historyBtnSecondary">
                    {ctaBtnSecondaryText}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
