import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { VaccinationView } from './VaccinationView'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import './tiem-chung.css'

export const revalidate = 300
const relationId = (value: any) => (typeof value === 'object' ? String(value?.id || '') : String(value || ''))
const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('vi-VN') : '')

export default async function VaccinationPage() {
  let vaccines: any[] = []
  let schedules: any[] = []
  let pageSettings: any = {}
  let medproUrl = process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
  let hotline = '0292 3861 234'

  try {
    const [payload, vaxSettingsData, siteSettingsData, contactSettingsData] = await Promise.all([
      getCMS(),
      getGlobal('vaccination-settings' as any).catch(() => null),
      getGlobal('site-settings').catch(() => ({})),
      getGlobal('contact-settings').catch(() => ({})),
    ])
    const siteSettings: any = siteSettingsData
    const contactSettings: any = contactSettingsData
    pageSettings = (vaxSettingsData && Object.keys(vaxSettingsData).length > 0)
      ? vaxSettingsData
      : (siteSettings?.vaccinationPage || {})

    medproUrl = pageSettings?.bookButtonUrl || siteSettings?.medproUrl || medproUrl
    hotline = pageSettings?.consultHotline || contactSettings?.hotline || siteSettings?.hotline || hotline

    const [scheduleResult, vaccineResult, priceResult, legacyResult, defaults] = await Promise.all([
      payload.find({ collection: 'vaccinationSchedules', where: { active: { equals: true } }, sort: '-date', limit: 300, depth: 1 }),
      payload.find({ collection: 'vaccines', where: { active: { equals: true } }, sort: 'name', limit: 300, depth: 1 }),
      payload.find({ collection: 'vaccinePrices', where: { active: { equals: true } }, sort: '-effectiveFrom', limit: 2000, depth: 1 }),
      payload.find({ collection: 'vaccinations', where: { active: { equals: true } }, sort: '-date', limit: 300, depth: 1 }).catch(() => ({ docs: [] })),
      getDefaultContentMedia(),
    ])

    const now = new Date()
    const currentPrice = new Map<string, any>()
    for (const price of priceResult.docs as any[]) {
      const from = price.effectiveFrom ? new Date(price.effectiveFrom) : null
      const to = price.effectiveTo ? new Date(price.effectiveTo) : null
      if (from && from > now) continue
      if (to && to < now) continue
      const id = relationId(price.vaccine)
      if (id && !currentPrice.has(id)) currentPrice.set(id, price)
    }

    schedules = (scheduleResult.docs as any[]).map((x) => ({
      id: String(x.id),
      title: x.title,
      summary: x.summary || x.target || x.note || 'Thông tin lịch tiêm ngừa được bệnh viện cập nhật.',
      scheduleKind: x.scheduleKind || 'official',
      target: x.target,
      date: formatDate(x.date),
      endDate: formatDate(x.endDate),
      startTime: x.startTime,
      endTime: x.endTime,
      location: x.location,
      registrationUrl: x.registrationUrl,
      coverUrl: mediaUrl(x.scheduleImage) || defaults.vaccinations,
      href: `/tiem-chung/${x.id}?type=schedule`,
    }))

    vaccines = (vaccineResult.docs as any[]).map((x) => {
      const priceDoc = currentPrice.get(String(x.id))
      // Ưu tiên giá nhập trực tiếp trên thẻ vắc xin, fallback sang bảng giá vaccinePrices
      const resolvedPrice = typeof x.price === 'number'
        ? x.price
        : typeof priceDoc?.price === 'number'
          ? priceDoc.price
          : undefined

      return {
        id: String(x.id),
        name: x.name,
        code: x.code,
        slug: x.slug,
        summary: x.summary,
        manufacturer: x.manufacturer,
        origin: x.origin,
        prevents: x.prevents,
        targetGroup: x.targetGroup || 'all',
        ageGroup: x.ageGroup,
        availability: x.availability || 'available',
        price: resolvedPrice,
        decisionNo: priceDoc?.decisionNo,
        note: x.note,
        registrationUrl: x.registrationUrl,
        coverUrl: mediaUrl(x.image) || defaults.vaccinations,
        href: `/tiem-chung/${x.id}?type=vaccine`,
      }
    })

    // Chỉ dùng dữ liệu legacy khi collection chuẩn tương ứng chưa có dữ liệu.
    const legacyDocs = legacyResult.docs as any[]
    if (schedules.length === 0) {
      schedules = legacyDocs
        .filter((x) => x.entryType !== 'vaccine')
        .map((x) => ({
          id: String(x.id),
          title: x.vaccineName,
          summary: x.summary || x.target || x.note,
          scheduleKind: x.entryType === 'announcement' ? 'announcement' : 'official',
          target: x.target,
          date: formatDate(x.date),
          endDate: formatDate(x.endDate),
          startTime: x.startTime,
          endTime: x.endTime,
          location: x.location,
          registrationUrl: x.registrationUrl,
          note: x.note,
          coverUrl: mediaUrl(x.announcementImage || x.campaignImage) || defaults.vaccinations,
          href: `/tiem-chung/${x.id}`,
        }))
    }

    if (vaccines.length === 0) {
      vaccines = legacyDocs
        .filter((x) => x.entryType === 'vaccine')
        .map((x) => ({
          id: String(x.id),
          name: x.vaccineName,
          summary: x.summary,
          manufacturer: x.manufacturer,
          origin: x.origin,
          prevents: x.prevents,
          targetGroup: 'all',
          ageGroup: x.ageGroup,
          availability: x.availability || 'available',
          price: typeof x.fee === 'number' ? x.fee : undefined,
          note: x.note,
          registrationUrl: x.registrationUrl,
          coverUrl: mediaUrl(x.vaccineImage) || defaults.vaccinations,
          href: `/tiem-chung/${x.id}`,
        }))
    }
  } catch (error) {
    console.error('[VaccinationPage] Lỗi khi tải dữ liệu tiêm chủng:', error)
  }

  const eyebrow = pageSettings.eyebrow || 'TIÊM NGỪA AN TOÀN'
  const title = pageSettings.title || 'Thông tin tiêm ngừa & Danh mục Vắc xin'
  const description = pageSettings.description || 'Theo dõi bảng giá vắc xin hiện hành, đối tượng tiêm ngừa và lịch tiêm chủng an toàn tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  return (
    <>
      <SiteHeader />
      <PageHero eyebrow={eyebrow} title={title} description={description} breadcrumb="Tiêm chủng & Vắc xin" />
      <main className="section">
        <div className="container">
          {pageSettings.showNoticeBanner !== false && (pageSettings.noticeContent || pageSettings.noticeTitle) && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #93c5fd',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '28px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
                textAlign: pageSettings.noticeAlign || 'left',
              }}
            >
              {pageSettings.noticeTitle && (
                <h3
                  style={{
                    margin: '0 0 10px',
                    color: '#1e40af',
                    fontSize: '17px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: pageSettings.noticeAlign === 'center' ? 'center' : pageSettings.noticeAlign === 'right' ? 'flex-end' : 'flex-start',
                    textWrap: 'balance',
                  }}
                >
                  <span>💉</span> {pageSettings.noticeTitle}
                </h3>
              )}
              {pageSettings.noticeContent && (
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
                  {pageSettings.noticeContent}
                </p>
              )}
            </div>
          )}

          <VaccinationView
            vaccines={vaccines}
            schedules={schedules}
            medproUrl={medproUrl}
            hotline={hotline}
            showSearch={pageSettings.showSearch !== false}
            showAgeFilter={pageSettings.showAgeFilter !== false}
            showPrice={pageSettings.showPrice !== false}
            showBookButton={pageSettings.showBookButton !== false}
            showWorkflowSection={pageSettings.showWorkflowSection !== false}
            showSupportBanner={pageSettings.showSupportBanner !== false}
            bookButtonText={pageSettings.bookButtonText || 'Đăng ký tiêm'}
            bookButtonUrl={pageSettings.bookButtonUrl}
          />

          {/* Khối bài viết chi tiết & Hướng dẫn tiêm chủng RichText */}
          {pageSettings.contentBlock?.enabled && (pageSettings.contentBlock?.title || pageSettings.contentBlock?.content) && (
            <article
              className="vaccineDetailCard"
              style={{
                marginTop: '44px',
                padding: '32px 36px',
                textAlign: (pageSettings.contentBlock?.textAlign || 'left') as any,
              }}
            >
              {pageSettings.contentBlock?.title && (
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2744', marginBottom: '12px' }}>
                  {pageSettings.contentBlock.title}
                </h2>
              )}
              {pageSettings.contentBlock?.subtitle && (
                <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                  {pageSettings.contentBlock.subtitle}
                </p>
              )}
              {pageSettings.contentBlock?.content && (
                <div className="vaccineDetailContent" style={{ padding: 0 }}>
                  <RichText data={pageSettings.contentBlock.content} />
                </div>
              )}
            </article>
          )}

          {/* Các khối nội dung tùy biến thêm mới (Custom Blocks) */}
          {Array.isArray(pageSettings.customBlocks) && pageSettings.customBlocks.filter((b: any) => b?.enabled !== false).length > 0 && (
            <section style={{ marginTop: '28px', marginBottom: '40px' }}>
              {pageSettings.customBlocks.filter((b: any) => b?.enabled !== false).map((block: any, bIdx: number) => {
                const bAlign = block.textAlign || 'left'
                return (
                  <div
                    key={block.id || bIdx}
                    className="vaccineDetailCard"
                    style={{
                      padding: '28px 32px',
                      marginBottom: '20px',
                      textAlign: bAlign !== 'left' ? bAlign : undefined,
                    }}
                  >
                    {block.kicker && (
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>
                        {block.kicker}
                      </span>
                    )}
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f2744', margin: '0 0 10px' }}>
                      {block.title}
                    </h3>
                    {block.subtitle && (
                      <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 18px' }}>
                        {block.subtitle}
                      </p>
                    )}
                    {block.content && (
                      <div className="vaccineDetailContent" style={{ padding: 0 }}>
                        <RichText data={block.content} />
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
