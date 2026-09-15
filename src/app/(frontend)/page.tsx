import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { HomeNewsTabs } from '@/components/HomeNewsTabs'
import { HomeScienceTabs } from '@/components/HomeScienceTabs'
import { RichText } from '@/components/RichText'
import { ScheduleExplorer } from '@/components/ScheduleExplorer'
import { VaccinationTabs } from '@/components/VaccinationTabs'
import { HeroBannerCarousel } from '@/components/HeroBannerCarousel'
import { FeaturedContentCarousel } from '@/components/FeaturedContentCarousel'
import { AdvancedTechniquesCarousel } from '@/components/AdvancedTechniquesCarousel'
import { OurExpertsCarousel } from '@/components/OurExpertsCarousel'
import { SpecialtiesCarousel } from '@/components/SpecialtiesCarousel'
import { HomeScrollSnapHandler } from '@/components/HomeScrollSnapHandler'
import { getCMS, getGlobal, getHomepage } from '@/lib/payload'
import { mediaFormat, mediaLabel, mediaUrl } from '@/lib/media'
import { getDefaultContentMedia, scientificActivityGroupName } from '@/lib/defaultMedia'
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
  let clinicalProtocols: any[] = []
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
  let advancedTechniques: any[] = []
  let ourExpertsList: any[] = []
  let scientificActivities: any[] = []
  let scientificActivityGroups: any[] = []
  let siteSettings: any = {}
  let quickLinksSettings: any = {}
  let defaultMedia: any = { news: '/default-content/news.svg', notices: '/default-content/notices.svg', procurement: '/default-content/procurement.svg' }
  let totals = { news: 0, notices: 0, doctors: 0, departments: 0, services: 0 }

  try {
    const [payload, homepage, settings, contentDefaults, quickSettings] = await Promise.all([
      getCMS(),
      getHomepage().catch((e: any) => { console.error('[HomePage] getHomepage error:', e?.cause?.message || e?.message || e); return {} }),
      getGlobal('site-settings').catch((e: any) => { console.error('[HomePage] site-settings error:', e?.cause?.message || e?.message || e); return {} }),
      getDefaultContentMedia().catch(() => ({ news: '/default-content/news.svg', notices: '/default-content/notices.svg', procurement: '/default-content/procurement.svg' })),
      getGlobal('quick-links-settings').catch(() => ({})),
    ])
    home = homepage || {}
    siteSettings = settings || {}
    defaultMedia = contentDefaults
    quickLinksSettings = quickSettings || {}

    const [newsResult, noticeResult, procurementResult, documentResult, clinicalProtocolsResult, doctorResult, departmentResult, specialtyResult, serviceResult, scheduleResult, vaccinationScheduleResult, vaccineResult, vaccinePriceResult, contentSectionResult, customPostResult, advancedTechniquesResult, ourExpertsResult, scientificActivitiesResult, scientificActivityGroupsResult] = await Promise.all([
      payload.find({ collection: 'news', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 100, depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'notices', where: { and: [{ _status: { equals: 'published' } }, { showOnHome: { equals: true } }] }, sort: '-startAt', limit: 6, depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'procurement', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 6, depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'documents', sort: '-issuedAt', limit: 12, depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'clinical-protocols' as any, sort: '-issuedAt', limit: 12, depth: 2 }).catch(() => ({ docs: [] })),
      payload.find({ collection: 'doctors', where: { active: { equals: true } }, limit: 50, sort: ['order', 'name'], depth: 2 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'departments', limit: 100, sort: 'name', depth: 0 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'specialties', where: { active: { equals: true } }, limit: 100, sort: 'order', depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'services', where: { active: { equals: true } }, limit: 8, sort: 'name', depth: 0 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'schedules', where: { active: { equals: true } }, limit: 100, sort: '-createdAt', depth: 2 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'vaccinationSchedules', where: { active: { equals: true } }, limit: 200, sort: '-date', depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'vaccines', where: { active: { equals: true } }, limit: 200, sort: 'name', depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'vaccinePrices', where: { active: { equals: true } }, limit: 1000, sort: '-effectiveFrom', depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'content-sections', where: { and: [{ active: { equals: true } }, { _status: { equals: 'published' } }] }, limit: 100, sort: 'title', depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'custom-posts', where: { _status: { equals: 'published' } }, limit: 300, sort: '-publishedAt', depth: 2 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'advanced-techniques', where: { active: { equals: true } }, limit: 50, sort: ['order', 'title'], depth: 1 }).catch(() => ({ docs: [], totalDocs: 0 })),
      payload.find({ collection: 'our-experts', where: { active: { equals: true } }, limit: 50, sort: ['order', 'name'], depth: 2 }).catch(() => ({ docs: [] })),
      payload.find({ collection: 'scientific-activities', where: { _status: { equals: 'published' } }, limit: 100, sort: ['-featured', '-publishedAt'], depth: 1 }).catch(() => ({ docs: [] })),
      payload.find({ collection: 'scientific-activity-groups', where: { active: { equals: true } }, limit: 100, sort: ['order', 'name'], depth: 0 }).catch(() => ({ docs: [] })),
    ])
    news = newsResult.docs as any[]
    notices = noticeResult.docs as any[]
    procurement = procurementResult.docs as any[]
    documents = documentResult.docs as any[]
    clinicalProtocols = (clinicalProtocolsResult?.docs || []) as any[]
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
    advancedTechniques = advancedTechniquesResult.docs as any[]
    ourExpertsList = (ourExpertsResult?.docs || []) as any[]
    scientificActivities = (scientificActivitiesResult?.docs || []) as any[]
    scientificActivityGroups = (scientificActivityGroupsResult?.docs || []) as any[]
    totals = { news: newsResult.totalDocs, notices: noticeResult.totalDocs, doctors: doctorResult.totalDocs, departments: departmentResult.totalDocs, services: serviceResult.totalDocs }
  } catch (err) {
    console.error('[HomePage] Error loading initial data:', err)
  }

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

  const rawSections = Array.isArray(home?.sections) && home.sections.length > 0 ? [...home.sections] : []
  // Nếu database đã lưu sections từ trước nhưng chưa có advanced-techniques, tự động chèn vào để hiển thị ngay
  if (!rawSections.some((s: any) => s?.type === 'advanced-techniques')) {
    const defaultTechSection = {
      type: 'advanced-techniques',
      eyebrow: 'CHUYÊN KHOA & CÔNG NGHỆ Y TẾ',
      title: 'Kỹ thuật chuyên sâu',
      description: 'Tiên phong ứng dụng các kỹ thuật cao, trang thiết bị hiện đại phục vụ chăm sóc và điều trị.',
      visible: true,
      techniqueItemsPerView: 3,
      techniqueAutoplaySeconds: 5,
      cardBarBgColor: '#f0f7fd',
      cardBarTextColor: '#0754a8',
      techniqueItems: [
        {
          title: 'Ứng dụng các kỹ thuật hiện đại trong điều trị bệnh da',
          badge: 'Phòng khám Da - Thẩm mỹ Da',
          image: '',
          url: '/chuyen-khoa',
          visible: true,
        },
        {
          title: 'Ứng dụng kỹ thuật quang - điện (TruScreen) trong tầm soát ung thư cổ tử cung',
          badge: 'Tầm soát chuyên sâu',
          image: '',
          url: '/chuyen-khoa',
          visible: true,
        },
        {
          title: 'Kỹ thuật truyền dịch vào buồng ối',
          badge: 'Sản phụ khoa',
          image: '',
          url: '/chuyen-khoa',
          visible: true,
        },
      ],
    }
    const featuredIdx = rawSections.findIndex((s: any) => s?.type === 'featured-news' || s?.type === 'news')
    if (featuredIdx >= 0) {
      rawSections.splice(featuredIdx + 1, 0, defaultTechSection)
    } else {
      rawSections.unshift(defaultTechSection)
    }
  }

  // Nếu database đã lưu sections từ trước nhưng chưa có our-experts, tự động chèn vào để hiển thị ngay
  if (!rawSections.some((s: any) => s?.type === 'our-experts')) {
    const defaultExpertsSection = {
      type: 'our-experts',
      eyebrow: 'ĐỘI NGŨ Y BÁC SĨ',
      title: 'Chuyên gia của chúng tôi',
      description: 'Đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn sâu, luôn tận tâm vì sức khỏe người bệnh.',
      visible: true,
      expertItemsPerView: 4,
      expertAutoplaySeconds: 5,
      expertCardBgColor: '#f0f7fd',
      expertCardTextColor: '#0754a8',
      expertItems: [],
    }
    const techIdx = rawSections.findIndex((s: any) => s?.type === 'advanced-techniques')
    if (techIdx >= 0) {
      rawSections.splice(techIdx + 1, 0, defaultExpertsSection)
    } else {
      rawSections.push(defaultExpertsSection)
    }
  }

  // Tự động sắp xếp vị trí hiển thị đẹp mắt: nếu advanced-techniques và our-experts đang nằm ở cuối cùng (do được thêm mới sau),
  // di chuyển chúng lên ngay sau mục Tin tức nổi bật (featured-news) để người dùng dễ nhìn thấy ngay khi vào trang chủ
  const techSectionIdx = rawSections.findIndex((s: any) => s?.type === 'advanced-techniques')
  if (techSectionIdx > 2) {
    const [techSec] = rawSections.splice(techSectionIdx, 1)
    const fIdx = rawSections.findIndex((s: any) => s?.type === 'featured-news' || s?.type === 'news')
    rawSections.splice(fIdx >= 0 ? fIdx + 1 : 1, 0, techSec)
  }
  const expertSectionIdx = rawSections.findIndex((s: any) => s?.type === 'our-experts')
  if (expertSectionIdx > 3) {
    const [expSec] = rawSections.splice(expertSectionIdx, 1)
    const tIdx = rawSections.findIndex((s: any) => s?.type === 'advanced-techniques')
    rawSections.splice(tIdx >= 0 ? tIdx + 1 : 2, 0, expSec)
  }

  const configuredSections = rawSections
  const sectionDefaults: Record<string, { eyebrow: string; title: string; description?: string; order: number }> = {
    'featured-news': { eyebrow: 'TIN TỨC', title: 'Tin tức & hoạt động', description: 'Cập nhật hoạt động nổi bật và thông tin chuyên môn mới nhất.', order: 0 },
    'advanced-techniques': { eyebrow: '', title: 'Kỹ thuật chuyên sâu', description: '', order: 1 },
    'our-experts': { eyebrow: 'ĐỘI NGŨ Y BÁC SĨ', title: 'Chuyên gia của chúng tôi', description: '', order: 2 },
    'news-portal': { eyebrow: 'CỔNG THÔNG TIN BỆNH VIỆN', title: 'Các chuyên mục tin tức', order: 3 },
    organization: { eyebrow: 'CHUYÊN KHOA', title: 'Hệ thống chuyên khoa', description: 'Đội ngũ tận tâm, quy trình chuyên nghiệp và trang thiết bị phù hợp.', order: 3 },
    notices: { eyebrow: 'THÔNG BÁO', title: 'Thông báo mới', description: 'Thông tin dành cho người bệnh và cộng đồng.', order: 4 },
    procurement: { eyebrow: 'CÔNG KHAI', title: 'Đấu thầu – Mua sắm', description: 'Thông tin mời thầu và kết quả mua sắm.', order: 5 },
    schedules: { eyebrow: 'LỊCH KHÁM BỆNH', title: 'Chủ động trước khi đến khám', description: 'Tra cứu bác sĩ, chuyên khoa, thời gian và phòng khám.', order: 6 },
    vaccinations: { eyebrow: 'LỊCH TIÊM CHỦNG', title: 'Thông tin tiêm ngừa', description: 'Lịch tiêm, đợt tiêm và danh mục vắc xin tại bệnh viện.', order: 7 },
    science: { eyebrow: 'HOẠT ĐỘNG NỔI BẬT', title: 'Chuyên môn – Đào tạo', order: 8 },
    introduction: { eyebrow: home?.intro?.eyebrow || 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI', title: home?.intro?.title || 'Tận tâm chăm sóc sức khỏe cộng đồng', description: home?.intro?.description, order: 9 },
    documents: { eyebrow: 'TÀI LIỆU CÔNG KHAI', title: 'Văn bản mới', description: 'Quyết định, biểu mẫu và tài liệu được cập nhật từ hệ thống quản trị.', order: 10 },
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

  const homeEmergencySchedules = schedules.filter(item => item.mode === 'emergency').map(item => ({ id: item.id, title: item.title, summary: item.summary, note: item.note, emergencyWeekStart: item.emergencyWeekStart, emergencyWeekEnd: item.emergencyWeekEnd, imageUrl: mediaUrl(item.coverImage || item.scheduleImage) || defaultMedia.schedules, href: `/lich-kham/${item.id}` }))
  const homeDailySchedules = schedules.filter(item => !item.mode || item.mode === 'daily').map(item => ({ id: item.id, title: item.title, summary: item.summary, doctor: item.doctor?.name || item.dailyAssignments?.[0]?.doctor?.name, department: item.department?.name || item.dailyAssignments?.[0]?.department?.name, date: item.date, startTime: item.startTime || item.dailyAssignments?.[0]?.startTime, endTime: item.endTime || item.dailyAssignments?.[0]?.endTime, room: item.room || item.dailyAssignments?.[0]?.room, note: item.note, imageUrl: mediaUrl(item.coverImage) || defaultMedia.schedules }))
  const homeWeeklySchedules = schedules.filter(item => item.mode === 'weekly').map(item => ({ id: item.id, title: item.title, summary: item.summary, weekStart: item.weekStart, weekEnd: item.weekEnd, note: item.note, imageUrl: mediaUrl(item.coverImage) || defaultMedia.schedules, slots: (item.weeklySlots || []).map((slot: any) => ({ id: slot.id, dayOfWeek: slot.dayOfWeek, doctor: slot.doctor?.name || 'Bác sĩ', department: slot.department?.name || '', startTime: slot.startTime, endTime: slot.endTime, room: slot.room, note: slot.note })) }))
  const homeAttachedSchedules = schedules.filter(item => item.mode === 'attachment').map(item => ({ id: item.id, title: item.title, summary: item.summary, note: item.note, validFrom: item.validFrom, validTo: item.validTo, imageUrl: mediaUrl(item.coverImage || item.scheduleImage) || defaultMedia.schedules, fileUrl: mediaUrl(item.scheduleFile), fileName: mediaLabel(item.scheduleFile), fileFormat: mediaFormat(item.scheduleFile) }))
  const configuredScheduleOrder = (sectionConfig('schedules')?.scheduleTabOrder || []).filter((tab: any) => tab.visible !== false)
  const defaultHomeScheduleTabs = [
    { label: 'Lịch trực cấp cứu', kind: 'emergency', tab: 'emergency', visible: true },
    { label: 'Theo ngày', kind: 'daily', tab: 'daily', visible: true },
    { label: 'Theo tuần', kind: 'weekly', tab: 'weekly', visible: true },
    { label: 'Lịch đính kèm', kind: 'attachments', tab: 'attachments', visible: true },
  ]
  const rawScheduleTabs = configuredScheduleOrder.length ? configuredScheduleOrder : defaultHomeScheduleTabs
  // Nếu database đã lưu danh sách tab từ trước mà chưa có 'emergency', tự động bổ sung tab 'emergency' lên đầu nếu có lịch trực cấp cứu
  const hasEmergencyTab = rawScheduleTabs.some((t: any) => (t.tab || t.kind) === 'emergency')
  const mergedScheduleTabs = (!hasEmergencyTab && homeEmergencySchedules.length > 0)
    ? [{ label: 'Lịch trực cấp cứu', kind: 'emergency', tab: 'emergency', visible: true }, ...rawScheduleTabs]
    : rawScheduleTabs

  const scheduleTabOrder = mergedScheduleTabs.filter((item: any) => item.visible !== false && (item.tab || item.kind)).map((item: any) => item.tab || item.kind)
  const scheduleTabs = mergedScheduleTabs.filter((tab: any) => tab.visible !== false).map((tab: any, tabIndex: number) => ({
    label: tab.label?.trim(),
    kind: tab.tab || tab.kind,
    manualItems: (tab.manualItems || []).filter((entry: any) => entry.title?.trim()).map((entry: any, itemIndex: number) => ({ id: entry.id || `manual-schedule-${tabIndex}-${itemIndex}`, title: entry.title, summary: entry.description, imageUrl: mediaUrl(entry.image, 'card'), href: entry.url || '/lich-kham' })),
  })).filter((tab: any) => tab.label || tab.kind || tab.manualItems.length)

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
  const vaccinationTabs = (sectionConfig('vaccinations')?.vaccinationTabOrder || []).filter((tab: any) => tab.visible !== false).map((tab: any, tabIndex: number) => ({
    label: tab.label?.trim(),
    kind: tab.tab,
    manualItems: (tab.manualItems || []).filter((entry: any) => entry.title?.trim()).map((entry: any, itemIndex: number) => ({ id: entry.id || `manual-vaccine-${tabIndex}-${itemIndex}`, title: entry.title, summary: entry.description, imageUrl: mediaUrl(entry.image, 'card'), href: entry.url || '/tiem-chung' })),
  })).filter((tab: any) => tab.label || tab.kind || tab.manualItems.length)


  const fnConfig = sectionConfig('featured-news') as any
  const fnSources = (Array.isArray(fnConfig?.featuredSources) && fnConfig.featuredSources.length > 0)
    ? fnConfig.featuredSources
    : [
        { source: 'news', limit: 8, enabled: true },
        { source: 'notices', limit: 6, enabled: true },
        { source: 'procurement', limit: 4, enabled: true },
        { source: 'schedules', limit: 0, enabled: false },
      ]
  const fnFilterMode = fnConfig?.featuredFilterMode || 'all'

  const dynamicFeaturedItems: any[] = []

  for (const src of fnSources) {
    if (src.enabled === false) continue
    const limit = Math.max(1, Number(src.limit || 6))
    const customBadge = (src.customBadge || '').trim()

    if (src.source === 'news') {
      let filteredNews = news
      if (fnFilterMode === 'only-featured') {
        filteredNews = filteredNews.filter((item: any) => item.featured === true)
      }
      const items = filteredNews.slice(0, limit).map((item: any) => ({
        id: `news-${item.id}`,
        title: item.title,
        excerpt: item.excerpt,
        image: mediaUrl(item.cover || item.seoImage) || defaultMedia.news,
        imageFit: item.coverFit || fnConfig?.featuredCardFit || 'cover',
        imagePosition: item.coverPosition ? (item.coverPosition === 'center' ? 'center center' : (item.coverPosition === 'bottom' ? 'center bottom' : 'top center')) : undefined,
        href: `/tin-tuc/${item.slug}`,
        kind: customBadge || (typeof item.categoryRef === 'object' && item.categoryRef?.name ? item.categoryRef.name.toUpperCase() : (item.category ? item.category.toUpperCase() : 'TIN TỨC')),
        dateValue: item.publishedAt || item.updatedAt,
        date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
      }))
      dynamicFeaturedItems.push(...items)
    } else if (src.source === 'news-category') {
      const targetCatId = typeof src.categoryRef === 'object' ? String(src.categoryRef?.id || '') : String(src.categoryRef || '')
      const targetCatName = (typeof src.categoryRef === 'object' ? src.categoryRef?.name : src.categoryName || '').trim().toLowerCase()

      let matchingNews = news.filter((item: any) => {
        const itemCatId = typeof item.categoryRef === 'object' ? String(item.categoryRef?.id || '') : String(item.categoryRef || '')
        const itemCatName = (typeof item.categoryRef === 'object' ? item.categoryRef?.name : item.category || '').trim().toLowerCase()
        if (targetCatId && itemCatId && targetCatId === itemCatId) return true
        if (targetCatName && itemCatName && (itemCatName === targetCatName || itemCatName.includes(targetCatName))) return true
        return false
      })

      if (fnFilterMode === 'only-featured') {
        matchingNews = matchingNews.filter((item: any) => item.featured === true)
      }

      const defaultBadge = (typeof src.categoryRef === 'object' && src.categoryRef?.name) || src.categoryName || 'TIN TỨC'
      const items = matchingNews.slice(0, limit).map((item: any) => ({
        id: `news-cat-${item.id}`,
        title: item.title,
        excerpt: item.excerpt,
        image: mediaUrl(item.cover || item.seoImage) || defaultMedia.news,
        imageFit: item.coverFit || fnConfig?.featuredCardFit || 'cover',
        imagePosition: item.coverPosition ? (item.coverPosition === 'center' ? 'center center' : (item.coverPosition === 'bottom' ? 'center bottom' : 'top center')) : undefined,
        href: `/tin-tuc/${item.slug}`,
        kind: customBadge || defaultBadge.toUpperCase(),
        dateValue: item.publishedAt || item.updatedAt,
        date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
      }))
      dynamicFeaturedItems.push(...items)
    } else if (src.source === 'notices') {
      const items = notices.slice(0, limit).map((item: any) => ({
        id: `notice-${item.id}`,
        title: item.title,
        excerpt: item.excerpt,
        image: mediaUrl(item.cover || item.seoImage) || defaultMedia.notices,
        imageFit: item.coverFit || fnConfig?.featuredCardFit || 'cover',
        imagePosition: item.coverPosition ? (item.coverPosition === 'center' ? 'center center' : (item.coverPosition === 'bottom' ? 'center bottom' : 'top center')) : undefined,
        href: `/thong-bao/${item.slug}`,
        kind: customBadge || 'THÔNG BÁO',
        dateValue: item.publishedAt || item.startAt || item.updatedAt,
        date: (item.publishedAt || item.startAt) ? new Date(item.publishedAt || item.startAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
      }))
      dynamicFeaturedItems.push(...items)
    } else if (src.source === 'procurement') {
      const items = procurement.slice(0, limit).map((item: any) => ({
        id: `procurement-${item.id}`,
        title: item.title,
        excerpt: item.excerpt || item.summary,
        image: mediaUrl(item.cover || item.seoImage) || defaultMedia.procurement,
        imageFit: item.coverFit || fnConfig?.featuredCardFit || 'cover',
        imagePosition: item.coverPosition ? (item.coverPosition === 'center' ? 'center center' : (item.coverPosition === 'bottom' ? 'center bottom' : 'top center')) : undefined,
        href: `/dau-thau-mua-sam/${item.slug}`,
        kind: customBadge || 'ĐẤU THẦU – MUA SẮM',
        dateValue: item.publishedAt || item.updatedAt,
        date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
      }))
      dynamicFeaturedItems.push(...items)
    } else if (src.source === 'schedules') {
      const items = schedules.slice(0, limit).map((item: any) => ({
        id: `schedule-${item.id}`,
        title: item.title,
        excerpt: item.summary || item.note || 'Lịch khám mới được cập nhật từ bệnh viện.',
        image: mediaUrl(item.coverImage || item.scheduleImage) || defaultMedia.schedules,
        imageFit: fnConfig?.featuredCardFit || 'cover',
        href: `/lich-kham/${item.id}`,
        kind: customBadge || (item.mode === 'emergency' ? 'LỊCH TRỰC CẤP CỨU' : 'LỊCH KHÁM'),
        dateValue: item.date || item.validFrom || item.weekStart || item.emergencyWeekStart || item.updatedAt,
        date: (item.date || item.validFrom || item.weekStart || item.emergencyWeekStart) ? new Date(item.date || item.validFrom || item.weekStart || item.emergencyWeekStart).toLocaleDateString('vi-VN') : 'Mới cập nhật',
      }))
      dynamicFeaturedItems.push(...items)
    } else if (src.source === 'documents') {
      const items = documents.slice(0, limit).map((item: any) => ({
        id: `doc-${item.id}`,
        title: item.title,
        excerpt: item.summary || [item.number, item.issuer].filter(Boolean).join(' · ') || 'Văn bản, biểu mẫu của bệnh viện.',
        image: mediaUrl(item.cover || item.seoImage) || defaultMedia.documents,
        imageFit: item.coverFit || fnConfig?.featuredCardFit || 'cover',
        imagePosition: item.coverPosition ? (item.coverPosition === 'center' ? 'center center' : (item.coverPosition === 'bottom' ? 'center bottom' : 'top center')) : undefined,
        href: item.slug ? `/van-ban/${item.slug}` : (mediaUrl(item.file) || '/van-ban'),
        kind: customBadge || 'VĂN BẢN',
        dateValue: item.issuedAt || item.updatedAt,
        date: item.issuedAt ? new Date(item.issuedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
      }))
      dynamicFeaturedItems.push(...items)
    }
  }

  // Khử trùng lặp ID (nếu có bài thuộc cả 2 nguồn)
  const uniqueFeaturedItemsMap = new Map<string, any>()
  for (const it of dynamicFeaturedItems) {
    if (!uniqueFeaturedItemsMap.has(it.id)) {
      uniqueFeaturedItemsMap.set(it.id, it)
    }
  }

  const featuredItems = Array.from(uniqueFeaturedItemsMap.values())
    .sort((a: any, b: any) => new Date(b.dateValue || 0).getTime() - new Date(a.dateValue || 0).getTime())
    .slice(0, featuredItemLimit)

  // ── HÀM RENDER SECTION THEO MẪU BỐ CỤC (đọc từ Admin config) ──
  // Mỗi section notices/procurement/documents/content-section đều gọi hàm này
  // để render theo layout đã chọn trong Admin → Homepage → section → "Mẫu bố cục"
  function renderEditorialSection(params: {
    items: any[]
    layout?: string
    showDate?: boolean
    showCategory?: boolean
    showExcerpt?: boolean
    badgeOverride?: string
    emptyText?: string
  }) {
    const {
      items,
      layout = 'editorial-grid',
      showDate = true,
      showCategory = true,
      showExcerpt = true,
      badgeOverride,
      emptyText = 'Chưa có nội dung.',
    } = params

    if (!items || items.length === 0) return <div className="professionalEmpty">{emptyText}</div>

    // ── MẪU 1: Editorial Grid (chuẩn thông báo — 1 lớn + nhiều nhỏ) ──
    if (layout === 'editorial-grid') {
      const editorialSlots = Array.from({ length: 5 }, (_, index) => items[index] || null)
      return (
        <div className="homeEditorialGrid">
          {editorialSlots.map((entry: any, idx: number) => {
            if (!entry) return <div className="homeEditorialEmptyCard" aria-hidden="true" key={`empty-${idx}`} />
            const isMain = idx === 0
            const fit = entry.coverFit === 'fill' ? 'fill' : (entry.coverFit === 'contain' ? 'contain' : 'cover')
            const pos = entry.coverFit === 'cover-top' || entry.coverPosition === 'top'
              ? 'top center'
              : (entry.coverFit === 'cover-bottom' || entry.coverPosition === 'bottom'
                ? 'bottom center'
                : 'center center')
            if (isMain) {
              // Ô lớn: ảnh trên (kèm badge), nội dung dưới (kèm excerpt)
              return (
                <a
                  href={entry.href}
                  className="featured"
                  key={entry.id}
                >
                  <div
                    className="homeEditorialImage"
                    style={{
                      background: entry.coverFit === 'contain' ? '#eaf4fc' : undefined,
                    }}
                  >
                    <img
                      src={entry.cover}
                      alt={entry.title}
                      className="editorialImg"
                      loading="lazy"
                      style={{
                        objectFit: fit,
                        objectPosition: pos,
                      }}
                    />
                    {showCategory && (
                      <span>{badgeOverride || entry.category || 'NỘI DUNG'}</span>
                    )}
                  </div>
                  <div className="homeEditorialCopy">
                    {showDate && <small>{entry.date || 'Mới cập nhật'}</small>}
                    <h3>{entry.title}</h3>
                    {showExcerpt && <p>{entry.excerpt || ''}</p>}
                  </div>
                </a>
              )
            }
            // 4 ô nhỏ: giữ nguyên layout dọc (ảnh trên, text dưới)
            return (
              <a
                href={entry.href}
                className=""
                key={entry.id}
                style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
              >
                <div
                  className="homeEditorialImage"
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 10.5',
                    maxHeight: '175px',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: entry.coverFit === 'contain' ? '#f4f8fb' : undefined,
                  }}
                >
                  <img
                    src={entry.cover}
                    alt={entry.title}
                    className="editorialImg"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: fit,
                      objectPosition: pos,
                      display: 'block',
                    }}
                  />
                </div>
                <div
                  className="homeEditorialCopy"
                  style={{
                    padding: '16px 18px 18px',
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                >
                  {showDate && <small>{entry.date || 'Mới cập nhật'}</small>}
                  <h3>{entry.title}</h3>
                  {showExcerpt && <p>{entry.excerpt || ''}</p>}
                </div>
              </a>
            )
          })}
        </div>
      )
    }

    // ── MẪU 2: Card Grid – 4 thẻ đều nhau ──
    if (layout === 'card-grid-4') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '18px' }}>
          {items.map((entry: any) => (
            <a key={entry.id} href={entry.href} style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(10,45,75,0.05)', textDecoration: 'none', color: 'inherit', transition: 'transform .22s,box-shadow .22s', height: '100%' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(8,120,209,.12)' }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(10,45,75,0.05)' }}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={entry.cover} alt={entry.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                {showCategory && entry.category && <span style={{ position: 'absolute', bottom: 8, left: 10, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)', color: '#008046', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: '5px' }}>{badgeOverride || entry.category}</span>}
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', padding: '13px 14px 14px' }}>
                {showDate && <span style={{ fontSize: '11px', color: '#64748b', marginBottom: 6 }}>{entry.date || 'Mới cập nhật'}</span>}
                <strong style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.42, color: '#0f172a', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', marginBottom: 6 }}>{entry.title}</strong>
                {showExcerpt && entry.excerpt && <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', margin: '0 0 8px' }}>{entry.excerpt}</p>}
                <span style={{ marginTop: 'auto', fontSize: '12px', fontWeight: 700, color: '#0878d1' }}>Xem chi tiết →</span>
              </div>
            </a>
          ))}
        </div>
      )
    }

    // ── MẪU 3: List Rows – hàng ngang, ảnh nhỏ trái + nội dung phải ──
    if (layout === 'list-rows') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((entry: any) => (
            <a key={entry.id} href={entry.href} style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#fff', border: '1px solid #e8edf4', borderRadius: '10px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', padding: '0 14px 0 0', transition: 'box-shadow .2s,border-color .2s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(8,120,209,.1)'; (e.currentTarget as HTMLElement).style.borderColor = '#7fb9e5' }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = '#e8edf4' }}
            >
              <div style={{ width: '110px', minWidth: '110px', height: '74px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={entry.cover} alt={entry.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 0' }}>
                {(showDate || showCategory) && (
                  <div style={{ display: 'flex', gap: 8, fontSize: '11px', color: '#64748b', alignItems: 'center' }}>
                    {showDate && <span>{entry.date || 'Mới cập nhật'}</span>}
                    {showDate && showCategory && entry.category && <span>·</span>}
                    {showCategory && entry.category && <span style={{ color: '#0878d1', fontWeight: 600 }}>{entry.category}</span>}
                  </div>
                )}
                <strong style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.4, color: '#0f172a', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{entry.title}</strong>
                {showExcerpt && entry.excerpt && <p style={{ fontSize: '12px', color: '#64748b', margin: 0, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>{entry.excerpt}</p>}
              </div>
              <span style={{ fontSize: '18px', color: '#bfcfdb', flexShrink: 0 }}>›</span>
            </a>
          ))}
        </div>
      )
    }

    // ── MẪU 4: Compact List – chỉ text, ngày + tiêu đề + chuyên mục ──
    // compact-list hoặc fallback
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((entry: any, idx: number) => (
          <a key={entry.id} href={entry.href} style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '10px 0', borderBottom: idx < items.length - 1 ? '1px solid #f0f4f8' : 'none', textDecoration: 'none', color: 'inherit', transition: 'color .18s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#0878d1' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = '' }}
          >
            {showDate && <span style={{ fontSize: '11.5px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, minWidth: '72px' }}>{entry.date || '—'}</span>}
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, lineHeight: 1.4, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{entry.title}</span>
            {showCategory && entry.category && <span style={{ fontSize: '11px', fontWeight: 700, color: '#0878d1', whiteSpace: 'nowrap', flexShrink: 0 }}>{entry.category}</span>}
          </a>
        ))}
      </div>
    )
  }
  // ── HẾT HÀM RENDER ──

  return (
    <main className="homePortalPage">
      <SiteHeader />
      <HomeScrollSnapHandler enabled={home?.enableSectionScrollSnap !== false} />

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

          if (type === 'organization') {
            const carouselSpecialties = specialties.map((item: any) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              departmentName: typeof item.department === 'object' ? item.department?.name : undefined,
              summary: item.summary,
              coverUrl: mediaUrl(item.cover, 'article') || undefined,
              coverFitHome: item.coverFitHome || item.coverFit || 'cover-top',
              coverFit: item.coverFitHome || item.coverFit || 'cover-top',
              coverPosition: item.coverPosition || 'top',
            }))

            return (
              <section className="sectionPro configurableHomeSection homeSpecialtiesShowcaseSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead">
                    <div>
                      <span className="sectionKicker">{cfg.eyebrow || 'CHUYÊN MÔN Y TẾ'}</span>
                      <h2>{cfg.title || 'Hệ thống Chuyên khoa'}</h2>
                      <p>{cfg.description || 'Đội ngũ bác sĩ tận tâm, quy trình tiêu chuẩn và hệ thống trang thiết bị hiện đại phục vụ khám chữa bệnh.'}</p>
                    </div>
                    <a href="/chuyen-khoa">Xem tất cả chuyên khoa →</a>
                  </div>

                  <SpecialtiesCarousel
                    items={carouselSpecialties}
                    autoplaySeconds={5}
                  />
                </div>
              </section>
            )
          }

          if (type === 'featured-news') {
            const seeAllUrl = cfg.featuredSeeAllUrl || '/tin-tuc'
            return (
              <section className="sectionPro configurableHomeSection homeFeaturedSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead">
                    <div>
                      <span className="sectionKicker">{cfg.eyebrow}</span>
                      <h2>{cfg.title}</h2>
                      {cfg.description && <p>{cfg.description}</p>}
                    </div>
                    <a href={seeAllUrl}>Xem tất cả →</a>
                  </div>
                  <FeaturedContentCarousel items={featuredItems} interval={featuredInterval} cardFit={cfg.featuredCardFit || 'cover'} />
                </div>
              </section>
            )
          }

          if (type === 'advanced-techniques') {
            const fallbackTechniques = [
              {
                title: 'Ứng dụng các kỹ thuật hiện đại trong điều trị bệnh da',
                badge: 'Phòng khám Da - Thẩm mỹ Da',
                image: '',
                url: '/chuyen-khoa',
                visible: true,
              },
              {
                title: 'Ứng dụng kỹ thuật quang - điện (TruScreen) trong tầm soát ung thư cổ tử cung',
                badge: 'Tầm soát chuyên sâu',
                image: '',
                url: '/chuyen-khoa',
                visible: true,
              },
              {
                title: 'Kỹ thuật truyền dịch vào buồng ối',
                badge: 'Sản phụ khoa',
                image: '',
                url: '/chuyen-khoa',
                visible: true,
              },
            ]
            const collectionSlides = advancedTechniques.map((tech: any) => {
              const isLinkEnabled = tech.enableLink !== false
              const autoUrl = isLinkEnabled ? (tech.customUrl || `/ky-thuat-chuyen-sau/${tech.slug}`) : undefined
              return {
                id: tech.id,
                title: tech.title,
                badge: tech.badge || undefined,
                image: mediaUrl(tech.cover) || '',
                imageFit: tech.imageFit || 'contain',
                url: autoUrl,
                openNewTab: false,
                visible: tech.active !== false,
              }
            })

            const hasCustomList = Array.isArray(item.techniqueItems) && item.techniqueItems.length > 0
            const configuredSlides = (item.techniqueItems || []).map((tech: any, techIdx: number) => {
              const linkedDoc = tech.techniqueRef && typeof tech.techniqueRef === 'object' ? tech.techniqueRef : undefined
              const isLinkEnabled = tech.enableLink !== false && linkedDoc?.enableLink !== false
              const autoUrl = isLinkEnabled
                ? (linkedDoc?.slug ? `/ky-thuat-chuyen-sau/${linkedDoc.slug}` : (tech.url || undefined))
                : undefined
              const autoTitle = tech.title || linkedDoc?.title || 'Kỹ thuật chuyên sâu'
              const autoBadge = tech.badge || linkedDoc?.badge || undefined
              const autoImage = mediaUrl(tech.image) || (linkedDoc?.cover ? mediaUrl(linkedDoc.cover) : '')
              const autoFit = tech.imageFit || linkedDoc?.imageFit || 'contain'
              return {
                id: tech.id || `tech-${techIdx}`,
                title: autoTitle,
                badge: autoBadge,
                image: autoImage,
                imageFit: autoFit,
                url: autoUrl,
                openNewTab: isLinkEnabled && tech.openNewTab === true,
                visible: tech.visible !== false,
              }
            })

            // Ưu tiên hiển thị từ mục quản trị Kỹ thuật chuyên sâu nếu có bài viết, hoặc các thẻ được cấu hình có liên kết
            const techniqueSlides = collectionSlides.length > 0
              ? collectionSlides
              : (hasCustomList ? configuredSlides : fallbackTechniques)

            const isPinkish = (val?: string) => !val || val === '#fce4f0' || val === '#fce8f3' || val === '#d42d7d' || val === '#c92372' || val.toLowerCase().includes('fc')
            const finalCardBg = isPinkish(item.cardBarBgColor) ? '#f0f7fd' : item.cardBarBgColor
            const finalCardText = isPinkish(item.cardBarTextColor) ? '#0754a8' : item.cardBarTextColor

            return (
              <section className="sectionPro configurableHomeSection homeAdvancedTechniquesSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead">
                    <div>
                      <span className="sectionKicker">{cfg.eyebrow || 'CHUYÊN KHOA & CÔNG NGHỆ Y TẾ'}</span>
                      <h2>{cfg.title || 'Kỹ thuật chuyên sâu'}</h2>
                      {cfg.description && <p>{cfg.description}</p>}
                    </div>
                    <a href="/ky-thuat-chuyen-sau">Xem tất cả →</a>
                  </div>
                  <AdvancedTechniquesCarousel
                    items={techniqueSlides}
                    autoplaySeconds={Number(item.techniqueAutoplaySeconds ?? 5)}
                    itemsPerView={Number(item.techniqueItemsPerView ?? 3)}
                    cardBarBgColor={finalCardBg}
                    cardBarTextColor={finalCardText}
                  />
                </div>
              </section>
            )
          }

          if (type === 'our-experts') {
            const fallbackExperts = [
              {
                name: 'BS.CKII. Nguyễn Thụy Thúy Ái',
                position: 'Giám đốc Bệnh viện',
                badge: 'Ban Giám đốc',
                image: '',
                url: '/chuyen-khoa',
                visible: true,
              },
              {
                name: 'BS.CKII. Ngô Văn Dũng',
                position: 'Phó Giám đốc Bệnh viện',
                badge: 'Ban Giám đốc',
                image: '',
                url: '/chuyen-khoa',
                visible: true,
              },
              {
                name: 'BS.CKII. Huỳnh Thanh Liêm',
                position: 'Phó Giám đốc Bệnh viện',
                badge: 'Ban Giám đốc',
                image: '',
                url: '/chuyen-khoa',
                visible: true,
              },
            ]
            // Helper loại bỏ tiền tố chức danh quản lý/chức vụ trước tên (ví dụ "Phó Giám Đốc", "Giám đốc", "Trưởng Phòng")
            const cleanTitleFromName = (rawName: string, title?: string): string => {
              if (!rawName) return ''
              let result = rawName.trim()
              if (title && title.trim()) {
                const escapedTitle = title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                result = result.replace(new RegExp(`^${escapedTitle}\\s*`, 'i'), '').trim()
              }
              // Lọc các chức danh quản lý thông dụng nếu người dùng nhập sẵn trong tên
              const commonTitles = [
                'Giám Đốc Bệnh Viện',
                'Giám đốc Bệnh viện',
                'Phó Giám Đốc Bệnh Viện',
                'Phó Giám đốc Bệnh viện',
                'Phó Giám Đốc',
                'Phó Giám đốc',
                'Giám Đốc',
                'Giám đốc',
                'Trưởng Khoa',
                'Trưởng khoa',
                'Phó Trưởng Khoa',
                'Phó Trưởng khoa',
                'Phó Khoa',
                'Phó khoa',
                'Trưởng Phòng',
                'Trưởng phòng',
                'Phó Trưởng Phòng',
                'Phó Trưởng phòng',
                'Phó Phòng',
                'Phó phòng',
              ]
              for (const t of commonTitles) {
                if (result.toLowerCase().startsWith(t.toLowerCase())) {
                  result = result.slice(t.length).trim()
                  break
                }
              }
              return result
            }

            // 1. Dữ liệu từ Quản trị -> Nội dung -> Chuyên gia của chúng tôi (our-experts collection)
            const ourExpertsCollectionSlides = ourExpertsList.map((exp: any) => {
              const linkedDoc = exp.doctorRef && typeof exp.doctorRef === 'object' ? exp.doctorRef : undefined
              const linkedDept = linkedDoc && typeof linkedDoc.department === 'object' ? linkedDoc.department?.name : ''
              const isLinkEnabled = exp.enableLink !== false
              const autoUrl = isLinkEnabled
                ? (exp.url || (linkedDoc?.slug ? `/bac-si/${linkedDoc.slug}` : (linkedDoc ? `/bac-si/${linkedDoc.id}` : undefined)))
                : undefined
              
              // Bỏ phần chức vụ trước tên: chỉ hiển thị học vị + họ tên (ví dụ: BSCKII. Lê Thị Đức Hạnh)
              const doctorBaseName = linkedDoc?.name ? linkedDoc.name.trim() : ''
              const rawName = doctorBaseName || exp.name || 'Bác sĩ / Chuyên gia'
              const autoName = cleanTitleFromName(rawName, linkedDoc?.title)

              // Kiểm tra xem có hiển thị kèm Khoa/Phòng không (mặc định true trừ khi bị tắt ở exp hoặc linkedDoc)
              const shouldShowDept = exp.showDepartment !== false && linkedDoc?.showDepartment !== false

              // Xác định dòng mô tả / chức vụ:
              // Ưu tiên cao nhất: customSubtitle (nếu có nhập tại Chuyên gia hoặc Bác sĩ liên kết)
              const customSubtitle = (exp.customSubtitle || linkedDoc?.customSubtitle || '').trim()

              let autoPos: string | undefined = undefined
              let autoSubPos: string | undefined = undefined

              if (customSubtitle) {
                autoPos = customSubtitle
              } else {
                // Tách riêng chức danh/chức vụ và khoa/phòng
                const titles = linkedDoc ? [linkedDoc.title, linkedDoc.degree, linkedDoc.professionalTitle].filter(Boolean) : []
                const baseTitle = titles.join(' · ') || exp.position || ''
                
                const doctorPos = linkedDoc
                  ? (shouldShowDept ? ([baseTitle, linkedDept].filter(Boolean).join(' · ') || linkedDept) : (baseTitle || linkedDept))
                  : (exp.position || '')
                
                const customExpPos = (exp.position || '').trim()
                autoPos = doctorPos || customExpPos || undefined
                if (doctorPos && customExpPos && customExpPos !== doctorPos) {
                  autoPos = doctorPos
                  autoSubPos = customExpPos
                }
              }

              // Ưu tiên Ảnh đại diện của Bác sĩ; chỉ khi bên Bác sĩ không có hình ảnh thì mới áp dụng hình ảnh bên Chuyên gia
              const doctorAvatarUrl = linkedDoc?.avatar ? mediaUrl(linkedDoc.avatar) : ''
              const autoImage = doctorAvatarUrl || mediaUrl(exp.image) || ''
              const autoFit = exp.imageFit || 'contain'
              return {
                id: exp.id,
                name: autoName,
                position: autoPos,
                subPosition: autoSubPos,
                image: autoImage,
                imageFit: autoFit,
                url: autoUrl,
                openNewTab: isLinkEnabled && exp.openNewTab === true,
                visible: exp.active !== false,
              }
            })

            // 2. Dữ liệu trực tiếp từ Quản trị -> Tổ chức -> Bác sĩ (doctors collection)
            // Lọc các bác sĩ cho phép hiển thị lên Trang chủ (showOnHome !== false)
            const collectionDoctorSlides = doctors
              .filter((doc: any) => doc.active !== false && doc.showOnHome !== false)
              .map((doc: any) => {
                const deptName = typeof doc.department === 'object' ? doc.department?.name : ''
                const shouldShowDept = doc.showDepartment !== false
                const titles = [doc.title, doc.degree, doc.professionalTitle].filter(Boolean)
                const baseTitle = titles.join(' · ')
                
                const position = doc.customSubtitle?.trim()
                  ? doc.customSubtitle.trim()
                  : (shouldShowDept
                      ? ([baseTitle, deptName].filter(Boolean).join(' · ') || deptName || 'Bác sĩ chuyên khoa')
                      : (baseTitle || deptName || 'Bác sĩ chuyên khoa'))

                return {
                  id: doc.id,
                  name: (doc.name || '').trim(),
                  position,
                  image: mediaUrl(doc.avatar) || '',
                  imageFit: 'contain',
                  url: `/bac-si/${doc.slug}`,
                  openNewTab: false,
                  visible: doc.active !== false,
                }
              })

            const hasCustomExpertList = Array.isArray(item.expertItems) && item.expertItems.length > 0
            const configuredExpertSlides = (item.expertItems || []).map((exp: any, expIdx: number) => {
              const linkedDoc = exp.doctorRef && typeof exp.doctorRef === 'object' ? exp.doctorRef : undefined
              const linkedDept = linkedDoc && typeof linkedDoc.department === 'object' ? linkedDoc.department?.name : ''
              const isLinkEnabled = exp.enableLink !== false
              const autoUrl = isLinkEnabled
                ? (linkedDoc?.slug ? `/bac-si/${linkedDoc.slug}` : (exp.url || (linkedDoc ? `/bac-si/${linkedDoc.id}` : undefined)))
                : undefined
              
              // Bỏ phần chức vụ trước tên: chỉ hiển thị học vị + họ tên
              const doctorBaseName = linkedDoc?.name ? linkedDoc.name.trim() : ''
              const rawName = doctorBaseName || exp.name || 'Bác sĩ / Chuyên gia'
              const autoName = cleanTitleFromName(rawName, linkedDoc?.title)

              const shouldShowDept = exp.showDepartment !== false && linkedDoc?.showDepartment !== false
              const customSubtitle = (exp.customSubtitle || linkedDoc?.customSubtitle || '').trim()

              let autoPos: string | undefined = undefined
              let autoSubPos: string | undefined = undefined

              if (customSubtitle) {
                autoPos = customSubtitle
              } else {
                const titles = linkedDoc ? [linkedDoc.title, linkedDoc.degree, linkedDoc.professionalTitle].filter(Boolean) : []
                const baseTitle = titles.join(' · ') || exp.position || ''
                const doctorPos = linkedDoc
                  ? (shouldShowDept ? ([baseTitle, linkedDept].filter(Boolean).join(' · ') || linkedDept) : (baseTitle || linkedDept))
                  : (exp.position || '')
                const customExpPos = (exp.position || '').trim()

                autoPos = doctorPos || customExpPos || undefined
                if (doctorPos && customExpPos && customExpPos !== doctorPos) {
                  autoPos = doctorPos
                  autoSubPos = customExpPos
                }
              }

              // Ưu tiên Ảnh đại diện của Bác sĩ; chỉ khi bên Bác sĩ không có hình ảnh thì mới áp dụng hình ảnh bên Chuyên gia
              const doctorAvatarUrl = linkedDoc?.avatar ? mediaUrl(linkedDoc.avatar) : ''
              const autoImage = doctorAvatarUrl || mediaUrl(exp.image) || ''
              const autoFit = exp.imageFit || 'contain'
              return {
                id: exp.id || `expert-${expIdx}`,
                name: autoName,
                position: autoPos,
                subPosition: autoSubPos,
                image: autoImage,
                imageFit: autoFit,
                url: autoUrl,
                openNewTab: isLinkEnabled && exp.openNewTab === true,
                visible: exp.visible !== false,
              }
            })

            // Thứ tự ưu tiên:
            // 1) Nếu có bài/dữ liệu trong Quản trị -> Nội dung -> Chuyên gia của chúng tôi -> ưu tiên hiển thị ngay
            // 2) Nếu có danh sách cấu hình riêng trong Trang chủ -> dùng danh sách cấu hình
            // 3) Nếu có danh sách Bác sĩ từ Quản trị -> Tổ chức -> Bác sĩ -> tự động lấy hiển thị
            // 4) Fallback ban đầu
            const expertSlides = ourExpertsCollectionSlides.length > 0
              ? ourExpertsCollectionSlides
              : (hasCustomExpertList
                  ? configuredExpertSlides
                  : (collectionDoctorSlides.length > 0 ? collectionDoctorSlides : fallbackExperts))

            const isPinkish = (val?: string) => !val || val === '#fce4f0' || val === '#fce8f3' || val === '#d42d7d' || val === '#c92372' || val.toLowerCase().includes('fc')
            const finalCardBg = isPinkish(item.expertCardBgColor) ? '#f0f7fd' : item.expertCardBgColor
            const finalCardText = isPinkish(item.expertCardTextColor) ? '#0754a8' : item.expertCardTextColor

            // Sắp xếp các slide chuyên gia theo quy tắc lãnh đạo bệnh viện (Giám đốc -> Phó Giám đốc -> ...)
            const rawSortedExperts = [...expertSlides].sort((a: any, b: any) => {
              const getRank = (exp: any) => {
                const text = `${exp.name || ''} ${exp.position || ''} ${exp.subPosition || ''}`.toLowerCase()
                if (text.includes('giám đốc') || text.includes('giam doc')) {
                  if (text.includes('phó') || text.includes('pho')) return 2
                  return 1
                }
                if (text.includes('trưởng') || text.includes('truong')) return 3
                if (text.includes('phó') || text.includes('pho')) return 4
                return 10
              }
              return getRank(a) - getRank(b)
            })

            return (
              <section className="sectionPro configurableHomeSection homeOurExpertsSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead">
                    <div>
                      <span className="sectionKicker">{cfg.eyebrow || 'ĐỘI NGŨ Y BÁC SĨ'}</span>
                      <h2>{cfg.title || 'Chuyên gia của chúng tôi'}</h2>
                      {cfg.description && <p>{cfg.description}</p>}
                    </div>
                    <a href="/bac-si">Xem tất cả →</a>
                  </div>
                  <OurExpertsCarousel
                    items={rawSortedExperts}
                    autoplaySeconds={Number(item.expertAutoplaySeconds ?? 5)}
                    itemsPerView={4}
                    cardBarBgColor={finalCardBg}
                    cardBarTextColor={finalCardText}
                  />
                </div>
              </section>
            )
          }

          if (type === 'news-portal') return <section className="sectionPro configurableHomeSection homePortalNewsSection homePortalPage" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/tin-tuc">Xem toàn bộ bài viết →</a></div><HomeNewsTabs items={news.map((article) => ({ id: article.id, title: article.title, slug: article.slug, excerpt: article.excerpt, category: article.category, date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : '', coverUrl: mediaUrl(article.cover || article.seoImage) || defaultMedia.news, coverFit: article.coverFit || 'cover', coverPosition: article.coverPosition || 'top' }))} tabs={contentTabsFor('news-portal')} /></div></section>

          if (type === 'notices') {
            const noticeLayout = item.sectionLayout || 'editorial-grid'
            const noticeLimit = Math.min(20, Math.max(1, Number(item.layoutItemLimit || 5)))
            const noticeItems = notices.slice(0, noticeLimit).map((notice: any) => ({
              id: notice.id,
              href: `/thong-bao/${notice.slug}`,
              cover: mediaUrl(notice.cover || notice.seoImage) || defaultMedia.notices,
              title: notice.title,
              excerpt: notice.excerpt || 'Thông tin mới được cập nhật từ Bệnh viện Đa khoa Khu vực Thới Lai.',
              date: notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString('vi-VN') : (notice.startAt ? new Date(notice.startAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'),
              category: notice.category || '',
              coverFit: notice.coverFit || 'cover',
              coverPosition: notice.coverPosition || 'top',
            }))
            return (
              <section className="sectionPro configurableHomeSection homeNoticeSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/thong-bao">Xem tất cả →</a></div>
                  {renderEditorialSection({ items: noticeItems, layout: noticeLayout, showDate: item.layoutShowDate !== false, showCategory: item.layoutShowCategory !== false, showExcerpt: item.layoutShowExcerpt !== false, badgeOverride: item.layoutCardBadge || 'THÔNG BÁO', emptyText: 'Chưa có thông báo được đăng.' })}
                </div>
              </section>
            )
          }

          if (type === 'procurement') {
            const procLayout = item.sectionLayout || 'editorial-grid'
            const procLimit = Math.min(20, Math.max(1, Number(item.layoutItemLimit || 5)))
            const procItems = procurement.slice(0, procLimit).map((entry: any) => ({
              id: entry.id,
              href: `/dau-thau-mua-sam/${entry.slug}`,
              cover: mediaUrl(entry.cover || entry.seoImage) || defaultMedia.procurement,
              title: entry.title,
              excerpt: entry.excerpt || entry.summary || 'Thông tin công khai về đấu thầu và mua sắm của bệnh viện.',
              date: entry.publishedAt ? new Date(entry.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
              category: entry.category || '',
              coverFit: entry.coverFit || 'cover',
              coverPosition: entry.coverPosition || 'top',
            }))
            return (
              <section className="sectionPro configurableHomeSection homeProcurementSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/dau-thau-mua-sam">Xem tất cả →</a></div>
                  {renderEditorialSection({ items: procItems, layout: procLayout, showDate: item.layoutShowDate !== false, showCategory: item.layoutShowCategory !== false, showExcerpt: item.layoutShowExcerpt !== false, badgeOverride: item.layoutCardBadge || 'ĐẤU THẦU – MUA SẮM', emptyText: 'Chưa có hồ sơ đấu thầu – mua sắm.' })}
                </div>
              </section>
            )
          }

          if (type === 'schedules') return <section id="schedules" className="sectionPro configurableHomeSection homeScheduleSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description}</p></div><a href="/lich-kham">Xem tất cả →</a></div><ScheduleExplorer daily={homeDailySchedules} weekly={homeWeeklySchedules} attachments={homeAttachedSchedules} emergency={homeEmergencySchedules} medpro={medpro} tabOrder={scheduleTabOrder.length ? scheduleTabOrder : undefined} tabs={scheduleTabs.length ? scheduleTabs : undefined} compact /></div></section>

          if (type === 'vaccinations') return <section className="sectionPro configurableHomeSection homeVaccinationSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2><p>{cfg.description}</p></div><a href="/tiem-chung">Xem tất cả →</a></div><VaccinationTabs announcements={homeVaccinationAnnouncements} campaigns={homeVaccinationCampaigns} vaccines={homeVaccines} medpro={medpro} tabOrder={vaccinationTabOrder.length ? vaccinationTabOrder : undefined} tabs={vaccinationTabs.length ? vaccinationTabs : undefined} compact /></div></section>

          if (type === 'science') return <section className="sectionPro configurableHomeSection homePortalNewsSection homePortalPage homeScienceSection" style={style} key={key}><div className="container"><div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/hoat-dong-khoa-hoc">Xem toàn bộ bài viết →</a></div><HomeScienceTabs items={scientificActivities.map((article) => ({ id: article.id, title: article.title, slug: article.slug, category: scientificActivityGroupName(article), excerpt: article.excerpt, date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : '', coverUrl: mediaUrl(article.cover || article.seoImage) || defaultMedia.news, href: `/hoat-dong-khoa-hoc/${article.slug}` }))} tabs={scientificActivityGroups.map((group) => ({ label: group.name, categories: [group.name] }))} /></div></section>

          if (type === 'documents') {
            const docLayout = item.sectionLayout || 'editorial-grid'
            const docLimit = Math.min(20, Math.max(1, Number(item.layoutItemLimit || 5)))

            const normalDocItems = documents.map((docItem: any) => ({
              id: `doc-${docItem.id}`,
              href: docItem.slug ? `/van-ban/${docItem.slug}` : (mediaUrl(docItem.file) || '/van-ban'),
              cover: mediaUrl(docItem.cover || docItem.seoImage) || defaultMedia.documents,
              title: docItem.title,
              excerpt: docItem.summary || [docItem.number, docItem.issuer].filter(Boolean).join(' · ') || 'Văn bản, biểu mẫu và tài liệu được bệnh viện công khai.',
              dateValue: docItem.issuedAt || docItem.updatedAt,
              date: docItem.issuedAt ? new Date(docItem.issuedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
              category: docItem.documentType || docItem.type || docItem.category || 'Văn bản – Tài liệu',
              coverFit: docItem.coverFit || 'cover',
              coverPosition: docItem.coverPosition || 'top',
            }))

            const cpDocItems = clinicalProtocols.map((cpItem: any) => {
              const spec = typeof cpItem.specialty === 'object' && cpItem.specialty?.name ? cpItem.specialty.name : ''
              const cat = spec ? `Phác đồ (${spec})` : (cpItem.documentType || 'Phác đồ điều trị')
              return {
                id: `cp-${cpItem.id}`,
                href: cpItem.slug ? `/phac-do-dieu-tri/${cpItem.slug}` : (mediaUrl(cpItem.file) || '/phac-do-dieu-tri'),
                cover: mediaUrl(cpItem.cover || cpItem.seoImage) || defaultMedia.documents,
                title: cpItem.title,
                excerpt: cpItem.summary || [cpItem.code, cpItem.issuer || 'BVĐK Thới Lai'].filter(Boolean).join(' · ') || 'Phác đồ điều trị và hướng dẫn chẩn đoán chuyên môn.',
                dateValue: cpItem.issuedAt || cpItem.updatedAt,
                date: cpItem.issuedAt ? new Date(cpItem.issuedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
                category: cat,
                coverFit: 'cover',
                coverPosition: 'top',
              }
            })

            const allDocItems = [...normalDocItems, ...cpDocItems]
              .sort((a, b) => new Date(b.dateValue || 0).getTime() - new Date(a.dateValue || 0).getTime())
              .slice(0, docLimit)

            return (
              <section className="sectionPro configurableHomeSection homeDocumentsSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead"><div><span className="sectionKicker">{cfg.eyebrow}</span><h2>{cfg.title}</h2>{cfg.description && <p>{cfg.description}</p>}</div><a href="/van-ban">Xem tất cả →</a></div>
                  {renderEditorialSection({ items: allDocItems, layout: docLayout, showDate: item.layoutShowDate !== false, showCategory: item.layoutShowCategory !== false, showExcerpt: item.layoutShowExcerpt !== false, badgeOverride: item.layoutCardBadge || 'VĂN BẢN – TÀI LIỆU', emptyText: 'Chưa có văn bản được đăng.' })}
                </div>
              </section>
            )
          }


          if (type === 'content-section') {
            const relationId = typeof item.linkedContentSection === 'object' ? item.linkedContentSection?.id : item.linkedContentSection
            const linkedSection = contentSections.find((section: any) => String(section.id) === String(relationId)) || (typeof item.linkedContentSection === 'object' ? item.linkedContentSection : null)
            if (!linkedSection) return null
            const csLayout = item.sectionLayout || 'editorial-grid'
            const csLimit = Math.min(20, Math.max(1, Number(item.layoutItemLimit || item.linkedContentLimit || 5)))
            const fallback = mediaUrl(linkedSection.defaultImage || linkedSection.seoImage)
            const sectionHref = `/${linkedSection.slug}`
            const sectionPosts = customPosts.filter((post: any) => String(typeof post.section === 'object' ? post.section?.id : post.section) === String(linkedSection.id)).slice(0, csLimit)
            const csItems = sectionPosts.map((post: any) => ({
              id: post.id,
              href: `${sectionHref}/${post.slug}`,
              cover: mediaUrl(post.cover || post.seoImage) || fallback,
              title: post.title,
              excerpt: post.excerpt || `Thông tin mới thuộc mục ${linkedSection.title}.`,
              date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
              category: post.category || '',
              coverFit: post.coverFit || 'cover',
              coverPosition: post.coverPosition || 'top',
            }))
            return (
              <section className="sectionPro configurableHomeSection homeDynamicContentSection" style={style} key={key}>
                <div className="container">
                  <div className="homeSectionHead"><div><span className="sectionKicker">{item.eyebrow || 'NỘI DUNG'}</span><h2>{item.title || linkedSection.title}</h2>{(item.description || linkedSection.description) && <p>{item.description || linkedSection.description || `Các bài viết mới thuộc mục ${linkedSection.title}.`}</p>}</div><a href={sectionHref}>Xem tất cả →</a></div>
                  {renderEditorialSection({ items: csItems, layout: csLayout, showDate: item.layoutShowDate !== false, showCategory: item.layoutShowCategory !== false, showExcerpt: item.layoutShowExcerpt !== false, badgeOverride: item.layoutCardBadge || String(linkedSection.title || 'NỘI DUNG').toUpperCase(), emptyText: `Chưa có bài viết trong mục ${linkedSection.title}.` })}
                </div>
              </section>
            )
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
