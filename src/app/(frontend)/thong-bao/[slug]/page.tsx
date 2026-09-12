import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'

type Props = { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const p = await getCMS()
  const [current, latest] = await Promise.all([
    p.find({
      collection: 'notices',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    }),
    p.find({
      collection: 'notices',
      where: { and: [{ slug: { not_equals: slug } }, { _status: { equals: 'published' } }] },
      sort: '-publishedAt',
      limit: 6,
      depth: 1,
    }),
  ])
  return {
    item: (current.docs[0] as any) || null,
    related: (latest.docs as any[]) || [],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const [{ item }, defaults] = await Promise.all([getData(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover) || defaults.notices
    return {
      title: item.seoTitle || item.title,
      description: item.seoDescription || item.excerpt,
      openGraph: {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.excerpt,
        images: image ? [image] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [{ item, related }, theme] = await Promise.all([
    getData(slug),
    getGlobal('theme-settings').catch(() => null) as Promise<any>,
  ])

  if (!item) notFound()

  const publishedDate = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString('vi-VN')
    : item.startAt
    ? new Date(item.startAt).toLocaleDateString('vi-VN')
    : ''

  const expireDate = item.expireAt
    ? new Date(item.expireAt).toLocaleDateString('vi-VN')
    : undefined

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Thông báo', href: '/thong-bao' },
    ...(item.level ? [{ label: item.level }] : []),
  ]

  const mappedRelated = related.map((rel: any) => ({
    id: rel.id,
    title: rel.title,
    slug: rel.slug,
    publishedAt: rel.publishedAt,
    categoryName: rel.level || 'THÔNG BÁO',
    excerpt: rel.excerpt,
  }))

  return (
    <ArticleDetailTemplate
      breadcrumbs={breadcrumbs}
      title={item.title}
      publishedDate={publishedDate}
      views={item.views || 128}
      categoryName={item.level || 'Thông báo Bệnh viện'}
      categoryHref="/thong-bao"
      expireDate={expireDate}
      excerpt={item.excerpt}
      content={item.content}
      attachments={item.attachments}
      attachmentTitle="Tài liệu / Văn bản đính kèm"
      sourceName={item.source || undefined}
      adminConfig={theme?.detailLayout}
      sidebarTitle="Thông báo mới nhất"
      latestItems={mappedRelated}
      relatedTitle="Tin tức cùng chuyên mục"
      relatedItems={mappedRelated}
      baseHref="/thong-bao"
    />
  )
}
