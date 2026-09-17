import type { Metadata } from 'next'
import Link from 'next/link'
import { getCMS, getGlobal } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Biểu mẫu điện tử & Đăng ký trực tuyến — Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Danh mục các biểu mẫu y tế, phiếu đăng ký thông tin trực tuyến và khai báo y tế điện tử dành cho người bệnh và thân nhân.',
}

const DEFAULT_FORMS = [
  {
    id: 'form-kham-benh',
    title: 'Phiếu Đăng ký Thăm khám Ban đầu',
    slug: 'dang-ky-kham',
    desc: 'Cung cấp trước thông tin hành chính, tiền sử dị ứng thuốc và lý do khám giúp rút ngắn thời gian làm thủ tục tại quầy tiếp đón.',
    fieldsCount: '6 trường thông tin',
    icon: '📋',
    type: 'Tiếp đón',
  },
  {
    id: 'form-sao-benh-an',
    title: 'Đơn Yêu cầu Trích sao Bệnh án',
    slug: 'trich-sao-benh-an',
    desc: 'Thủ tục đăng ký cấp giấy sao lục bệnh án phục vụ chuyển viện, nộp bảo hiểm nhân thọ hoặc thanh toán quyền lợi theo quy định.',
    fieldsCount: '7 trường thông tin',
    icon: '📑',
    type: 'Hành chính',
  },
  {
    id: 'form-tu-van-dinh-duong',
    title: 'Phiếu Đăng ký Tư vấn Chế độ Dinh dưỡng',
    slug: 'tu-van-dinh-duong',
    desc: 'Đăng ký tư vấn thực đơn cho người bệnh tiểu đường, tim mạch, tăng huyết áp hoặc bệnh nhân chuẩn bị phẫu thuật.',
    fieldsCount: '5 trường thông tin',
    icon: '🥗',
    type: 'Chuyên môn',
  },
]

