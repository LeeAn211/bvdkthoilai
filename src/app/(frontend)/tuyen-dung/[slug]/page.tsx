import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }
async function getItem(slug: string) {
  const payload = await getCMS()
  const result = await payload.find({ collection: 'recruitment', where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] }, limit: 1, depth: 1 })
  return result.docs[0] as any
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try { const item = await getItem((await params).slug); return item ? { title: item.seoTitle || item.title, description: item.seoDescription || `Thông tin tuyển dụng ${item.title}` } : {} } catch { return {} }
}
export default async function RecruitmentDetail({ params }: Props) {
  let item: any
  try { item = await getItem((await params).slug) } catch { notFound() }
  if (!item) notFound()
  return <><SiteHeader/><main className="article-shell container"><div className="article-meta">TUYỂN DỤNG{item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString('vi-VN')}` : ''}</div><h1>{item.title}</h1><div className="procurement-summary"><span>Số lượng: <b>{item.quantity || 'Theo thông báo'}</b></span><span>Hạn nhận hồ sơ: <b>{item.deadlineAt ? new Date(item.deadlineAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}</b></span></div><RichText data={item.content}/><AttachmentList items={[...(item.attachments || []), ...(item.attachment ? [{ file: item.attachment }] : [])]}/><BackToList href="/tuyen-dung" label="Trở lại danh sách tuyển dụng"/></main><SiteFooter/></>
}
