import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getCMS, getGlobal } from '@/lib/payload'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PageHero } from '@/components/PageHero'
import { SearchFilter } from '@/components/SearchFilter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { mediaUrl } from '@/lib/media'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'

type Props = { params: Promise<{ path: string[] }> }

export const dynamic = 'force-dynamic'

async function findSection(sectionSlug: string) {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'content-sections',
    where: { and: [{ slug: { equals: sectionSlug } }, { active: { equals: true } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return result.docs?.[0] as any
}

async function findPost(sectionId: string | number, slug: string) {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'custom-posts',
    where: { and: [{ section: { equals: sectionId } }, { slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return result.docs?.[0] as any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { path = [] } = await params
    if (path.length === 1) {
      const section = await findSection(path[0])
      if (!section) return {}
      const image = mediaUrl(section.seoImage || section.defaultImage)
      return {
        title: section.seoTitle || section.title,
        description: section.seoDescription || section.description,
        openGraph: { title: section.seoTitle || section.title, description: section.seoDescription || section.description, images: image ? [image] : [] },
      }
    }
    if (path.length === 2) {
      const section = await findSection(path[0])
      if (!section) return {}
      const item = await findPost(section.id, path[1])
      if (!item) return {}
      const image = mediaUrl(item.seoImage || item.cover || section.defaultImage)
      return {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.excerpt,
        openGraph: { title: item.seoTitle || item.title, description: item.seoDescription || item.excerpt, images: image ? [image] : [] },
      }
    }
  } catch {}
  return {}
}

export default async function RedirectResolver({ params }: Props) {
  const { path = [] } = await params

  // Mục nội dung được tạo từ Menu dùng URL trực tiếp giống /thong-bao:
  // /chuyen-doi-so và /chuyen-doi-so/ten-bai-viet.
  if (path.length === 1) {
    const section = await findSection(path[0]).catch(() => null)
    if (section) {
      const payload = await getCMS()
      const result = await payload.find({
        collection: 'custom-posts',
        where: { and: [{ section: { equals: section.id } }, { _status: { equals: 'published' } }] },
        sort: '-publishedAt',
        limit: 100,
        depth: 2,
      })
      const fallback = mediaUrl(section.defaultImage || section.seoImage)
      const items = (result.docs as any[]).map((item) => ({
        ...item,
        category: section.title,
        coverUrl: mediaUrl(item.cover || item.seoImage) || fallback,
        date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : '',
        href: `/${section.slug}/${item.slug}`,
      }))
      return <><SiteHeader/><PageHero eyebrow="NỘI DUNG" title={section.title} description={section.description || `Thông tin và bài viết thuộc mục ${section.title}.`}/><main className="section"><div className="container"><SearchFilter items={items} kind="custom"/></div></main><SiteFooter/></>
    }
  }

  if (path.length === 2) {
    const section = await findSection(path[0]).catch(() => null)
    if (section) {
      const [item, theme, relatedRes] = await Promise.all([
        findPost(section.id, path[1]).catch(() => null),
        getGlobal('theme-settings').catch(() => null) as Promise<any>,
        getCMS().then((p) =>
          p.find({
            collection: 'custom-posts',
            where: {
              and: [
                { section: { equals: section.id } },
                { slug: { not_equals: path[1] } },
                { _status: { equals: 'published' } },
              ],
            },
            sort: '-publishedAt',
            limit: 6,
            depth: 1,
          })
        ).catch(() => ({ docs: [] })),
      ])

      if (item) {
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
        } else if (slugList.includes(section.slug?.trim().toLowerCase())) {
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
            { label: section.title, href: `/${section.slug}` },
            { label: item.title },
          ]

          const mappedRelated = ((relatedRes as any)?.docs || []).map((rel: any) => ({
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
              categoryHref={`/${section.slug}`}
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
              baseHref={`/${section.slug}`}
            />
          )
        }

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
              <BackToList href={`/${section.slug}`} label={`Trở lại ${section.title}`} />
            </main>
            <SiteFooter />
          </>
        )
      }
    }
  }

  const fromPath = `/${path.join('/')}`
  try {
    const payload = await getCMS()
    const result: any = await payload.find({
      collection: 'redirects',
      where: { and: [{ fromPath: { equals: fromPath } }, { active: { equals: true } }] },
      limit: 1,
      depth: 0,
    })
    const redirect = result.docs?.[0]
    if (redirect?.toPath && redirect.toPath !== fromPath) permanentRedirect(redirect.toPath)
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_REDIRECT')) throw error
  }
  notFound()
}
