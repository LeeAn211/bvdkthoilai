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

  const appearance = historyData?.appearance || {}
  const style = {
    '--hist-primary': appearance.primaryColor || '#0878D1',
    '--hist-accent': appearance.accentColor || '#16A36A',
  } as CSSProperties

  const bannerImg = mediaUrl(historyData?.bannerImage) || '/banners/lich-su-phat-trien.jpg'
  const eyebrow = historyData?.eyebrow || 'HÀNH TRÌNH PHÁT TRIỂN'
  const title = historyData?.pageTitle || 'Lịch sử hình thành & phát triển Bệnh viện Đa khoa Khu vực Thới Lai'
  const subtitle = historyData?.subtitle || 'Hơn hai thập kỷ tận tụy vì sức khỏe nhân dân – Đổi mới, phát triển và vươn tầm chuyên nghiệp'
  const leadSummary = historyData?.leadSummary || 'Bệnh viện Đa khoa Khu vực Thới Lai tiền thân từ Trung tâm Y tế huyện, trải qua các giai đoạn chuyển mình mạnh mẽ. Từ những ngày đầu cơ sở vật chất đơn sơ, bệnh viện ngày nay đã vươn lên thành cơ sở y tế đa khoa vững mạnh ở cửa ngõ phía Tây thành phố Cần Thơ, trang bị kỹ thuật tiên tiến và quy tụ đội ngũ thầy thuốc giàu y đức.'

  const fallbackMilestones = [
    {
      year: '2004',
      title: 'Thành lập Trung tâm Y tế huyện Ô Môn – Thới Lai',
      tag: 'Khởi đầu',
      description: 'Đáp ứng nhu cầu khám chữa bệnh của nhân dân địa phương sau khi chia tách địa giới hành chính, đặt nền móng đầu tiên cho sự nghiệp y tế khu vực.',
      highlight: false,
    },
    {
      year: '2008',
      title: 'Thành lập Bệnh viện Đa khoa huyện Thới Lai',
      tag: 'Dấu mốc',
      description: 'Chính thức thành lập Bệnh viện Đa khoa huyện Thới Lai theo quyết định của UBND thành phố Cần Thơ, mở rộng quy mô giường bệnh ban đầu và thành lập các khoa lâm sàng cốt lõi.',
      highlight: false,
    },
    {
      year: '2015',
      title: 'Đổi mới cơ sở hạ tầng & Nâng cao năng lực khám chữa bệnh',
      tag: 'Phát triển',
      description: 'Được đầu tư xây dựng các khối nhà chuyên môn mới khang trang, đưa vào vận hành hệ thống xét nghiệm tự động, máy X-quang kỹ thuật số và phòng mổ tiêu chuẩn.',
      highlight: false,
    },
    {
      year: '2020',
      title: 'Phát triển các kỹ thuật chuyên sâu & Chuyển đổi số y tế',
      tag: 'Đột phá',
      description: 'Triển khai thành công nhiều kỹ thuật cao trong sản phụ khoa, ngoại khoa, hồi sức cấp cứu; đẩy mạnh ứng dụng bệnh án điện tử, khám chữa bệnh BHYT bằng CCCD và đặt lịch trực tuyến.',
      highlight: true,
    },
    {
      year: 'Hiện nay & Tương lai',
      title: 'Vươn tầm Bệnh viện Đa khoa Khu vực chất lượng cao',
      tag: 'Vươn tầm',
      description: 'Hướng tới trở thành trung tâm y tế tin cậy hàng đầu cho người dân huyện Thới Lai và các khu vực lân cận, phát triển kỹ thuật cao, dịch vụ tận tâm và môi trường bệnh viện xanh - sạch - đẹp.',
      highlight: true,
    },
  ]

  const milestones = Array.isArray(historyData?.milestones) && historyData.milestones.length > 0
    ? historyData.milestones
    : fallbackMilestones

  const mission = historyData?.coreValues?.missionTitle || 'Chăm sóc sức khỏe nhân dân bằng cả trái tim và trách nhiệm cao nhất.'
  const vision = historyData?.coreValues?.visionTitle || 'Xây dựng Bệnh viện Đa khoa Khu vực hiện đại, chuyên sâu, thân thiện và văn minh.'

  const fallbackValues = [
    { title: 'Tận tâm', description: 'Xem người bệnh như người thân, đặt an toàn và sức khỏe người bệnh lên hàng đầu.' },
    { title: 'Chuyên nghiệp', description: 'Chuẩn hóa quy trình y khoa, không ngừng cập nhật tiến bộ khoa học kỹ thuật.' },
    { title: 'Y đức', description: 'Gìn giữ truyền thống Lương y như từ mẫu, ứng xử chuẩn mực và nhân ái.' },
    { title: 'Đoàn kết', description: 'Gắn kết các thế hệ thầy thuốc, chung sức vì mục tiêu phát triển bền vững.' },
  ]
  const valuesList = Array.isArray(historyData?.coreValues?.valuesList) && historyData.coreValues.valuesList.length > 0
    ? historyData.coreValues.valuesList
    : fallbackValues

  const fallbackAchievements = [
    { title: 'Huân chương & Bằng khen', description: 'Nhiều năm liền nhận Cờ thi đua, Bằng khen của UBND thành phố Cần Thơ và Sở Y tế về thành tích xuất sắc trong công tác chăm sóc sức khỏe nhân dân.' },
    { title: 'Năng lực chuyên môn vững vàng', description: 'Thực hiện thành công hàng ngàn ca phẫu thuật, can thiệp cấp cứu phức tạp mỗi năm, làm chủ nhiều kỹ thuật điều trị tuyến khu vực.' },
    { title: 'Chuyển đổi số & Đổi mới dịch vụ', description: 'Tích hợp thanh toán không tiền mặt, đặt lịch khám trực tuyến Medpro, giảm thiểu thời gian chờ đợi cho người dân.' },
  ]
  const achievements = Array.isArray(historyData?.achievements) && historyData.achievements.length > 0
    ? historyData.achievements
    : fallbackAchievements

  return (
    <>
      <SiteHeader />
      <main className="historyPage" style={style}>
        {/* Hero Section */}
        <section className="historyHero" style={{ backgroundImage: `url("${bannerImg}")` }}>
          <div className="historyHeroOverlay" />
          <div className="container historyHeroContent">
            <span className="historyEyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p className="historyHeroSubtitle">{subtitle}</p>

            <div className="historyQuickStats">
              <div className="historyStatCard">
                <span className="historyStatNumber">20+</span>
                <span className="historyStatLabel">Năm phụng sự nhân dân</span>
              </div>
              <div className="historyStatCard">
                <span className="historyStatNumber">100+</span>
                <span className="historyStatLabel">Y bác sĩ & Nhân viên y tế</span>
              </div>
              <div className="historyStatCard">
                <span className="historyStatNumber">13</span>
                <span className="historyStatLabel">Khoa & Phòng trực thuộc</span>
              </div>
              <div className="historyStatCard">
                <span className="historyStatNumber">95%+</span>
                <span className="historyStatLabel">Độ hài lòng người bệnh</span>
              </div>
            </div>
          </div>
        </section>



        {/* Lead Introduction */}
        <section className="container historyLeadSection">
          <div className="historyLeadCard">
            <p className="historyLeadLead">{leadSummary}</p>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="container historyTimelineSection">
          <div className="historySectionHeader">
            <span className="historySectionKicker">DÒNG THỜI GIAN</span>
            <h2 className="historySectionTitle">Những mốc son lịch sử tiêu biểu</h2>
            <p className="historySectionDesc">
              Hành trình xây dựng, đổi mới và từng bước khẳng định uy tín của Bệnh viện Đa khoa Khu vực Thới Lai qua các thời kỳ.
            </p>
          </div>

          <div className="historyTimeline">
            {milestones.map((item: any, idx: number) => {
              const imgUrl = mediaUrl(item.image)
              return (
                <article
                  className={`timelineItem ${item.highlight ? 'highlight' : ''}`}
                  key={item.id || idx}
                >
                  <div className="timelineMarker" aria-hidden="true" />
                  <div className="timelineCard">
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

        {/* Mission, Vision & Core Values */}
        <section className="container historyCoreValuesSection">
          <div className="historySectionHeader">
            <span className="historySectionKicker">KIM CHỈ NAM HÀNH ĐỘNG</span>
            <h2 className="historySectionTitle">Sứ mệnh, Tầm nhìn & Giá trị cốt lõi</h2>
            <p className="historySectionDesc">
              Những giá trị nền tảng dẫn lối cho toàn thể đội ngũ y bác sĩ, nhân viên bệnh viện không ngừng nỗ lực mỗi ngày.
            </p>
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
                  {idx === 0 ? '♥' : idx === 1 ? '✦' : idx === 2 ? '⚕' : '🤝'}
                </div>
                <h3>{val.title}</h3>
                <p>{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Achievements */}
        <section className="container historyAchievementsSection">
          <div className="historySectionHeader">
            <span className="historySectionKicker">THÀNH QUẢ ĐẠT ĐƯỢC</span>
            <h2 className="historySectionTitle">Thành tựu tiêu biểu</h2>
            <p className="historySectionDesc">
              Ghi nhận những đóng góp bền bỉ vì sự nghiệp bảo vệ, chăm sóc và nâng cao sức khỏe cộng đồng.
            </p>
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

        {/* Optional Rich Text Content if provided */}
        {historyData?.content && (
          <section className="container" style={{ marginTop: '50px' }}>
            <div className="historyLeadCard">
              <RichText data={historyData.content} />
            </div>
          </section>
        )}

        {/* CTA Bottom Box */}
        <section className="container">
          <div className="historyCtaBox">
            <div className="historyCtaCopy">
              <h2>Tiếp tục phát triển vì sức khỏe của bạn và gia đình</h2>
              <p>
                Bệnh viện Đa khoa Khu vực Thới Lai luôn sẵn sàng đồng hành, lắng nghe và phục vụ với sự chuyên nghiệp, tận tình nhất.
              </p>
            </div>
            <div className="historyCtaActions">
              <a href="/so-do-to-chuc" className="historyBtnPrimary">
                Xem Sơ đồ tổ chức →
              </a>
              <a href="/khoa-phong" className="historyBtnSecondary">
                Danh sách Khoa – Phòng
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
