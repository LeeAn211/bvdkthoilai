import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'
import { DocumentDetailView } from '@/components/DocumentDetailView'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaFormat, mediaLabel, mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

async function getData(slug: string) {
  const payload = await getCMS()
  const [current, related] = await Promise.all([
    payload.find({
      collection: 'documents',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    }).catch(() => ({ docs: [] })),
    payload.find({
      collection: 'documents',
      where: { slug: { not_equals: slug } },
      sort: '-issuedAt',
      limit: 5,
      depth: 1,
    }).catch(() => ({ docs: [] })),
  ])
  return {
    item: (current.docs[0] as any) || null,
    related: (related.docs as any[]) || [],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const [{ item }, defaults] = await Promise.all([getData(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover) || defaults.documents
    return {
      title: item.seoTitle || item.title,
      description: item.seoDescription || item.summary,
      openGraph: {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.summary,
        images: image ? [image] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const [{ item, related }, theme, siteSettings, displaySettings, articleDetailSettings] = await Promise.all([
    getData(slug),
    getGlobal('theme-settings').catch(() => null) as Promise<any>,
    getGlobal('site-settings').catch(() => null) as Promise<any>,
    getGlobal('display-settings').catch(() => null) as Promise<any>,
    getGlobal('article-detail-settings').catch(() => null) as Promise<any>,
  ])

  if (!item) notFound()

  const cat = categoryName(item) || item.category || 'Văn bản – Tài liệu'
  const fileUrl = item.file
    ? `/api/document-file?collection=documents&id=${encodeURIComponent(String(item.id))}`
    : ''
  const fileName = mediaLabel(item.file)
  const fileFormat = mediaFormat(item.file)
  const hospitalName = siteSettings?.hospitalName || 'Bệnh viện Đa khoa Khu vực Thới Lai'

  const docData = {
    id: item.id,
    title: item.title,
    number: item.number,
    issuedAt: item.issuedAt ? new Date(item.issuedAt).toLocaleDateString('vi-VN') : '',
    effectiveAt: item.effectiveAt ? new Date(item.effectiveAt).toLocaleDateString('vi-VN') : '',
    documentType: item.documentType || 'Văn bản – Tài liệu',
    category: cat,
    issuer: item.issuer || hospitalName,
    signer: item.signer,
    summary: item.summary,
    content: item.content,
    fileUrl,
    fileName,
    fileFormat,
    accessMode: item.accessMode || 'public',
    accessCollection: 'documents' as const,
    allowDownload: item.allowDownload !== false,
    preventCopy: Boolean(item.preventCopy),
    preventPrint: Boolean(item.preventPrint),
    showViewer: item.showViewer !== false,
    textAlign: item.textAlign || 'left',
    titleColor: item.titleColor || 'default',
    titleSize: item.titleSize || 'normal',
    summaryColor: item.summaryColor || 'default',
    summarySize: item.summarySize || 'normal',
  }

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Văn bản – Tài liệu', href: '/van-ban' },
    ...(cat ? [{ label: cat }] : []),
  ]

  const mappedRelated = related.map((rel: any) => ({
    id: rel.id,
    title: rel.title,
    slug: rel.slug,
    publishedAt: rel.issuedAt,
    categoryName: categoryName(rel) || rel.category || 'Văn bản',
    excerpt: rel.summary,
  }))

  return (
    <ArticleDetailTemplate
      breadcrumbs={breadcrumbs}
      title={item.title}
      publishedDate={item.issuedAt ? new Date(item.issuedAt).toLocaleDateString('vi-VN') : ''}
      categoryName={cat}
      categoryHref="/van-ban"
      excerpt={item.summary}
      content={null}
      customBodyTop={<DocumentDetailView doc={docData} hideHeader />}
      hospitalName={hospitalName}
      adminConfig={theme?.detailLayout}
      displaySettings={displaySettings}
      articleDetailSettings={articleDetailSettings}
      sidebarTitle="Văn bản mới nhất"
      latestItems={mappedRelated}
      relatedTitle="Văn bản & Tài liệu liên quan"
      relatedItems={mappedRelated}
      showSource={false}
      showViews={false}
      baseHref="/van-ban"
    />
  )
}
