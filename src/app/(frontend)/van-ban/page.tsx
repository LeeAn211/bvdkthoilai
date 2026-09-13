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
  title: 'Văn bản – Tài liệu',
  description: 'Tra cứu văn bản, quyết định, biểu mẫu và tài liệu điều hành công khai của Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function Page() {
  let items: DocumentDirectoryItem[] = []

  try {
    const payload = await getCMS()
    const [docRes, cpRes, defaults] = await Promise.all([
      payload.find({
        collection: 'documents',
        sort: '-issuedAt',
        limit: 200,
        depth: 2,
      }).catch(() => ({ docs: [] })),
      payload.find({
        collection: 'clinical-protocols' as any,
        sort: '-issuedAt',
        limit: 200,
        depth: 2,
      }).catch(() => ({ docs: [] })),
      getDefaultContentMedia(),
    ])

    const normalDocs: DocumentDirectoryItem[] = (docRes.docs as any[]).map(x => {
      const fileUrl = mediaUrl(x.file)
      const detailHref = x.slug ? `/van-ban/${x.slug}` : (fileUrl || '#')
      const cat = categoryName(x) || x.category || x.documentType || 'Văn bản – Tài liệu'
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
        year: x.year,
        documentType: x.documentType || cat,
        summary: x.summary,
        excerpt: x.summary || 'Văn bản, biểu mẫu và tài liệu được bệnh viện công khai.',
        fileUrl,
        fileName: mediaLabel(x.file),
        fileFormat: mediaFormat(x.file),
        coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.documents,
        href: detailHref,
        allowDownload: x.allowDownload !== false,
        preventCopy: Boolean(x.preventCopy),
        showViewer: x.showViewer !== false,
      }
    })

    const cpDocs: DocumentDirectoryItem[] = (cpRes.docs as any[]).map(x => {
      const fileUrl = mediaUrl(x.file)
      const detailHref = x.slug ? `/phac-do-dieu-tri/${x.slug}` : (fileUrl || '#')
      const spec = typeof x.specialty === 'object' && x.specialty?.name ? x.specialty.name : ''
      const cat = spec ? `Phác đồ (${spec})` : (x.documentType || 'Phác đồ điều trị')
      const dateStr = x.issuedAt ? new Date(x.issuedAt).toLocaleDateString('vi-VN') : ''

      return {
        id: `cp-${x.id}`,
        title: x.title,
        slug: x.slug,
        number: x.code,
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
        allowDownload: x.allowDownload !== false,
        preventCopy: Boolean(x.preventCopy),
        showViewer: x.showViewer !== false,
      }
    })

    items = [...normalDocs, ...cpDocs].sort((a, b) => {
      const timeA = a.issuedAt ? new Date(a.issuedAt).getTime() : 0
      const timeB = b.issuedAt ? new Date(b.issuedAt).getTime() : 0
      return timeB - timeA
    })
  } catch {}

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="VĂN BẢN – TÀI LIỆU"
        title="Kho văn bản & biểu mẫu"
        description="Tra cứu văn bản điều hành, quyết định, quy chế, biểu mẫu và tài liệu chuyên môn công khai của Bệnh viện Đa khoa Khu vực Thới Lai."
      />
      <main className="section" style={{ background: '#f8fafc', minHeight: '80vh', padding: '36px 0 64px' }}>
        <div className="container">
          <DocumentDirectoryView items={items} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

