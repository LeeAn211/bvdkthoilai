import { PageHero } from '@/components/PageHero'
import { SearchFilter } from '@/components/SearchFilter'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getDefaultContentMedia, scientificActivityGroupName } from '@/lib/defaultMedia'
import { mediaUrl } from '@/lib/media'
import { getCMS } from '@/lib/payload'

export const revalidate = 60

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const requestedCategory = (await searchParams).category || 'all'
  let items: any[] = []

  try {
    const payload = await getCMS()
    const [data, defaults] = await Promise.all([
      payload.find({
        collection: 'scientific-activities',
        where: { _status: { equals: 'published' } },
        sort: ['-featured', '-publishedAt'],
        limit: 100,
        depth: 1,
      }),
      getDefaultContentMedia(),
    ])

    items = (data.docs as any[]).map((item) => ({
      ...item,
      category: scientificActivityGroupName(item),
      coverUrl: mediaUrl(item.cover || item.seoImage) || defaults.news,
      date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : '',
      href: `/hoat-dong-khoa-hoc/${item.slug}`,
    }))
  } catch {}

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHUYÊN MÔN – ĐÀO TẠO"
        title="Hoạt động khoa học"
        description="Đào tạo, tập huấn, hội nghị, hội thảo và kiến thức y khoa của bệnh viện."
      />
      <main className="section">
        <div className="container">
          <SearchFilter items={items} kind="science" initialCategory={requestedCategory} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
