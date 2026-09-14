import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Phác đồ điều trị',
  description: 'Tra cứu các phác đồ điều trị, quy trình chuyên môn kỹ thuật và hướng dẫn chẩn đoán của Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function Page() {
  let items: any[] = []
  try {
    const payload = await getCMS()
    const [cpRes, docRes, defaults] = await Promise.all([
      payload.find({
        collection: 'clinical-protocols' as any,
        sort: '-issuedAt',
        limit: 200,
        depth: 2,
      }).catch(() => ({ docs: [] })),
      payload.find({
        collection: 'documents',
        sort: '-issuedAt',
        limit: 200,
        depth: 2,
      }).catch(() => ({ docs: [] })),
      getDefaultContentMedia(),
    ])

    const cpDocs = (cpRes.docs as any[]).map((x: any) => {
      const fileUrl = mediaUrl(x.file)
      const detailHref = x.slug ? `/phac-do-dieu-tri/${x.slug}` : (fileUrl || '#')
      const spec = typeof x.specialty === 'object' && x.specialty?.name ? x.specialty.name : ''
      const cat = spec || x.documentType || 'Phác đồ điều trị'
      return {
        ...x,
        category: cat,
        coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.documents,
        date: x.issuedAt ? new Date(x.issuedAt).toLocaleDateString('vi-VN') : '',
        meta: [x.code, x.issuer || 'BVĐK Thới Lai'].filter(Boolean).join(' · '),
        excerpt: x.summary || 'Phác đồ điều trị và hướng dẫn chẩn đoán chuyên môn của bệnh viện.',
        href: detailHref,
        actionLabel: 'Xem chi tiết',
        external: false,
      }
    })

    const otherDocs = (docRes.docs as any[])
      .filter((x: any) => {
        const c = (categoryName(x) || x.category || '').toLowerCase()
        const t = (x.documentType || '').toLowerCase()
        const title = (x.title || '').toLowerCase()
        return c.includes('phác đồ') || t.includes('phác đồ') || title.includes('phác đồ')
      })
      .map((x: any) => {
        const fileUrl = mediaUrl(x.file)
        const detailHref = x.slug ? `/van-ban/${x.slug}` : (fileUrl || '#')
        return {
          ...x,
          category: categoryName(x) || x.category || 'Phác đồ điều trị',
          coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.documents,
          date: x.issuedAt ? new Date(x.issuedAt).toLocaleDateString('vi-VN') : '',
          meta: [x.number, x.issuer || 'BVĐK Thới Lai'].filter(Boolean).join(' · '),
          excerpt: x.summary || 'Phác đồ điều trị và hướng dẫn chẩn đoán chuyên môn của bệnh viện.',
          href: detailHref,
          actionLabel: 'Xem chi tiết',
          external: false,
        }
      })

    items = [...cpDocs, ...otherDocs]
  } catch {}

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHUYÊN MÔN KỸ THUẬT"
        title="Phác đồ điều trị"
        description="Tra cứu phác đồ điều trị, hướng dẫn chẩn đoán và quy trình kỹ thuật chuyên môn chuẩn của Bệnh viện Đa khoa Khu vực Thới Lai."
      />
      <main className="section">
        <div className="container">
          <SearchFilter items={items} kind="document" initialCategory="all" />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
