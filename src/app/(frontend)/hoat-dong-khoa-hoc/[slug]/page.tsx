import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { RichText } from '@/components/RichText'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getDefaultContentMedia, scientificActivityGroupName } from '@/lib/defaultMedia'
import { mediaUrl } from '@/lib/media'
import { getCMS, getGlobal } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const payload = await getCMS()
  const [current, latest] = await Promise.all([
    payload.find({
      collection: 'scientific-activities',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: 'scientific-activities',
      where: { and: [{ slug: { not_equals: slug } }, { _status: { equals: 'published' } }] },
      sort: ['-featured', '-publishedAt'],
      limit: 6,
      depth: 1,
    }),
  ])

  return { item: (current.docs[0] as any) || null, related: (latest.docs as any[]) || [] }
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

  const publishedDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : ''
  const category = scientificActivityGroupName(item) || 'Hoạt động khoa học'
  const useArticleLayout = theme?.detailLayout?.applyNews !== false

  if (useArticleLayout) {
    const mappedRelated = related.map((entry: any) => ({
      id: entry.id,
      title: entry.title,
      slug: entry.slug,
      publishedAt: entry.publishedAt,
      categoryName: scientificActivityGroupName(entry) || 'Hoạt động khoa học',
      excerpt: entry.excerpt,
    }))

    return (
      <ArticleDetailTemplate
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hoạt động khoa học', href: '/hoat-dong-khoa-hoc' },
          { label: category },
        ]}
        title={item.title}
        publishedDate={publishedDate}
        views={item.views || 0}
        categoryName={category}
        categoryHref="/hoat-dong-khoa-hoc"
        excerpt={item.excerpt}
        content={item.content}
        attachments={item.attachments}
        attachmentTitle="Tài liệu / Tệp đính kèm"
        sourceName={item.source || undefined}
        adminConfig={theme?.detailLayout}
        sidebarTitle="Hoạt động khoa học mới nhất"
        latestItems={mappedRelated}
        relatedTitle="Bài viết cùng nhóm"
        relatedItems={mappedRelated}
        baseHref="/hoat-dong-khoa-hoc"
      />
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="article-shell container">
        <div className="article-meta">{category} · {publishedDate}</div>
        <h1>{item.title}</h1>
        {item.excerpt && <p className="article-lead">{item.excerpt}</p>}
        <RichText data={item.content} />
        <AttachmentList items={item.attachments} />
        <BackToList href="/hoat-dong-khoa-hoc" label="Trở lại Hoạt động khoa học" />
      </main>
      <SiteFooter />
    </>
  )
}
