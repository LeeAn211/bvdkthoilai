import type { Metadata } from 'next'
import Link from 'next/link'
import { getCMS, getGlobal } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Khảo sát sự hài lòng người bệnh — Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Cổng tiếp nhận ý kiến khảo sát sự hài lòng của người bệnh nội trú, ngoại trú và thân nhân tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

// Dữ liệu đợt khảo sát mẫu định kỳ khi chưa có chiến dịch trong CMS
const DEFAULT_CAMPAIGNS = [
  {
    id: 'sample-outpatient',
    title: 'Khảo sát Sự hài lòng Người bệnh Khám Ngoại trú',
    slug: 'ngoai-tru',
    desc: 'Đánh giá quy trình tiếp đón, thời gian chờ khám, thái độ ứng xử của nhân viên y tế và điều kiện cơ sở vật chất khu vực phòng khám.',
    period: 'Định kỳ hàng quý',
    icon: '🏥',
    status: 'active',
  },
  {
    id: 'sample-inpatient',
    title: 'Khảo sát Sự hài lòng Người bệnh Điều trị Nội trú',
    slug: 'noi-tru',
    desc: 'Khảo sát ý kiến bệnh nhân trước khi xuất viện về tinh thần chăm sóc, chuyên môn điều trị, vệ sinh buồng bệnh và chế độ dinh dưỡng.',
    period: 'Thường xuyên liên tục',
    icon: '🛏️',
    status: 'active',
  },
  {
    id: 'sample-emergency',
    title: 'Khảo sát Chất lượng Tiếp nhận & Cấp cứu',
    slug: 'cap-cuu',
    desc: 'Ý kiến phản hồi về tốc độ xử trí, khả năng phối hợp cấp cứu và sự hỗ trợ thân nhân bệnh nhân trong tình huống khẩn cấp.',
    period: 'Định kỳ năm 2026',
    icon: '🚑',
    status: 'active',
  },
]

