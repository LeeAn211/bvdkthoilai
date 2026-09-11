import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
type Props={params:Promise<{slug:string}>}
async function getItem(slug:string){const p=await getCMS();const r=await p.find({collection:'procurement',where:{and:[{slug:{equals:slug}},{_status:{equals:'published'}}]},limit:1,depth:1});return r.docs[0] as any}
export async function generateMetadata({params}:Props):Promise<Metadata>{try{const [item,defaults]=await Promise.all([getItem((await params).slug),getDefaultContentMedia()]);if(!item)return{};const image=mediaUrl(item.seoImage||item.cover)||defaults.procurement;return{title:item.seoTitle||item.title,description:item.seoDescription||item.excerpt,openGraph:{title:item.seoTitle||item.title,description:item.seoDescription||item.excerpt,images:image?[image]:[]}}}catch{return{}}}
export default async function Page({params}:Props){
  const {slug}=await params
  const item:any=await getItem(slug)
  if(!item)notFound()
  return <><SiteHeader/><main className="article-shell container"><div className="article-meta">{item.type}{item.referenceCode ? ` · ${item.referenceCode}` : ''}{item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString('vi-VN')}` : ''}</div><h1>{item.title}</h1>{item.excerpt&&<p className="articleLead">{item.excerpt}</p>}<div className="procurement-summary"><span>Trạng thái: <b>{item.procurementStatus}</b></span><span>Hạn tiếp nhận: <b>{item.deadlineAt?new Date(item.deadlineAt).toLocaleDateString('vi-VN'):'-'}</b></span></div><RichText data={item.content}/><AttachmentList items={item.attachments} title="Hồ sơ – tài liệu"/>{item.changeLog?.length>0&&<div className="change-log"><h2>Lịch sử cập nhật</h2>{item.changeLog.map((x:any,i:number)=><p key={i}>{new Date(x.date).toLocaleString('vi-VN')} — {x.note}</p>)}</div>}<BackToList href="/dau-thau-mua-sam" label="Trở lại danh sách đấu thầu – mua sắm"/></main><SiteFooter/></>
}
