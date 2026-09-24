import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'

type Props = { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const p = await getCMS()

  // 1. Tìm trong collection health-warnings trước
  let currentRes = await p.find({
    collection: 'health-warnings' as any,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  }).catch(() => ({ docs: [] }))

  let collectionName: 'health-warnings' | 'notices' = 'health-warnings'

  // 2. Nếu không tìm thấy, fallback tìm trong notices (bài cũ chưa chuyển)
  if (!currentRes.docs || currentRes.docs.length === 0) {
    currentRes = await p.find({
      collection: 'notices',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 2,
    }).catch(() => ({ docs: [] }))
    if (currentRes.docs && currentRes.docs.length > 0) {
      collectionName = 'notices'
    }
  }

  // 3. Lấy bài viết liên quan
  const relatedRes = await p.find({
    collection: collectionName as any,
    where: { and: [{ slug: { not_equals: slug } }, { _status: { equals: 'published' } }] },
    sort: '-publishedAt',
    limit: 6,
    depth: 2,
  }).catch(() => ({ docs: [] }))

  return {
    item: (currentRes.docs[0] as any) || null,
    related: (relatedRes.docs as any[]) || [],
    collectionName,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const [{ item }, defaults] = await Promise.all([getData(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.cover || item.image || item.seoImage) || defaults.notices || defaults.news
    return {
      title: item.seoTitle || `${item.title} – Cảnh báo y tế`,
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
  const [{ item, related, collectionName }, defaults, theme, siteSettings, displaySettings, articleDetailSettings] = await Promise.all([
    getData(slug),
    getDefaultContentMedia(),
    getGlobal('theme-settings').catch(() => null) as Promise<any>,
    getGlobal('site-settings').catch(() => null) as Promise<any>,
    getGlobal('display-settings').catch(() => null) as Promise<any>,
    getGlobal('article-detail-settings').catch(() => null) as Promise<any>,
  ])

  if (!item) notFound()

  const hospitalName = siteSettings?.hospitalName || 'Bệnh viện Đa khoa Khu vực Thới Lai'

  const publishedDate = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString('vi-VN')
    : item.startAt
    ? new Date(item.startAt).toLocaleDateString('vi-VN')
    : ''

  const levelLabels: Record<string, string> = {
    urgent: 'Khẩn cấp',
    important: 'Quan trọng',
    normal: 'Khuyến cáo cộng đồng',
  }
  const levelLabel = (lvl: string | undefined | null) =>
    lvl ? (levelLabels[lvl] ?? 'Cảnh báo y tế') : 'Cảnh báo y tế'

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Góc cảnh báo', href: '/goc-canh-bao' },
    ...(item.level ? [{ label: levelLabel(item.level) }] : []),
  ]

  const mappedRelated = related.map((rel: any) => ({
    id: rel.id,
    title: rel.title,
    slug: rel.slug,
    publishedAt: rel.publishedAt,
    categoryName: levelLabel(rel.level),
    excerpt: rel.excerpt,
  }))

  return (
    <ArticleDetailTemplate
      breadcrumbs={breadcrumbs}
      title={item.title}
      publishedDate={publishedDate}
      views={item.views || 128}
      categoryName={levelLabel(item.level)}
      categoryHref="/goc-canh-bao"
      excerpt={item.excerpt}
      content={item.content}
      attachments={item.attachments}
      attachmentTitle="Tài liệu / Văn bản khuyến cáo đính kèm"
      sourceName={item.source || hospitalName}
      hospitalName={hospitalName}
      showSource={item.showSource ?? true}
      adminConfig={theme?.detailLayout}
      displaySettings={displaySettings}
      articleDetailSettings={articleDetailSettings}
      sidebarTitle="Cảnh báo mới nhất"
      latestItems={mappedRelated}
      relatedTitle="Cảnh báo & Khuyến cáo khác"
      relatedItems={mappedRelated}
      baseHref="/goc-canh-bao"
      trackingSlug={slug}
      trackingCollection={collectionName}
    />
  )
}