export default async function SurveyHubPage() {
  let siteSettings: any = {}
  let activeCampaigns: any[] = []

  try {
    const [settings, payload] = await Promise.all([
      getGlobal('site-settings' as any).catch(() => ({})),
      getCMS().catch(() => null),
    ])
    siteSettings = settings || {}

    if (payload) {
      const now = new Date().toISOString()
      const res = await payload.find({
        collection: 'survey-campaigns',
        where: {
          and: [
            { active: { equals: true } },
          ],
        },
        limit: 20,
        sort: '-createdAt',
        overrideAccess: true,
      }).catch(() => ({ docs: [] }))

      activeCampaigns = res.docs || []
    }
  } catch {}

  const surveyConf = siteSettings?.surveyPage || {}
  const eyebrow = surveyConf.eyebrow || 'CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT'
  const title = surveyConf.title || 'Khảo sát Ý kiến & Sự hài lòng'
  const description = surveyConf.description || 'Bệnh viện Đa khoa Khu vực Thới Lai trân trọng từng ý kiến đóng góp của người bệnh và thân nhân để không ngừng nâng cao y đức, văn hóa phục vụ và chất lượng điều trị.'

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Khảo sát ý kiến"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="khao-sat" />

          {/* CMS Notice Banner (nếu được bật) */}
          {surveyConf.showNoticeBanner && (
            <div className="patientCareNoticeBanner" style={{ textAlign: surveyConf.noticeAlign || 'left' }}>
              <div className="patientCareNoticeHeader">
                <div className="patientCareNoticeIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="patientCareNoticeTitle">{surveyConf.noticeTitle || 'Thông tin khảo sát'}</h2>
              </div>
              <p className="patientCareNoticeContent">{surveyConf.noticeContent}</p>
            </div>
          )}

          {/* Khối 3 nguyên tắc khảo sát (quản lý từ CMS) */}
          {(() => {
            const DEFAULT_SURVEY_BOXES = [
              {
                icon: '🛡️',
                title: '100% Ẩn danh & Bảo mật',
                desc: 'Mọi thông tin phản hồi của quý vị được mã hóa bảo mật, không ảnh hưởng đến quyền lợi khám chữa bệnh.',
              },
              {
                icon: '📊',
                title: 'Chuẩn Bộ Y tế (83 Tiêu chí)',
                desc: 'Nội dung khảo sát áp dụng theo mẫu chuẩn sự hài lòng người bệnh do Bộ Y tế ban hành định kỳ.',
              },
              {
                icon: '🎯',
                title: 'Cải tiến hành động cụ thể',
                desc: 'Kết quả khảo sát được Ban Giám đốc tiếp nhận hàng tháng để chấn chỉnh và đầu tư cải tiến dịch vụ.',
              },
            ]
            const boxes = Array.isArray(surveyConf.infoBoxes) && surveyConf.infoBoxes.length > 0
              ? surveyConf.infoBoxes.filter((b: any) => b?.enabled !== false)
              : DEFAULT_SURVEY_BOXES

            if (boxes.length === 0) return null

            return (
              <div className="patientCareInfoGrid" style={{ marginBottom: '28px' }}>
                {boxes.map((b: any, idx: number) => (
                  <div className="patientCareInfoBox" key={idx}>
                    <div className="patientCareInfoIcon">{b.icon || '🛡️'}</div>
                    <div>
                      <h3 className="patientCareInfoTitle">{b.title}</h3>
                      <p className="patientCareInfoText" style={{ whiteSpace: 'pre-line' }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}

          {/* Danh sách các chiến dịch khảo sát */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              Các đợt Khảo sát đang mở tiếp nhận
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Chọn mẫu khảo sát phù hợp với diện khám chữa bệnh của quý vị để đóng góp ý kiến:
            </p>
          </div>

          <div className="patientCareGrid">
            {activeCampaigns.length > 0 ? (
              activeCampaigns.map((camp: any) => (
                <div key={camp.id} className="patientCareCard">
                  <div className="patientCareCardTop">
                    <div className="patientCareCardIcon">📝</div>
                    <span className="patientCareCardBadge badgeActive">🟢 Đang mở</span>
                  </div>
                  <h3 className="patientCareCardTitle">{camp.title}</h3>
                  <p className="patientCareCardDesc">{camp.publicNote || 'Khảo sát ý kiến đóng góp nâng cao chất lượng phục vụ người bệnh.'}</p>
                  <div className="patientCareCardMeta">
                    {camp.startAt && (
                      <div className="patientCareCardMetaItem">
                        <span>📅 Bắt đầu: {new Date(camp.startAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    {camp.endAt && (
                      <div className="patientCareCardMetaItem">
                        <span>⏳ Kết thúc: {new Date(camp.endAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    <div className="patientCareCardMetaItem">
                      <span>🔒 Khảo sát hoàn toàn ẩn danh</span>
                    </div>
                  </div>
                  <div className="patientCareCardActions">
                    <Link href={`/khao-sat/${camp.slug}`} className="btnCarePrimary">
                      Tham gia khảo sát →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              DEFAULT_CAMPAIGNS.map((camp) => (
                <div key={camp.id} className="patientCareCard">
                  <div className="patientCareCardTop">
                    <div className="patientCareCardIcon">{camp.icon}</div>
                    <span className="patientCareCardBadge badgePeriodic">{camp.period}</span>
                  </div>
                  <h3 className="patientCareCardTitle">{camp.title}</h3>
                  <p className="patientCareCardDesc">{camp.desc}</p>
                  <div className="patientCareCardMeta">
                    <div className="patientCareCardMetaItem">
                      <span>⏱️ Thời gian: Khoảng 2-3 phút</span>
                    </div>
                    <div className="patientCareCardMetaItem">
                      <span>🛡️ Bảo mật: Hoàn toàn ẩn danh</span>
                    </div>
                    <div className="patientCareCardMetaItem">
                      <span>🏢 Đơn vị tiếp nhận: Ban Giám đốc & Phòng QLCL</span>
                    </div>
                  </div>
                  <div className="patientCareCardActions">
                    <Link href={`/khao-sat/${camp.slug}`} className="btnCarePrimary">
                      Làm khảo sát ngay →
                    </Link>
                    <Link href="/chat-luong-benh-vien" className="btnCareSecondary">
                      Xem kết quả
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA Banner liên kết */}
          <div className="patientCareCtaBanner">
            <div className="patientCareCtaContent">
              <h3>Bạn có ý kiến cần phản ánh trực tiếp hoặc khiếu nại khẩn cấp?</h3>
              <p>Đường dây nóng và hòm thư điện tử của Ban Giám đốc tiếp nhận 24/7 để lắng nghe và hỗ trợ người bệnh kịp thời nhất.</p>
            </div>
            <div className="patientCareCtaActions">
              <Link href="/gop-y" className="btnCtaWhite">
                Gửi phản ánh ngay
              </Link>
              <Link href="/lien-he" className="btnCtaOutline">
                Xem đường dây nóng
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
