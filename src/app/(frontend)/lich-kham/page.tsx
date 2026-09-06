import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 60

const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString('vi-VN') : ''

export default async function Page() {
  let items: any[] = []
  try {
    const payload = await getCMS()
    const [result, defaults] = await Promise.all([payload.find({ collection: 'schedules', where: { active: { equals: true } }, sort: '-validFrom', limit: 200, depth: 2 }), getDefaultContentMedia()])
    items = (result.docs as any[]).map((x) => {
      const category = x.mode === 'attachment' ? 'Lịch đính kèm' : x.mode === 'weekly' ? 'Theo tuần' : 'Theo ngày'
      const date = x.mode === 'weekly'
        ? [formatDate(x.weekStart), formatDate(x.weekEnd)].filter(Boolean).join(' – ')
        : x.mode === 'attachment'
          ? [formatDate(x.validFrom), formatDate(x.validTo)].filter(Boolean).join(' – ')
          : formatDate(x.date)
      return {
        id: x.id,
        title: x.title,
        excerpt: x.summary || x.note || (x.department?.name ? `Khoa/Phòng: ${x.department.name}` : 'Thông tin lịch khám được bệnh viện cập nhật.'),
        category,
        date,
        coverUrl: mediaUrl(x.scheduleImage || x.coverImage) || defaults.schedules,
        href: `/lich-kham/${x.id}`,
      }
    })
  } catch {}

  return <>
    <SiteHeader />
    <PageHero eyebrow="KHÁM & CHỮA BỆNH" title="Lịch khám bác sĩ" description="Tra cứu lịch theo ngày, theo tuần hoặc bảng lịch được bệnh viện đính kèm." />
    <main className="section"><div className="container"><SearchFilter items={items} kind="schedule" /></div></main>
    <SiteFooter />
  </>
}
