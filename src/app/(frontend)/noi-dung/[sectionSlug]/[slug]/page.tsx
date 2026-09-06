import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

type Props = { params: Promise<{ sectionSlug: string; slug: string }> }

async function getData(sectionSlug: string, slug: string) {
  const p = await getCMS()
  const sections = await p.find({ collection: 'content-sections', where: { and: [{ slug: { equals: sectionSlug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 })
  const section = sections.docs[0] as any
  if (!section) return { section: null, item: null }
  const posts = await p.find({ collection: 'custom-posts', where: { and: [{ section: { equals: section.id } }, { slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 2 })
  return { section, item: posts.docs[0] as any }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { sectionSlug, slug } = await params
    const { item } = await getData(sectionSlug, slug)
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover)
    return { title: item.seoTitle || item.title, description: item.seoDescription || item.excerpt, openGraph: { title: item.seoTitle || item.title, description: item.seoDescription || item.excerpt, images: image ? [image] : [] } }
  } catch { return {} }
}

export default async function Page({ params }: Props) {
  const { sectionSlug, slug } = await params
  const { section, item } = await getData(sectionSlug, slug)
  if (!section || !item) notFound()
  return <><SiteHeader/><main className="article-shell container"><div className="article-meta">{String(section.title || 'NỘI DUNG').toUpperCase()}{item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString('vi-VN')}` : ''}</div><h1>{item.title}</h1>{item.excerpt&&<p className="articleLead">{item.excerpt}</p>}<RichText data={item.content}/><AttachmentList items={item.attachments}/><BackToList href={`/noi-dung/${section.slug}`} label={`Trở lại ${section.title}`}/></main><SiteFooter/></>
}
