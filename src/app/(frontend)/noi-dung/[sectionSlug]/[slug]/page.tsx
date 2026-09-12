import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'

type Props = { params: Promise<{ sectionSlug: string; slug: string }> }

async function getData(sectionSlug: string, slug: string) {
  const p = await getCMS()
  const sections = await p.find({
    collection: 'content-sections',
    where: { and: [{ slug: { equals: sectionSlug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
  })
  const section = sections.docs[0] as any
  if (!section) return { section: null, item: null, related: [] }

  const [posts, related] = await Promise.all([
    p.find({
      collection: 'custom-posts',
      where: {
        and: [
          { section: { equals: section.id } },
          { slug: { equals: slug } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 1,
      depth: 2,
    }),
    p.find({
      collection: 'custom-posts',
      where: {
        and: [
          { section: { equals: section.id } },
          { slug: { not_equals: slug } },
          { _status: { equals: 'published' } },
        ],
      },
      sort: '-publishedAt',
      limit: 6,
      depth: 2,
    }),
  ])

  return {
    section,
    item: posts.docs[0] as any,
    related: (related.docs as any[]) || [],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { sectionSlug, slug } = await params
    const { item } = await getData(sectionSlug, slug)
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover)
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
  const { sectionSlug, slug } = await params
  const [{ section, item, related }, theme] = await Promise.all([
    getData(sectionSlug, slug),
    getGlobal('theme-settings').catch(() => null) as Promise<any>,
  ])

  if (!section || !item) notFound()

  // Xác định áp dụng mẫu chuẩn Bạch Mai theo mức ưu tiên:
  // 1. Nếu bài viết hoặc mục nội dung chọn trực tiếp: 'bachmai' -> true, 'classic' -> false
  // 2. Nếu nằm trong danh sách customSectionSlugs cấu hình trong Admin Theme
  // 3. Nếu bật applyAllNewSections hoặc applyCustomPosts trong Admin Theme
  let isBạchMaiLayout = true
  const customSlugsText = String(theme?.detailLayout?.customSlugsText || '')
  const slugList = customSlugsText
    .split(',')
    .map((s: string) => s.trim().toLowerCase())
    .filter(Boolean)

  if (item.layoutTemplate === 'bachmai' || section.layoutTemplate === 'bachmai') {
    isBạchMaiLayout = true
  } else if (item.layoutTemplate === 'classic' || section.layoutTemplate === 'classic') {
    isBạchMaiLayout = false
  } else if (slugList.includes(sectionSlug?.trim().toLowerCase())) {
    isBạchMaiLayout = true
  } else {
    isBạchMaiLayout =
      theme?.detailLayout?.applyAllNewSections !== false &&
      theme?.detailLayout?.applyCustomPosts !== false
  }

  const publishedDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : ''

  if (isBạchMaiLayout) {
    const breadcrumbs = [
      { label: 'Trang chủ', href: '/' },
      { label: section.title, href: `/noi-dung/${section.slug}` },
      { label: item.title },
    ]

    const mappedRelated = related.map((rel: any) => ({
      id: rel.id,
      title: rel.title,
      slug: rel.slug,
      publishedAt: rel.publishedAt,
      categoryName: section.title,
      excerpt: rel.excerpt,
    }))

    return (
      <ArticleDetailTemplate
        breadcrumbs={breadcrumbs}
        title={item.title}
        publishedDate={publishedDate}
        views={item.views || 68}
        categoryName={section.title}
        categoryHref={`/noi-dung/${section.slug}`}
        excerpt={item.excerpt}
        content={item.content}
        attachments={item.attachments}
        attachmentTitle="Tài liệu đính kèm"
        sourceName={item.source || undefined}
        adminConfig={theme?.detailLayout}
        sidebarTitle="Bài viết mới"
        latestItems={mappedRelated}
        relatedTitle={`Bài viết cùng mục ${section.title}`}
        relatedItems={mappedRelated}
        baseHref={`/noi-dung/${section.slug}`}
      />
    )
  }

  // Fallback layout
  return (
    <>
      <SiteHeader />
      <main className="article-shell container">
        <div className="article-meta">
          {String(section.title || 'NỘI DUNG').toUpperCase()}
          {publishedDate ? ` · ${publishedDate}` : ''}
        </div>
        <h1>{item.title}</h1>
        {item.excerpt && <p className="articleLead">{item.excerpt}</p>}
        <RichText data={item.content} />
        <AttachmentList items={item.attachments} />
        <BackToList href={`/noi-dung/${section.slug}`} label={`Trở lại ${section.title}`} />
      </main>
      <SiteFooter />
    </>
  )
}
