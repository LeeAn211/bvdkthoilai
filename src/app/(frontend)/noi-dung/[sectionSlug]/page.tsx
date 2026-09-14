import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PageHero } from '@/components/PageHero'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

type Props = { params: Promise<{ sectionSlug: string }> }

async function getSection(sectionSlug: string) {
  const p = await getCMS()
  const r = await p.find({
    collection: 'content-sections',
    where: { and: [{ slug: { equals: sectionSlug } }, { active: { equals: true } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return r.docs[0] as any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const section = await getSection((await params).sectionSlug)
    if (!section) return {}
    const image = mediaUrl(section.seoImage || section.defaultImage)
    return {
      title: section.seoTitle || section.title,
      description: section.seoDescription || section.description,
      openGraph: { title: section.seoTitle || section.title, description: section.seoDescription || section.description, images: image ? [image] : [] },
    }
  } catch { return {} }
}

export default async function Page({ params }: Props) {
  const { sectionSlug } = await params
  const section = await getSection(sectionSlug)
  if (!section) notFound()
  const p = await getCMS()
  const r = await p.find({
    collection: 'custom-posts',
    where: { and: [{ section: { equals: section.id } }, { _status: { equals: 'published' } }] },
    sort: '-publishedAt',
    limit: 100,
    depth: 2,
  })
  const fallback = mediaUrl(section.defaultImage || section.seoImage)
  const items = (r.docs as any[]).map(x => ({
    ...x,
    category: section.title,
    coverUrl: mediaUrl(x.cover || x.seoImage) || fallback,
    date: x.publishedAt ? new Date(x.publishedAt).toLocaleDateString('vi-VN') : '',
    href: `/noi-dung/${section.slug}/${x.slug}`,
  }))

  return <><SiteHeader/><PageHero eyebrow="NỘI DUNG" title={section.title} description={section.description || `Thông tin và bài viết thuộc mục ${section.title}.`}/><main className="section"><div className="container"><SearchFilter items={items} kind="custom"/></div></main><SiteFooter/></>
}
