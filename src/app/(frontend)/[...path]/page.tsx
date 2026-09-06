import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getCMS } from '@/lib/payload'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PageHero } from '@/components/PageHero'
import { SearchFilter } from '@/components/SearchFilter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { mediaUrl } from '@/lib/media'

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
      const item = await findPost(section.id, path[1]).catch(() => null)
      if (item) {
        return <><SiteHeader/><main className="article-shell container"><div className="article-meta">{String(section.title || 'NỘI DUNG').toUpperCase()}{item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString('vi-VN')}` : ''}</div><h1>{item.title}</h1>{item.excerpt&&<p className="articleLead">{item.excerpt}</p>}<RichText data={item.content}/><AttachmentList items={item.attachments}/><BackToList href={`/${section.slug}`} label={`Trở lại ${section.title}`}/></main><SiteFooter/></>
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
