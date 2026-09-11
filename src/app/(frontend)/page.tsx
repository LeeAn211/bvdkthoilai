import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { HomeNewsTabs } from '@/components/HomeNewsTabs'
import { HomeScienceTabs } from '@/components/HomeScienceTabs'
import { RichText } from '@/components/RichText'
import { ScheduleExplorer } from '@/components/ScheduleExplorer'
import { VaccinationTabs } from '@/components/VaccinationTabs'
import { HeroBannerCarousel } from '@/components/HeroBannerCarousel'
import { FeaturedContentCarousel } from '@/components/FeaturedContentCarousel'
import { getCMS, getGlobal, getHomepage } from '@/lib/payload'
import { mediaFormat, mediaLabel, mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import type { CSSProperties } from 'react'

export const revalidate = 0
export const dynamic = 'force-dynamic'

function HomeGlyph({ name }: { name?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'doctor') return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M8 3v5a4 4 0 0 0 8 0V3M6 3h4M14 3h4M12 12v2a5 5 0 0 0 5 5h1M18 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></svg>
  if (name === 'hospital') return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M4 21V5h16v16M9 5V2h6v3M9 10h6M12 7v6M7 16h3v5M14 16h3v5" /></svg>
  if (name === 'price') return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="m3 12 9-9h7v7l-9 9-7-7ZM15.5 6.5h.01M13 12H7M10 9v6" /></svg>
  if (name === 'insurance') return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3ZM9 12h6M12 9v6" /></svg>
  if (name === 'map') return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13ZM12 6v6M9 9h6" /></svg>
  if (name === 'phone') return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M7 3 4 5c-1 1 1 6 5 10s9 6 10 5l2-3-5-3-2 2c-2-1-5-4-6-6l2-2-3-5Z" /></svg>
  if (name === 'document') return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M6 2h8l4 4v16H6V2ZM14 2v5h4M9 12h6M9 16h6" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...common} d="M5 4h14v17H5V4ZM8 2v4M16 2v4M5 9h14M9 14h6M12 11v6" /></svg>
}


export default async function HomePage() {
  let home: any = {}
  let news: any[] = []
  let notices: any[] = []
  let procurement: any[] = []
  let documents: any[] = []
  let doctors: any[] = []
  let departments: any[] = []
  let specialties: any[] = []
  let services: any[] = []
  let schedules: any[] = []
  let vaccinationSchedules: any[] = []
  let vaccines: any[] = []
  let vaccinePrices: any[] = []
  let contentSections: any[] = []
  let customPosts: any[] = []
  let siteSettings: any = {}
  let quickLinksSettings: any = {}
  let defaultMedia: any = { news: '/default-content/news.svg', notices: '/default-content/notices.svg', procurement: '/default-content/procurement.svg' }
  let totals = { news: 0, notices: 0, doctors: 0, departments: 0, services: 0 }

  try {
    const [payload, homepage, settings, contentDefaults, quickSettings] = await Promise.all([getCMS(), getHomepage(), getGlobal('site-settings'), getDefaultContentMedia(), getGlobal('quick-links-settings')])
    home = homepage
    siteSettings = settings
    defaultMedia = contentDefaults
    quickLinksSettings = quickSettings || {}

    const [newsResult, noticeResult, procurementResult, documentResult, doctorResult, departmentResult, specialtyResult, serviceResult, scheduleResult, vaccinationScheduleResult, vaccineResult, vaccinePriceResult, contentSectionResult, customPostResult] = await Promise.all([
      payload.find({ collection: 'news', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 100, depth: 1 }),
      payload.find({ collection: 'notices', where: { and: [{ _status: { equals: 'published' } }, { showOnHome: { equals: true } }] }, sort: '-startAt', limit: 6, depth: 1 }),
      payload.find({ collection: 'procurement', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 6, depth: 1 }),
      payload.find({ collection: 'documents', sort: '-issuedAt', limit: 6, depth: 1 }),
      payload.find({ collection: 'doctors', limit: 6, sort: 'name', depth: 1 }),
      payload.find({ collection: 'departments', limit: 100, sort: 'name', depth: 0 }),
      payload.find({ collection: 'specialties', where: { active: { equals: true } }, limit: 100, sort: 'order', depth: 1 }),
      payload.find({ collection: 'services', where: { active: { equals: true } }, limit: 8, sort: 'name', depth: 0 }),
      payload.find({ collection: 'schedules', where: { active: { equals: true } }, limit: 100, sort: 'date', depth: 1 }),
      payload.find({ collection: 'vaccinationSchedules', where: { active: { equals: true } }, limit: 200, sort: '-date', depth: 1 }),
      payload.find({ collection: 'vaccines', where: { active: { equals: true } }, limit: 200, sort: 'name', depth: 1 }),
      payload.find({ collection: 'vaccinePrices', where: { active: { equals: true } }, limit: 1000, sort: '-effectiveFrom', depth: 1 }),
      payload.find({ collection: 'content-sections', where: { and: [{ active: { equals: true } }, { _status: { equals: 'published' } }] }, limit: 100, sort: 'title', depth: 1 }),
      payload.find({ collection: 'custom-posts', where: { _status: { equals: 'published' } }, limit: 300, sort: '-publishedAt', depth: 2 }),
    ])
    news = newsResult.docs as any[]
    notices = noticeResult.docs as any[]
    procurement = procurementResult.docs as any[]
    documents = documentResult.docs as any[]
    doctors = doctorResult.docs as any[]
    departments = departmentResult.docs as any[]
    specialties = specialtyResult.docs as any[]
    services = serviceResult.docs as any[]
    schedules = scheduleResult.docs as any[]
    vaccinationSchedules = vaccinationScheduleResult.docs as any[]
    vaccines = vaccineResult.docs as any[]
    vaccinePrices = vaccinePriceResult.docs as any[]
    contentSections = contentSectionResult.docs as any[]
    customPosts = customPostResult.docs as any[]
    totals = { news: newsResult.totalDocs, notices: noticeResult.totalDocs, doctors: doctorResult.totalDocs, departments: departmentResult.totalDocs, services: serviceResult.totalDocs }
  } catch {}

  const medpro = siteSettings?.medproUrl || process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
  const builtInHeroImage = '/banners/banner-bvdk-thoi-lai-1920x600.png'
  const configuredHeroSlides = (Array.isArray(home?.banners) ? home.banners : [])
    .filter((item: any) => item.visible !== false && mediaUrl(item.desktopImage))
    .map((item: any, index: number) => ({ id: String(item.id || index), desktopUrl: mediaUrl(item.desktopImage), mobileUrl: mediaUrl(item.mobileImage) || undefined, title: item.title }))
  const fallbackHeroImage = mediaUrl(home?.hero?.desktopImage) || builtInHeroImage
  const heroSlides = configuredHeroSlides.length ? configuredHeroSlides : [{ id: 'default', desktopUrl: fallbackHeroImage, mobileUrl: mediaUrl(home?.hero?.mobileImage) || undefined, title: home?.hero?.title }]
  const showHeroBanners = home?.showHeroBanners !== false

  const fallbackQuickLinks = [
    { title: 'Đặt lịch khám', description: 'Đặt lịch nhanh chóng', url: medpro, icon: 'calendar' },
    { title: 'Lịch khám bệnh', description: 'Xem lịch khám bác sĩ', url: '/lich-kham', icon: 'doctor' },
    { title: 'Lịch tiêm chủng', description: 'Lịch tiêm theo ngày', url: '/tiem-chung', icon: 'insurance' },
    { title: 'Bảng giá dịch vụ', description: 'Tra cứu chi phí', url: '/bang-gia', icon: 'price' },
    { title: 'Thông báo', description: 'Thông tin mới nhất', url: '/thong-bao', icon: 'hospital' },
    { title: 'Đấu thầu – Mua sắm', description: 'Công khai, minh bạch', url: '/dau-thau-mua-sam', icon: 'map' },
    { title: 'Văn bản – Tài liệu', description: 'Tra cứu tài liệu', url: '/van-ban', icon: 'document' },
    { title: 'Liên hệ', description: 'Hỗ trợ và phản hồi', url: '/lien-he', icon: 'phone' },
  ]
  const configuredQuickLinks = Array.isArray(quickLinksSettings?.items)
    ? quickLinksSettings.items
    : (Array.isArray(home?.quickLinks) ? home.quickLinks : fallbackQuickLinks)
  const quickLinksEnabled = quickLinksSettings?.enabled !== false
  const quickLinks = configuredQuickLinks.filter((item: any) => item?.visible !== false).slice(0, 12)
  const configuredStats = Array.isArray(home?.stats) ? home.stats.filter((item: any) => item?.value && item?.label) : []
  const stats = configuredStats.length ? configuredStats.slice(0, 4) : [
    { value: `${totals.departments || 20}+`, label: 'Khoa & Phòng' },
    { value: `${totals.doctors || 100}+`, label: 'Bác sĩ, nhân viên' },
    { value: `${totals.services || 250}+`, label: 'Dịch vụ y tế' },
    { value: `${totals.news + totals.notices || 100}+`, label: 'Tin bài công khai' },
  ]

  const configuredSections = Array.isArray(home?.sections) ? home.sections : []
  const sectionDefaults: Record<string, { eyebrow: string; title: string; description?: string; order: number }> = {
    'featured-news': { eyebrow: 'TIN TỨC', title: 'Tin tức & hoạt động', description: 'Cập nhật hoạt động nổi bật và thông tin chuyên môn mới nhất.', order: 0 },
    'news-portal': { eyebrow: 'CỔNG THÔNG TIN BỆNH VIỆN', title: 'Các chuyên mục tin tức', order: 1 },
    organization: { eyebrow: 'CHUYÊN KHOA', title: 'Hệ thống chuyên khoa', description: 'Đội ngũ tận tâm, quy trình chuyên nghiệp và trang thiết bị phù hợp.', order: 2 },
    notices: { eyebrow: 'THÔNG BÁO', title: 'Thông báo mới', description: 'Thông tin dành cho người bệnh và cộng đồng.', order: 3 },
    procurement: { eyebrow: 'CÔNG KHAI', title: 'Đấu thầu – Mua sắm', description: 'Thông tin mời thầu và kết quả mua sắm.', order: 4 },
    schedules: { eyebrow: 'LỊCH KHÁM BỆNH', title: 'Chủ động trước khi đến khám', description: 'Tra cứu bác sĩ, chuyên khoa, thời gian và phòng khám.', order: 5 },
    vaccinations: { eyebrow: 'LỊCH TIÊM CHỦNG', title: 'Thông tin tiêm ngừa', description: 'Lịch tiêm, đợt tiêm và danh mục vắc xin tại bệnh viện.', order: 6 },
    science: { eyebrow: 'HOẠT ĐỘNG NỔI BẬT', title: 'Chuyên môn – Đào tạo', order: 7 },
    introduction: { eyebrow: home?.intro?.eyebrow || 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI', title: home?.intro?.title || 'Tận tâm chăm sóc sức khỏe cộng đồng', description: home?.intro?.description, order: 8 },
    documents: { eyebrow: 'TÀI LIỆU CÔNG KHAI', title: 'Văn bản mới', description: 'Quyết định, biểu mẫu và tài liệu được cập nhật từ hệ thống quản trị.', order: 9 },
  }
  const sectionConfig = (key: string) => {
    const aliases: Record<string, string[]> = { 'featured-news': ['news'] }
    const index = configuredSections.findIndex((item: any) => item?.type === key || aliases[key]?.includes(item?.type))
    const custom = index >= 0 ? configuredSections[index] : {}
    return { ...sectionDefaults[key], ...custom, order: index >= 0 ? index : sectionDefaults[key].order }
  }
  const organizationConfig = sectionConfig('organization') as any
  const introImage = mediaUrl(organizationConfig?.organizationImage || home?.intro?.image, 'article') || '/banners/banner-benh-vien.png'
  const medproCard = organizationConfig?.organizationMedpro || {}
  const medproCardUrl = medproCard.buttonUrl || medpro
  const featuredInterval = Math.max(2500, Number(sectionConfig('featured-news')?.carouselSeconds || 4.5) * 1000)
  const featuredItemLimit = Math.min(40, Math.max(4, Number(sectionConfig('featured-news')?.featuredItemLimit || 16)))

  const sectionStyle = (key: string) => {
    const item = sectionConfig(key)
    return {
      order: item.order,
      display: item.visible === false ? 'none' : undefined,
      '--section-eyebrow-color': item.eyebrowColor || undefined,
      '--section-title-color': item.titleColor || undefined,
      '--section-description-color': item.descriptionColor || undefined,
      '--section-background': item.backgroundColor || undefined,
      '--section-eyebrow-size': item.eyebrowSize ? `${item.eyebrowSize}px` : undefined,
      '--section-title-size': item.titleSize ? `${item.titleSize}px` : undefined,
      '--section-description-size': item.descriptionSize ? `${item.descriptionSize}px` : undefined,
      '--section-font-family': item.fontFamily || undefined,
      '--section-padding-top': item.paddingTop !== null && item.paddingTop !== undefined ? `${item.paddingTop}px` : undefined,
      '--section-padding-bottom': item.paddingBottom !== null && item.paddingBottom !== undefined ? `${item.paddingBottom}px` : undefined,
      '--section-content-width': item.contentWidth ? `${item.contentWidth}px` : undefined,
      '--section-heading-gap': item.headingGap !== null && item.headingGap !== undefined ? `${item.headingGap}px` : undefined,
    } as CSSProperties
  }
  const customSectionStyle = (item: any, index: number) => ({
    order: index,
    display: item.visible === false ? 'none' : undefined,
    '--section-eyebrow-color': item.eyebrowColor || undefined,
    '--section-title-color': item.titleColor || undefined,
    '--section-description-color': item.descriptionColor || undefined,
    '--section-background': item.backgroundColor || undefined,
    '--section-eyebrow-size': item.eyebrowSize ? `${item.eyebrowSize}px` : undefined,
    '--section-title-size': item.titleSize ? `${item.titleSize}px` : undefined,
    '--section-description-size': item.descriptionSize ? `${item.descriptionSize}px` : undefined,
    '--section-font-family': item.fontFamily || undefined,
    '--section-padding-top': item.paddingTop !== null && item.paddingTop !== undefined ? `${item.paddingTop}px` : undefined,
    '--section-padding-bottom': item.paddingBottom !== null && item.paddingBottom !== undefined ? `${item.paddingBottom}px` : undefined,
    '--section-content-width': item.contentWidth ? `${item.contentWidth}px` : undefined,
  } as CSSProperties)

  const homeDailySchedules = schedules.filter(item => !item.mode || item.mode === 'daily').map(item => ({ id: item.id, title: item.title, summary: item.summary, doctor: item.doctor?.name, department: item.department?.name, date: item.date, startTime: item.startTime, endTime: item.endTime, room: item.room, note: item.note, imageUrl: mediaUrl(item.coverImage) || defaultMedia.schedules }))
  const homeWeeklySchedules = schedules.filter(item => item.mode === 'weekly').map(item => ({ id: item.id, title: item.title, summary: item.summary, weekStart: item.weekStart, weekEnd: item.weekEnd, note: item.note, imageUrl: mediaUrl(item.coverImage) || defaultMedia.schedules, slots: (item.weeklySlots || []).map((slot: any) => ({ id: slot.id, dayOfWeek: slot.dayOfWeek, doctor: slot.doctor?.name || 'Bác sĩ', department: slot.department?.name || '', startTime: slot.startTime, endTime: slot.endTime, room: slot.room, note: slot.note })) }))
  const homeAttachedSchedules = schedules.filter(item => item.mode === 'attachment').map(item => ({ id: item.id, title: item.title, summary: item.summary, note: item.note, validFrom: item.validFrom, validTo: item.validTo, imageUrl: mediaUrl(item.coverImage || item.scheduleImage) || defaultMedia.schedules, fileUrl: mediaUrl(item.scheduleFile), fileName: mediaLabel(item.scheduleFile), fileFormat: mediaFormat(item.scheduleFile) }))
  const scheduleTabOrder = (sectionConfig('schedules')?.scheduleTabOrder || []).filter((item: any) => item.visible !== false && item.tab).map((item: any) => item.tab)
  const nowForVaccinePrice = new Date()
  const currentVaccinePrice = new Map<string, number>()
  for (const price of vaccinePrices) {
    const vaccineId = typeof price.vaccine === 'object' ? String(price.vaccine?.id || '') : String(price.vaccine || '')
    if (!vaccineId || currentVaccinePrice.has(vaccineId)) continue
    const from = price.effectiveFrom ? new Date(price.effectiveFrom) : null
    const to = price.effectiveTo ? new Date(price.effectiveTo) : null
    if (from && from > nowForVaccinePrice) continue
    if (to && to < nowForVaccinePrice) continue
    if (typeof price.price === 'number') currentVaccinePrice.set(vaccineId, price.price)
  }
  const homeVaccinationAnnouncements = vaccinationSchedules.filter(item => item.scheduleKind === 'announcement').map(item => ({ id: item.id, title: item.title, summary: item.summary, content: item.detailContent, imageUrl: mediaUrl(item.scheduleImage) || defaultMedia.vaccinations, fileUrl: mediaUrl(item.scheduleFile), fileName: mediaLabel(item.scheduleFile), fileFormat: mediaFormat(item.scheduleFile), href: `/tiem-chung/${item.id}?type=schedule` }))
  const homeVaccinationCampaigns = vaccinationSchedules.filter(item => item.scheduleKind !== 'announcement').map(item => ({ id: item.id, title: item.title, summary: item.summary, target: item.target, date: item.date, endDate: item.endDate, startTime: item.startTime, endTime: item.endTime, location: item.location, registrationUrl: item.registrationUrl, note: item.note, imageUrl: mediaUrl(item.scheduleImage) || defaultMedia.vaccinations, href: `/tiem-chung/${item.id}?type=schedule` }))
  const homeVaccines = vaccines.map(item => ({ id: item.id, title: item.name, summary: item.summary, manufacturer: item.manufacturer, origin: item.origin, prevents: item.prevents, ageGroup: item.ageGroup, availability: item.availability, fee: currentVaccinePrice.get(String(item.id)), imageUrl: mediaUrl(item.image) || defaultMedia.vaccinations, registrationUrl: item.registrationUrl, href: `/tiem-chung/${item.id}?type=vaccine` }))
  const vaccinationTabOrder = (sectionConfig('vaccinations')?.vaccinationTabOrder || []).filter((item: any) => item.visible !== false && item.tab).map((item: any) => item.tab)
  const contentTabsFor = (key: 'news-portal' | 'science') => (sectionConfig(key)?.contentTabs || []).map((tab: any, tabIndex: number) => ({
    label: tab.label?.trim() || `Chuyên mục ${tabIndex + 1}`,
    categories: (tab.values || []).map((entry: any) => entry.value?.trim()).filter(Boolean),
    manualItems: (tab.manualItems || []).filter((entry: any) => entry.title?.trim()).map((entry: any, itemIndex: number) => ({ id: entry.id || `manual-${tabIndex}-${itemIndex}`, title: entry.title, slug: '', excerpt: entry.description, coverUrl: mediaUrl(entry.image, 'card'), href: entry.url || '/tin-tuc' })),
  })).filter((tab: any) => tab.label || tab.categories.length || tab.manualItems.length)
  const scheduleTabs = (sectionConfig('schedules')?.scheduleTabOrder || []).filter((tab: any) => tab.visible !== false).map((tab: any, tabIndex: number) => ({
    label: tab.label?.trim(),
    kind: tab.tab,
    manualItems: (tab.manualItems || []).filter((entry: any) => entry.title?.trim()).map((entry: any, itemIndex: number) => ({ id: entry.id || `manual-schedule-${tabIndex}-${itemIndex}`, title: entry.title, summary: entry.description, imageUrl: mediaUrl(entry.image, 'card'), href: entry.url || '/lich-kham' })),
  })).filter((tab: any) => tab.label || tab.kind || tab.manualItems.length)
  const vaccinationTabs = (sectionConfig('vaccinations')?.vaccinationTabOrder || []).filter((tab: any) => tab.visible !== false).map((tab: any, tabIndex: number) => ({
    label: tab.label?.trim(),
    kind: tab.tab,
    manualItems: (tab.manualItems || []).filter((entry: any) => entry.title?.trim()).map((entry: any, itemIndex: number) => ({ id: entry.id || `manual-vaccine-${tabIndex}-${itemIndex}`, title: entry.title, summary: entry.description, imageUrl: mediaUrl(entry.image, 'card'), href: entry.url || '/tiem-chung' })),
  })).filter((tab: any) => tab.label || tab.kind || tab.manualItems.length)


  const featuredItems = [
    ...news.slice(0, 8).map((item: any) => ({ id: `news-${item.id}`, title: item.title, excerpt: item.excerpt, image: mediaUrl(item.cover || item.seoImage) || defaultMedia.news, href: `/tin-tuc/${item.slug}`, kind: 'TIN TỨC', dateValue: item.publishedAt || item.updatedAt, date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật' })),
    ...notices.slice(0, 6).map((item: any) => ({ id: `notice-${item.id}`, title: item.title, excerpt: item.excerpt, image: mediaUrl(item.cover || item.seoImage) || defaultMedia.notices, href: `/thong-bao/${item.slug}`, kind: 'THÔNG BÁO', dateValue: item.publishedAt || item.startAt || item.updatedAt, date: (item.publishedAt || item.startAt) ? new Date(item.publishedAt || item.startAt).toLocaleDateString('vi-VN') : 'Mới cập nhật' })),
    ...procurement.slice(0, 6).map((item: any) => ({ id: `procurement-${item.id}`, title: item.title, excerpt: item.excerpt || item.summary, image: mediaUrl(item.cover || item.seoImage) || defaultMedia.procurement, href: `/dau-thau-mua-sam/${item.slug}`, kind: 'ĐẤU THẦU – MUA SẮM', dateValue: item.publishedAt || item.updatedAt, date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật' })),
    ...schedules.slice(0, 12).map((item: any) => ({ id: `schedule-${item.id}`, title: item.title, excerpt: item.summary || item.note || 'Lịch khám mới được cập nhật từ bệnh viện.', image: mediaUrl(item.coverImage || item.scheduleImage) || defaultMedia.schedules, href: `/lich-kham/${item.id}`, kind: 'LỊCH KHÁM', dateValue: item.date || item.validFrom || item.weekStart || item.updatedAt, date: (item.date || item.validFrom || item.weekStart) ? new Date(item.date || item.validFrom || item.weekStart).toLocaleDateString('vi-VN') : 'Mới cập nhật' })),
  ].sort((a: any, b: any) => new Date(b.dateValue || 0).getTime() - new Date(a.dateValue || 0).getTime()).slice(0, featuredItemLimit)

  return (
    <main className="homePortalPage">
      <SiteHeader />

      {showHeroBanners && <HeroBannerCarousel slides={heroSlides} intervalSeconds={home?.bannerAutoplaySeconds || 6} bannerWidth={siteSettings?.headerBannerWidth || 1920} />}

      {quickLinksEnabled && quickLinks.length > 0 && <section className={`homeQuickWrap ${showHeroBanners ? 'withHero' : 'withoutHero'}`} aria-label="Dịch vụ nhanh">
        <div className="container homeQuickGrid">
          {quickLinks.map((item: any, index: number) => {
            const quickImage = item.visualMode === 'image' ? mediaUrl(item.image) : ''
            const external = /^https?:\/\//.test(item.url || '')
            const openNewTab = item.openNewTab === true || external
            return <a className="homeQuickItem" href={item.url || '#'} key={item.id || `${item.title}-${index}`} target={openNewTab ? '_blank' : undefined} rel={openNewTab ? 'noopener noreferrer' : undefined}>
              <span className={`homeQuickIcon ${quickImage ? 'hasCustomImage' : ''}`}>
                {quickImage ? <img src={quickImage} alt="" style={{ objectFit: item.imageFit === 'cover' ? 'cover' : 'contain' }} /> : <HomeGlyph name={item.icon} />}
              </span>
              <strong>{item.title}</strong>
              <small>{item.description || 'Xem thông tin chi tiết'}</small>
            </a>
          })}
        </div>
      </section>}

      {notices.length > 0 && <section className="noticeTicker"><div className="container noticeTickerInner"><span className="noticeLabel">THÔNG BÁO MỚI</span><a href={`/thong-bao/${notices[0]?.slug}`}>{notices[0]?.title}</a><a className="noticeAll" href="/thong-bao">Xem tất cả →</a></div></section>}

      <div className="homeSections">
        {configuredSections.map((item: any, index: number) => {
          if (!item || item.visible === false) return null
          const type = item.type === 'news' ? 'featured-news' : item.type
          const cfg = { ...(sectionDefaults[type] || {}), ...item }
          const style = customSectionStyle(cfg, index)
          const key = item.id || `${type}-${index}`

          if (type === 'introduction') return <section className="sectionPro configurableHomeSection homeOverviewSection" style={style} key={key}>
            <div className="container homeOverviewGrid"><div className="homeIntroCopy"><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description || 'Không ngừng nâng cao chất lượng khám chữa bệnh, ứng dụng công nghệ và phát triển đội ngũ nhân lực chuyên môn cao, hướng đến sự hài lòng của người bệnh.'}</p><a className="homeSolidButton" href="/gioi-thieu">Xem thêm về bệnh viện <span>→</span></a></div><div className="homeStatsGrid">{stats.map((stat: any, statIndex: number) => <article key={stat.id || `${stat.label}-${statIndex}`}><span className="homeStatIcon"><HomeGlyph name={['hospital', 'doctor', 'calendar', 'insurance'][statIndex]} /></span><strong>{stat.value}</strong><small>{stat.label}</small></article>)}</div></div>
          </section>

          if (type === 'organization') return <section className="sectionPro configurableHomeSection homeOrganizationSection" style={style} key={key}>
            <div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description}</p></div><a href="/chuyen-khoa">Xem tất cả chuyên khoa →</a></div>
              <div className="homeSpecialtyShowcase">
                <div className="homeDepartmentColumn"><div className="homeDepartmentList homeSpecialtyOnlyList">{specialties.slice(0, 7).map((specialty: any) => <a href={`/chuyen-khoa/${specialty.slug}`} key={specialty.id}><span>✚</span><strong>{specialty.name}</strong><i>›</i></a>)}{specialties.length === 0 && <div className="professionalEmpty">Chưa có chuyên khoa được công khai.</div>}</div></div>
                <div className="homeCarePhoto" style={{ backgroundImage: `url("${introImage}")` }} aria-label="Hình ảnh chuyên khoa" />
                {medproCard.enabled !== false && <div className="homeBookingCard" style={{ background: medproCard.backgroundColor || undefined }}><span className="sectionKicker">{medproCard.eyebrow || 'ĐẶT LỊCH KHÁM QUA MEDPRO'}</span><h3>{medproCard.title || 'Chủ động thời gian – Giảm thời gian chờ đợi'}</h3><ul>{[medproCard.bullet1 || 'Đặt lịch nhanh chóng', medproCard.bullet2 || 'Chọn bác sĩ theo nhu cầu', medproCard.bullet3 || 'Nhận nhắc hẹn tự động'].filter(Boolean).map((text: string) => <li key={text}>{text}</li>)}</ul><strong className="medproWord">{medproCard.brandText || 'Medpro'}</strong><a href={medproCardUrl} target={medproCard.openNewTab === false ? undefined : '_blank'} rel={medproCard.openNewTab === false ? undefined : 'noreferrer'}>{medproCard.buttonLabel || 'ĐẶT LỊCH NGAY'} <span>→</span></a>{medproCard.guideLabel !== '' && <a className="bookingGuide" href={medproCard.guideUrl || '/lich-kham'}>{medproCard.guideLabel || 'Hướng dẫn đặt lịch khám'}</a>}</div>}
              </div>
            </div>
          </section>

          if (type === 'featured-news') return <section className="sectionPro configurableHomeSection homeFeaturedSection" style={style} key={key}>
            <div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description}</p></div><a href="/tim-kiem">Xem tất cả →</a></div><FeaturedContentCarousel items={featuredItems} interval={featuredInterval} /></div>
          </section>

          if (type === 'news-portal') return <section className="sectionPro configurableHomeSection homePortalNewsSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/tin-tuc">Xem toàn bộ bài viết →</a></div><HomeNewsTabs items={news.map((article) => ({ id: article.id, title: article.title, slug: article.slug, excerpt: article.excerpt, category: article.category, date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : '', coverUrl: mediaUrl(article.cover || article.seoImage) || defaultMedia.news }))} tabs={contentTabsFor('news-portal')} /></div></section>

          if (type === 'notices') return <section className="sectionPro configurableHomeSection homeNoticeSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/thong-bao">Xem tất cả →</a></div>{notices.length > 0 ? <div className="homeEditorialGrid">{notices.slice(0, 5).map((notice, noticeIndex) => { const cover = mediaUrl(notice.cover || notice.seoImage) || defaultMedia.notices; return <a href={`/thong-bao/${notice.slug}`} className={noticeIndex === 0 ? 'featured' : ''} key={notice.id}><div className="homeEditorialImage" style={{ backgroundImage: `url("${cover}")` }}><span>THÔNG BÁO</span></div><div className="homeEditorialCopy"><small>{notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString('vi-VN') : (notice.startAt ? new Date(notice.startAt).toLocaleDateString('vi-VN') : 'Mới cập nhật')}</small><h3>{notice.title}</h3><p>{notice.excerpt || 'Thông tin mới được cập nhật từ Bệnh viện Đa khoa Khu vực Thới Lai.'}</p></div></a> })}</div> : <div className="professionalEmpty">Chưa có thông báo được đăng.</div>}</div></section>

          if (type === 'procurement') return <section className="sectionPro configurableHomeSection homeProcurementSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/dau-thau-mua-sam">Xem tất cả →</a></div>{procurement.length > 0 ? <div className="homeEditorialGrid">{procurement.slice(0, 5).map((entry, entryIndex) => { const cover = mediaUrl(entry.cover || entry.seoImage) || defaultMedia.procurement; return <a href={`/dau-thau-mua-sam/${entry.slug}`} className={entryIndex === 0 ? 'featured' : ''} key={entry.id}><div className="homeEditorialImage" style={{ backgroundImage: `url("${cover}")` }}><span>ĐẤU THẦU – MUA SẮM</span></div><div className="homeEditorialCopy"><small>{entry.publishedAt ? new Date(entry.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}</small><h3>{entry.title}</h3><p>{entry.excerpt || entry.summary || 'Thông tin công khai về đấu thầu và mua sắm của bệnh viện.'}</p></div></a> })}</div> : <div className="professionalEmpty">Chưa có hồ sơ đấu thầu – mua sắm.</div>}</div></section>

          if (type === 'schedules') return <section className="sectionPro configurableHomeSection homeScheduleSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description}</p></div><a href="/lich-kham">Xem tất cả →</a></div><ScheduleExplorer daily={homeDailySchedules} weekly={homeWeeklySchedules} attachments={homeAttachedSchedules} medpro={medpro} tabOrder={scheduleTabOrder.length ? scheduleTabOrder : undefined} tabs={scheduleTabs.length ? scheduleTabs : undefined} compact /></div></section>

          if (type === 'vaccinations') return <section className="sectionPro configurableHomeSection homeVaccinationSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description}</p></div><a href="/tiem-chung">Xem tất cả →</a></div><VaccinationTabs announcements={homeVaccinationAnnouncements} campaigns={homeVaccinationCampaigns} vaccines={homeVaccines} medpro={medpro} tabOrder={vaccinationTabOrder.length ? vaccinationTabOrder : undefined} tabs={vaccinationTabs.length ? vaccinationTabs : undefined} compact /></div></section>

          if (type === 'science') return <section className="sectionPro configurableHomeSection homeScienceSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/tin-tuc">Xem thêm hoạt động →</a></div><HomeScienceTabs items={news.map((article) => ({ id: article.id, title: article.title, slug: article.slug, category: article.category, excerpt: article.excerpt, date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : '', coverUrl: mediaUrl(article.cover || article.seoImage) || defaultMedia.news }))} tabs={contentTabsFor('science')} /></div></section>

          if (type === 'documents') return <section className="sectionPro configurableHomeSection homeDocumentsSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description}</p></div><a href="/van-ban">Xem tất cả →</a></div>{documents.length > 0 ? <div className="homeEditorialGrid">{documents.slice(0, 5).map((document, documentIndex) => { const cover = mediaUrl(document.cover || document.seoImage) || defaultMedia.documents; const fileUrl = mediaUrl(document.file); return <a href={fileUrl || '/van-ban'} target={fileUrl ? '_blank' : undefined} rel={fileUrl ? 'noopener noreferrer' : undefined} className={documentIndex === 0 ? 'featured' : ''} key={document.id}><div className="homeEditorialImage" style={{ backgroundImage: `url("${cover}")` }}><span>VĂN BẢN – TÀI LIỆU</span></div><div className="homeEditorialCopy"><small>{document.issuedAt ? new Date(document.issuedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}</small><h3>{document.title}</h3><p>{document.summary || [document.number, document.issuer].filter(Boolean).join(' · ') || 'Văn bản, biểu mẫu và tài liệu được bệnh viện công khai.'}</p></div></a> })}</div> : <div className="professionalEmpty">Chưa có văn bản được đăng.</div>}</div></section>


          if (type === 'content-section') {
            const relationId = typeof item.linkedContentSection === 'object' ? item.linkedContentSection?.id : item.linkedContentSection
            const linkedSection = contentSections.find((section: any) => String(section.id) === String(relationId)) || (typeof item.linkedContentSection === 'object' ? item.linkedContentSection : null)
            if (!linkedSection) return null
            const limit = Math.min(12, Math.max(1, Number(item.linkedContentLimit || 5)))
            const sectionPosts = customPosts.filter((post: any) => String(typeof post.section === 'object' ? post.section?.id : post.section) === String(linkedSection.id)).slice(0, limit)
            const fallback = mediaUrl(linkedSection.defaultImage || linkedSection.seoImage)
            const sectionHref = `/${linkedSection.slug}`
            return <section className="sectionPro configurableHomeSection homeDynamicContentSection" style={style} key={key}>
              <div className="container">
                <div className="homeSectionHead"><div><span className="sectionKicker">{item.eyebrow || 'NỘI DUNG'}</span><h2>{item.title || linkedSection.title}</h2><p>{item.description || linkedSection.description || `Các bài viết mới thuộc mục ${linkedSection.title}.`}</p></div><a href={sectionHref}>Xem tất cả →</a></div>
                {sectionPosts.length > 0 ? <div className="homeEditorialGrid">{sectionPosts.map((post: any, postIndex: number) => { const cover = mediaUrl(post.cover || post.seoImage) || fallback; return <a href={`${sectionHref}/${post.slug}`} className={postIndex === 0 ? 'featured' : ''} key={post.id}><div className="homeEditorialImage" style={{ backgroundImage: `url("${cover}")` }}><span>{String(linkedSection.title || 'NỘI DUNG').toUpperCase()}</span></div><div className="homeEditorialCopy"><small>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}</small><h3>{post.title}</h3><p>{post.excerpt || `Thông tin mới thuộc mục ${linkedSection.title}.`}</p></div></a> })}</div> : <div className="professionalEmpty">Chưa có bài viết trong mục {linkedSection.title}.</div>}
              </div>
            </section>
          }

          if (type === 'dynamic-module') {
            const module = typeof item.dynamicModule === 'object' ? item.dynamicModule : null
            if (!module || module.active === false) return null
            const image = mediaUrl(module.image, 'article')
            return <section className="sectionPro configurableHomeSection customHomepageSection" style={style} key={key}><div className={`container customHomepageLayout left ${image ? 'hasImage' : 'withoutImage'}`}>{image && <div className="customHomepageImage"><img src={image} alt={module.title || cfg.title || 'Hình ảnh module'} /></div>}<div className="customHomepageContent">{(cfg.eyebrow || module.eyebrow) && <span className="sectionKicker">{cfg.eyebrow || module.eyebrow}</span>}<h2>{cfg.title || module.title}</h2>{(cfg.description || module.description) && <p className="sectionDescription">{cfg.description || module.description}</p>}{module.content && <div className="customRichText"><RichText data={module.content} /></div>}{module.buttonLabel && module.buttonUrl && <a className="homeSolidButton customSectionButton" href={module.buttonUrl}>{module.buttonLabel} →</a>}</div></div></section>
          }

          if (type === 'custom') {
            const image = mediaUrl(item.customImage, 'article')
            return <section className="sectionPro configurableHomeSection customHomepageSection" style={style} key={key}><div className={`container customHomepageLayout ${item.imagePosition || 'left'} ${image ? 'hasImage' : 'withoutImage'}`}>{image && <div className="customHomepageImage"><img src={image} alt={item.title || 'Hình ảnh mục trang chủ'} /></div>}<div className="customHomepageContent">{item.eyebrow && <span className="sectionKicker">{item.eyebrow}</span>}{item.title && <h2>{item.title}</h2>}{item.description && <p className="sectionDescription">{item.description}</p>}{item.customContent && <div className="customRichText"><RichText data={item.customContent} /></div>}{item.buttonLabel && item.buttonUrl && <a className="homeSolidButton customSectionButton" href={item.buttonUrl}>{item.buttonLabel} →</a>}</div></div></section>
          }

          return null
        })}
      </div>

      <SiteFooter />
    </main>
  )
}
