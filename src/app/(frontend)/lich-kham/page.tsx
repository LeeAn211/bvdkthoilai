import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import '../lich-lam-viec/lich-lam-viec.css'

export const revalidate = 60

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''

type PageProps = {
  searchParams?: Promise<{ category?: string; type?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  let items: any[] = []
  const query = (await searchParams) || {}
  const rawType = (query.type || query.category || '').toLowerCase()
  let initialCategory = 'all'
  if (rawType === 'emergency' || rawType.includes('truc') || rawType.includes('cấp cứu') || rawType.includes('cap cuu')) {
    initialCategory = 'Lịch trực cấp cứu'
  } else if (rawType === 'weekly' || rawType.includes('tuan')) {
    initialCategory = 'Lịch khám theo tuần'
  } else if (rawType === 'daily' || rawType.includes('ngay')) {
    initialCategory = 'Lịch khám theo ngày'
  } else if (rawType === 'attachment' || rawType.includes('dinh kem')) {
    initialCategory = 'Lịch đính kèm'
  }

  let schedSettings: any = {}
  try {
    const payload = await getCMS()
    const [result, defaults, schedConfig] = await Promise.all([
      payload.find({
        collection: 'schedules',
        where: { active: { equals: true } },
        sort: '-createdAt',
        limit: 200,
        depth: 2,
      }),
      getDefaultContentMedia(),
      payload.findGlobal({ slug: 'schedule-settings' }).catch(() => null),
    ])
    schedSettings = schedConfig || {}
    items = (result.docs as any[]).map((x) => {
      const isEmergency = x.mode === 'emergency'
      const isWeekly = x.mode === 'weekly'
      const isAttachment = x.mode === 'attachment'

      const category = isEmergency
        ? 'Lịch trực cấp cứu'
        : isAttachment
          ? 'Lịch đính kèm'
          : isWeekly
            ? 'Lịch khám theo tuần'
            : 'Lịch khám theo ngày'

      const date = isEmergency
        ? [formatDate(x.emergencyWeekStart), formatDate(x.emergencyWeekEnd)].filter(Boolean).join(' – ') || (x.emergencyWeekStart ? formatDate(x.emergencyWeekStart) : '')
        : isWeekly
          ? [formatDate(x.weekStart), formatDate(x.weekEnd)].filter(Boolean).join(' – ')
          : isAttachment
            ? [formatDate(x.validFrom), formatDate(x.validTo)].filter(Boolean).join(' – ')
            : formatDate(x.date)

      return {
        id: x.id,
        title: x.title,
        excerpt:
          x.summary ||
          x.note ||
          (isEmergency
            ? 'Lịch trực cấp cứu & bệnh viện 24/24 của Bệnh viện Đa khoa Khu vực Thới Lai.'
            : x.department?.name
              ? `Khoa/Phòng: ${x.department.name}`
              : 'Thông tin lịch phân công được bệnh viện cập nhật.'),
        category,
        date,
        coverUrl: mediaUrl(x.scheduleImage || x.coverImage) || defaults.schedules,
        href: `/lich-kham/${x.id}`,
      }
    })
  } catch {}

  const hero = schedSettings?.hero || {}
  const notice = schedSettings?.quickNotice || {}
  const notes = schedSettings?.notesSection || {}

  const bgType = hero?.bgType || 'gradient'
  const bgGradient = hero?.bgGradient || 'blue-teal'
  const bgImageUrl = typeof hero?.bgImage === 'object' && hero?.bgImage?.url ? hero?.bgImage?.url : ''
  const overlayClass = hero?.overlayOpacity === 'dark' ? 'dark' : hero?.overlayOpacity === 'light' ? 'light' : 'medium'
  const titleSizeClass = hero?.titleSize === 'compact' ? 'size-compact' : hero?.titleSize === 'large' ? 'size-large' : 'size-default'
  const titleColorClass = hero?.titleColor === 'yellow' ? 'color-yellow' : hero?.titleColor === 'cyan' ? 'color-cyan' : 'color-white'

  const heroStyle: React.CSSProperties = {}
  if (bgType === 'image' && bgImageUrl) {
    heroStyle.backgroundImage = `url(${bgImageUrl})`
    heroStyle.backgroundSize = 'cover'
    heroStyle.backgroundPosition = 'center center'
  } else if (bgType === 'solid') {
    heroStyle.background = '#0369a1'
  }

  const rawNotes = Array.isArray(notes?.items) ? notes.items : []
  const activeNotes = rawNotes.filter((n: any) => n?.enabled !== false && (n?.content?.trim() || n?.boldPrefix?.trim()))

  return (
    <>
      <SiteHeader />
      <section
        className={`whHero ${bgType === 'gradient' ? `grad-${bgGradient}` : ''}`}
        style={heroStyle}
      >
        <div className={`whHeroOverlay ${overlayClass}`} />
        <div className="container">
          <div className="whHeroInner">
            <span className="whBadge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {hero?.eyebrow || 'KHÁM CHỮA BỆNH & TRỰC BỆNH VIỆN'}
            </span>
            <h1 className={`${titleSizeClass} ${titleColorClass}`}>
              {hero?.title || 'Lịch khám & Lịch trực bệnh viện'}
            </h1>
            {hero?.description && (
              <p className="whSlogan">
                {hero.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {/* BANNER THÔNG BÁO NHANH / CẤP CỨU NẾU BẬT */}
          {notice?.enabled !== false && notice?.title && (
            <div
              style={{
                background: notice?.titleColor === 'red' ? '#fef2f2' : notice?.titleColor === 'green' ? '#f0fdf4' : '#f0f9ff',
                border: `1.5px solid ${notice?.titleColor === 'red' ? '#fecaca' : notice?.titleColor === 'green' ? '#bbf7d0' : '#bae6fd'}`,
                borderRadius: 14,
                padding: '20px 24px',
                marginBottom: 28,
                textAlign: notice?.textAlign || 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3
                    style={{
                      margin: '0 0 6px',
                      fontSize: 17,
                      fontWeight: 850,
                      color: notice?.titleColor === 'red' ? '#dc2626' : notice?.titleColor === 'green' ? '#15803d' : '#0369a1',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {notice.title}
                  </h3>
                  {notice?.content && (
                    <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {notice.content}
                    </p>
                  )}
                </div>
                {notice?.hotline && (
                  <a
                    href={`tel:${notice.hotline.replace(/\s+/g, '')}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 99,
                      background: notice?.titleColor === 'red' ? '#dc2626' : '#0284c7',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: 14,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>Gọi Hotline: {notice.hotline}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <SearchFilter items={items} kind="schedule" initialCategory={initialCategory} />

          {/* KHỐI LƯU Ý DÀNH CHO NGƯỜI BỆNH NẾU BẬT */}
          {notes?.enabled !== false && activeNotes.length > 0 && (
            <div className="whNotesBox" style={{ marginTop: 40 }}>
              <div className="whNotesTitle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{notes?.title || 'LƯU Ý QUAN TRỌNG KHI ĐẾN KHÁM BỆNH'}</span>
              </div>
              <ul className="whNotesList">
                {activeNotes.map((item: any, idx: number) => {
                  const alignStyle = item.textAlign ? { textAlign: item.textAlign } : undefined
                  const colorClass = item.textColor === 'black' ? 'color-black' : item.textColor === 'navy' ? 'color-navy' : item.textColor === 'red' ? 'color-red' : ''
                  const sizeClass = item.textSize === 'large' ? 'size-large' : ''

                  return (
                    <li key={item.id || idx} className={`${colorClass} ${sizeClass}`} style={alignStyle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="whNoteContentText" style={alignStyle}>
                        {item.boldPrefix && <strong>{item.boldPrefix} </strong>}
                        {item.content}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

