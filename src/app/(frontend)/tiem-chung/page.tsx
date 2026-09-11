import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 300
const relationId = (value: any) => typeof value === 'object' ? String(value?.id || '') : String(value || '')
const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''

export default async function VaccinationPage() {
  let items: any[] = []
  try {
    const payload = await getCMS()
    const [scheduleResult, vaccineResult, priceResult, defaults] = await Promise.all([
      payload.find({ collection: 'vaccinationSchedules', where: { active: { equals: true } }, sort: '-date', limit: 300, depth: 1 }),
      payload.find({ collection: 'vaccines', where: { active: { equals: true } }, sort: 'name', limit: 300, depth: 1 }),
      payload.find({ collection: 'vaccinePrices', where: { active: { equals: true } }, sort: '-effectiveFrom', limit: 2000, depth: 1 }),
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

    const scheduleItems = (scheduleResult.docs as any[]).map((x) => ({
      id: `schedule-${x.id}`,
      title: x.title,
      excerpt: x.summary || x.target || x.note || 'Thông tin lịch tiêm ngừa được bệnh viện cập nhật.',
      category: x.scheduleKind === 'announcement' ? 'Thông báo lịch tiêm' : 'Tiêm ngừa theo đợt',
      date: [formatDate(x.date), formatDate(x.endDate)].filter(Boolean).join(' – '),
      coverUrl: mediaUrl(x.scheduleImage) || defaults.vaccinations,
      href: `/tiem-chung/${x.id}?type=schedule`,
    }))

    const vaccineItems = (vaccineResult.docs as any[]).map((x) => {
      const price = currentPrice.get(String(x.id))
      const priceText = typeof price?.price === 'number' ? `Giá hiện hành: ${new Intl.NumberFormat('vi-VN').format(price.price)}đ` : ''
      return {
        id: `vaccine-${x.id}`,
        title: x.name,
        excerpt: [x.summary || (x.prevents ? `Phòng bệnh: ${x.prevents}` : ''), priceText].filter(Boolean).join(' · '),
        category: 'Các loại vắc xin',
        date: '',
        coverUrl: mediaUrl(x.image) || defaults.vaccinations,
        href: `/tiem-chung/${x.id}?type=vaccine`,
      }
    })

    items = [...scheduleItems, ...vaccineItems]

    // Fallback dữ liệu từ bảng vaccinations legacy nếu chưa có dữ liệu mới
    if (items.length === 0) {
      const legacyResult = await payload.find({
        collection: 'vaccinations',
        where: { active: { equals: true } },
        limit: 300,
        depth: 1,
      })
      if (legacyResult.docs && legacyResult.docs.length > 0) {
        items = (legacyResult.docs as any[]).map((x) => ({
          id: `legacy-${x.id}`,
          title: x.vaccineName,
          excerpt: x.summary || x.target || x.note || 'Thông tin tiêm ngừa (dữ liệu lưu trữ).',
          category: x.entryType === 'announcement' ? 'Thông báo lịch tiêm' : x.entryType === 'vaccine' ? 'Các loại vắc xin' : 'Tiêm ngừa theo đợt',
          date: [formatDate(x.date), formatDate(x.endDate)].filter(Boolean).join(' – '),
          coverUrl: mediaUrl(x.announcementImage || x.campaignImage || x.vaccineImage) || defaults.vaccinations,
          href: `/tiem-chung/${x.id}`,
        }))
      }
    }
  } catch (error) {
    console.error('[VaccinationPage] Lỗi khi tải dữ liệu tiêm chủng:', error)
  }

  return <>
    <SiteHeader />
    <PageHero eyebrow="TIÊM NGỪA AN TOÀN" title="Thông tin tiêm ngừa" description="Theo dõi thông báo lịch tiêm, các đợt tiêm và danh mục vắc xin tại bệnh viện." />
    <main className="section"><div className="container"><SearchFilter items={items} kind="vaccination" /></div></main>
    <SiteFooter />
  </>
}