export default async function FormsHubPage() {
  let siteSettings: any = {}
  let activeForms: any[] = []

  let formsConf: any = {}
  try {
    const [specForms, settings, payload] = await Promise.all([
      getGlobal('forms-page-settings' as any).catch(() => null),
      getGlobal('site-settings' as any).catch(() => ({})),
      getCMS().catch(() => null),
    ])
    siteSettings = settings || {}
    formsConf = (specForms && Object.keys(specForms).length > 0) ? specForms : (siteSettings?.formsPage || {})

    if (payload) {
      const res = await payload.find({
        collection: 'forms',
        where: {
          and: [
            { active: { equals: true } },
          ],
        },
        limit: 30,
        sort: '-createdAt',
        overrideAccess: true,
      }).catch(() => ({ docs: [] }))

      activeForms = res.docs || []
    }
  } catch {}
  const eyebrow = formsConf.eyebrow || 'CHĂM SÓC NGƯỜI BỆNH & THỦ TỤC ĐIỆN TỬ'
  const title = formsConf.title || 'Biểu mẫu Điện tử & Đăng ký'
  const description = formsConf.description || 'Hệ thống biểu mẫu hành chính số hóa giúp người bệnh đăng ký thủ tục nhanh chóng, tiết kiệm thời gian chờ đợi tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Biểu mẫu điện tử"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="bieu-mau" />

          {formsConf.showNoticeBanner && (
            <div className="patientCareNoticeBanner" style={{ textAlign: formsConf.noticeAlign || 'left' }}>
              <div className="patientCareNoticeHeader">
                <div className="patientCareNoticeIcon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="patientCareNoticeTitle">{formsConf.noticeTitle || 'Lưu ý khi điền biểu mẫu điện tử'}</h2>
              </div>
              <p className="patientCareNoticeContent">{formsConf.noticeContent}</p>
            </div>
          )}

          {/* Khối tiện ích biểu mẫu (quản lý từ CMS) */}
          {(() => {
            const DEFAULT_FORM_BOXES = [
              {
                icon: '⚡',
                title: 'Tiết kiệm thời gian',
                desc: 'Điền trước thông tin từ điện thoại hoặc máy tính trước khi đến viện, giảm tối đa thời gian xếp hàng.',
              },
              {
                icon: '📱',
                title: 'Mã xác nhận điện tử',
                desc: 'Sau khi gửi thành công, bạn sẽ nhận được mã tiếp nhận để nhân viên quầy tra cứu ngay lập tức.',
              },
              {
                icon: '🔒',
                title: 'Bảo mật thông tin bệnh nhân',
                desc: 'Thông tin được lưu trữ và xử lý tuân thủ nghiêm ngặt quy chế bảo mật hồ sơ bệnh án.',
              },
            ]
            const boxes = Array.isArray(formsConf.infoBoxes) && formsConf.infoBoxes.length > 0
              ? formsConf.infoBoxes.filter((b: any) => b?.enabled !== false)
              : DEFAULT_FORM_BOXES

            if (boxes.length === 0) return null

            return (
              <div className="patientCareInfoGrid" style={{ marginBottom: '28px' }}>
                {boxes.map((b: any, idx: number) => (
                  <div className="patientCareInfoBox" key={idx}>
                    <div className="patientCareInfoIcon">{b.icon || '⚡'}</div>
                    <div>
                      <h3 className="patientCareInfoTitle">{b.title}</h3>
                      <p className="patientCareInfoText" style={{ whiteSpace: 'pre-line' }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              Danh mục Biểu mẫu trực tuyến
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Chọn mẫu giấy tờ bạn cần đăng ký hoặc khai báo để bắt đầu điền thông tin:
            </p>
          </div>

          <div className="patientCareGrid">
            {activeForms.length > 0 ? (
              activeForms.map((form: any) => (
                <div key={form.id} className="patientCareCard">
                  <div className="patientCareCardTop">
                    <div className="patientCareCardIcon">📋</div>
                    <span className="patientCareCardBadge badgeActive">🟢 Đang nhận phản hồi</span>
                  </div>
                  <h3 className="patientCareCardTitle">{form.title}</h3>
                  <p className="patientCareCardDesc">{form.description || 'Vui lòng điền đầy đủ các thông tin theo yêu cầu để bệnh viện tiếp nhận xử lý.'}</p>
                  <div className="patientCareCardMeta">
                    <div className="patientCareCardMetaItem">
                      <span>📝 Số trường: {Array.isArray(form.fields) ? `${form.fields.length} mục cần điền` : 'Biểu mẫu tiêu chuẩn'}</span>
                    </div>
                    <div className="patientCareCardMetaItem">
                      <span>✅ Tiếp nhận trực tuyến 24/7</span>
                    </div>
                  </div>
                  <div className="patientCareCardActions">
                    <Link href={`/bieu-mau/${form.slug}`} className="btnCarePrimary">
                      Điền biểu mẫu ngay →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              DEFAULT_FORMS.map((form) => (
                <div key={form.id} className="patientCareCard">
                  <div className="patientCareCardTop">
                    <div className="patientCareCardIcon">{form.icon}</div>
                    <span className="patientCareCardBadge badgePeriodic">{form.type}</span>
                  </div>
                  <h3 className="patientCareCardTitle">{form.title}</h3>
                  <p className="patientCareCardDesc">{form.desc}</p>
                  <div className="patientCareCardMeta">
                    <div className="patientCareCardMetaItem">
                      <span>📝 Quy mô: {form.fieldsCount}</span>
                    </div>
                    <div className="patientCareCardMetaItem">
                      <span>⚡ Thủ tục: Tiếp nhận tại bàn chỉ dẫn</span>
                    </div>
                  </div>
                  <div className="patientCareCardActions">
                    <Link href="/gop-y" className="btnCarePrimary">
                      Đăng ký trực tuyến →
                    </Link>
                    <Link href="/quy-trinh-kham-benh" className="btnCareSecondary">
                      Xem quy trình
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA Banner */}
          <div className="patientCareCtaBanner">
            <div className="patientCareCtaContent">
              <h3>Bạn cần hỗ trợ hướng dẫn thủ tục trực tiếp?</h3>
              <p>Quầy Chăm sóc khách hàng tại tầng trệt khu khám bệnh luôn sẵn sàng hỗ trợ người bệnh điền giấy tờ và in biểu mẫu miễn phí.</p>
            </div>
            <div className="patientCareCtaActions">
              <Link href="/quy-trinh-kham-benh" className="btnCtaWhite">
                Xem Quy trình khám
              </Link>
              <Link href="/lien-he" className="btnCtaOutline">
                Hỏi CSKH
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
