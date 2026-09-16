import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { DocumentDirectoryView, type DocumentDirectoryItem } from '@/components/DocumentDirectoryView'
import { getCMS } from '@/lib/payload'
import { mediaFormat, mediaLabel, mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Phác đồ điều trị – Hướng dẫn chuyên môn y khoa',
  description: 'Tra cứu các phác đồ điều trị, quy trình chuyên môn kỹ thuật và hướng dẫn chẩn đoán chuẩn Bộ Y tế của Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function Page() {
  let items: DocumentDirectoryItem[] = []
  try {
    const payload = await getCMS()
    const [cpRes, docRes, defaults, settings] = await Promise.all([
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
      payload.findGlobal({ slug: 'site-settings' as any }).catch(() => null) as any,
    ])

    const defaultIssuer = settings?.hospitalName || 'BVĐK Khu vực Thới Lai'

    const cpDocs: DocumentDirectoryItem[] = (cpRes.docs as any[]).map((x: any) => {
      const fileUrl = mediaUrl(x.file)
      const detailHref = x.slug ? `/phac-do-dieu-tri/${x.slug}` : (fileUrl || '#')
      const spec = typeof x.specialty === 'object' && x.specialty?.name ? x.specialty.name : ''
      const cat = spec ? `Khoa ${spec}` : (x.documentType || 'Phác đồ điều trị')
      const dateStr = x.issuedAt ? new Date(x.issuedAt).toLocaleDateString('vi-VN') : ''

      return {
        id: `cp-${x.id}`,
        title: x.title,
        slug: x.slug,
        number: x.code,
        category: cat,
        issuer: x.issuer || defaultIssuer,
        signer: x.signer,
        issuedAt: x.issuedAt,
        date: dateStr,
        documentType: 'Phác đồ điều trị',
        summary: x.summary,
        excerpt: x.summary || 'Phác đồ điều trị và hướng dẫn chẩn đoán chuyên môn của bệnh viện.',
        fileUrl,
        fileName: mediaLabel(x.file),
        fileFormat: mediaFormat(x.file),
        coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.documents,
        href: detailHref,
        accessMode: x.accessMode || 'public',
        allowDownload: x.allowDownload !== false,
        preventCopy: Boolean(x.preventCopy),
        showViewer: x.showViewer !== false,
      }
    })

    const otherDocs: DocumentDirectoryItem[] = (docRes.docs as any[])
      .filter((x: any) => {
        const c = (categoryName(x) || x.category || '').toLowerCase()
        const t = (x.documentType || '').toLowerCase()
        const title = (x.title || '').toLowerCase()
        return c.includes('phác đồ') || t.includes('phác đồ') || title.includes('phác đồ')
      })
      .map((x: any) => {
        const fileUrl = mediaUrl(x.file)
        const detailHref = x.slug ? `/van-ban/${x.slug}` : (fileUrl || '#')
        const cat = categoryName(x) || x.category || 'Phác đồ điều trị'
        const dateStr = x.issuedAt ? new Date(x.issuedAt).toLocaleDateString('vi-VN') : ''

        return {
          id: `doc-${x.id}`,
          title: x.title,
          slug: x.slug,
          number: x.number,
          category: cat,
          issuer: x.issuer || 'BVĐK Khu vực Thới Lai',
          signer: x.signer,
          issuedAt: x.issuedAt,
          date: dateStr,
          documentType: 'Phác đồ điều trị',
          summary: x.summary,
          excerpt: x.summary || 'Phác đồ điều trị và hướng dẫn chẩn đoán chuyên môn của bệnh viện.',
          fileUrl,
          fileName: mediaLabel(x.file),
          fileFormat: mediaFormat(x.file),
          coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.documents,
          href: detailHref,
          accessMode: x.accessMode || 'public',
          allowDownload: x.allowDownload !== false,
          preventCopy: Boolean(x.preventCopy),
          showViewer: x.showViewer !== false,
        }
      })

    items = [...cpDocs, ...otherDocs].sort((a, b) => {
      const timeA = a.issuedAt ? new Date(a.issuedAt).getTime() : 0
      const timeB = b.issuedAt ? new Date(b.issuedAt).getTime() : 0
      return timeB - timeA
    })
  } catch {}

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHUYÊN MÔN KỸ THUẬT"
        title="Danh mục Phác đồ điều trị"
        description="Hệ thống tra cứu hướng dẫn chẩn đoán, phác đồ điều trị chuẩn y khoa và quy trình kỹ thuật chuyên môn của Bệnh viện Đa khoa Khu vực Thới Lai."
      />
      <main className="section" style={{ background: '#f8fafc', minHeight: '80vh', padding: '32px 0 60px' }}>
        <div className="container">
          <DocumentDirectoryView
            items={items}
            title="Danh mục Phác đồ điều trị"
            eyebrow="PHÁC ĐỒ ĐIỀU TRỊ CHUẨN"
            emptyText="Chưa có phác đồ điều trị nào phù hợp."
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
