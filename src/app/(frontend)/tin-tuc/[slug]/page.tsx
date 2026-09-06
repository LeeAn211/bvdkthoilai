import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName } from '@/lib/defaultMedia'

type Props = { params: Promise<{ slug: string }> }

async function getItem(slug:string) {
  const payload = await getCMS()
  const data = await payload.find({ collection: 'news', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 })
  return data.docs[0] as any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const item = await getItem(slug)
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover)
    return { title: item.seoTitle || item.title, description: item.seoDescription || item.excerpt, openGraph: { title: item.seoTitle || item.title, description: item.seoDescription || item.excerpt, images: image ? [image] : [] } }
  } catch { return {} }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  let item:any
  try { item = await getItem(slug) } catch { notFound() }
  if (!item) notFound()
  return <>
    <SiteHeader/>
    <main className="article-shell container">
      <div className="article-meta">{categoryName(item)} · {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : ''}</div>
      <h1>{item.title}</h1>
      {item.excerpt && <p className="article-lead">{item.excerpt}</p>}
      <RichText data={item.content}/>
      <AttachmentList items={item.attachments}/>
      <BackToList href="/tin-tuc" label="Trở lại danh sách tin tức"/>
    </main>
    <SiteFooter/>
  </>
}
