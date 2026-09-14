import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'

type Props = { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const payload = await getCMS()
  const [current, latest] = await Promise.all([
    payload.find({
      collection: 'news',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: 'news',
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
  const { slug } = await params
  try {
    const [{ item }, defaults] = await Promise.all([getData(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover) || defaults.news
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

  // Kiểm tra cấu hình trong Admin: ThemeSettings.detailLayout.applyNews (mặc định bật)
  const isBạchMaiLayout = theme?.detailLayout?.applyNews !== false

  const catName = categoryName(item) || item.category || 'Tin hoạt động Bệnh viện'
  const publishedDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : ''

  if (isBạchMaiLayout) {
    const breadcrumbs = [
      { label: 'Trang chủ', href: '/' },
      { label: 'Tin tức', href: '/tin-tuc' },
      ...(catName ? [{ label: catName }] : []),
    ]

    const mappedRelated = related.map((rel: any) => ({
      id: rel.id,
      title: rel.title,
      slug: rel.slug,
      publishedAt: rel.publishedAt,
      categoryName: categoryName(rel) || rel.category || 'Tin tức',
      excerpt: rel.excerpt,
    }))

    return (
      <ArticleDetailTemplate
        breadcrumbs={breadcrumbs}
        title={item.title}
        publishedDate={publishedDate}
        views={item.views || 156}
        categoryName={catName}
        categoryHref="/tin-tuc"
        excerpt={item.excerpt}
        content={item.content}
        attachments={item.attachments}
        attachmentTitle="Tài liệu / Tệp đính kèm"
        sourceName={item.source || undefined}
        adminConfig={theme?.detailLayout}
        sidebarTitle="Tin tức mới nhất"
        latestItems={mappedRelated}
        relatedTitle="Tin tức cùng chuyên mục"
        relatedItems={mappedRelated}
        baseHref="/tin-tuc"
      />
    )
  }

  // Giao diện cổ điển fallback nếu quản trị viên tắt trong Admin
  return (
    <>
      <SiteHeader />
      <main className="article-shell container">
        <div className="article-meta">
          {catName} · {publishedDate}
        </div>
        <h1>{item.title}</h1>
        {item.excerpt && <p className="article-lead">{item.excerpt}</p>}
        <RichText data={item.content} />
        <AttachmentList items={item.attachments} />
        <BackToList href="/tin-tuc" label="Trở lại danh sách tin tức" />
      </main>
      <SiteFooter />
    </>
  )
}
