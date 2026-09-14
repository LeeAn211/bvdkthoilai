import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 60

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const requestedCategory = (await searchParams).category || 'all'
  let items:any[] = []
  try {
    const payload = await getCMS()
    const [data, defaults] = await Promise.all([
      payload.find({ collection: 'news', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 100, depth: 2 }),
      getDefaultContentMedia(),
    ])
    items = (data.docs as any[]).map(x => ({
      ...x,
      category: categoryName(x),
      coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.news,
      date: x.publishedAt ? new Date(x.publishedAt).toLocaleDateString('vi-VN') : '',
      href: `/tin-tuc/${x.slug}`,
    }))
  } catch {}
  return <>
    <SiteHeader/>
    <PageHero eyebrow="TIN TỨC" title="Tin tức & hoạt động" description="Cập nhật thông tin mới nhất từ bệnh viện."/>
    <main className="section"><div className="container"><SearchFilter items={items} kind="news" initialCategory={requestedCategory}/></div></main>
    <SiteFooter/>
  </>
}
