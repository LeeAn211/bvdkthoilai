import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
type Props={params:Promise<{slug:string}>}
async function getItem(slug:string){const p=await getCMS();const r=await p.find({collection:'notices',where:{and:[{slug:{equals:slug}},{_status:{equals:'published'}}]},limit:1,depth:1});return r.docs[0] as any}
export async function generateMetadata({params}:Props):Promise<Metadata>{try{const item=await getItem((await params).slug);if(!item)return{};const image=mediaUrl(item.seoImage||item.cover);return{title:item.seoTitle||item.title,description:item.seoDescription||item.excerpt,openGraph:{title:item.seoTitle||item.title,description:item.seoDescription||item.excerpt,images:image?[image]:[]}}}catch{return{}}}
export default async function Page({params}:Props){
  const {slug}=await params
  const item:any=await getItem(slug)
  if(!item)notFound()
  return <><SiteHeader/><main className="article-shell container"><div className="article-meta">THÔNG BÁO · {item.level}{item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString('vi-VN')}` : ''}</div><h1>{item.title}</h1>{item.excerpt&&<p className="articleLead">{item.excerpt}</p>}<RichText data={item.content}/><AttachmentList items={item.attachments}/><BackToList href="/thong-bao" label="Trở lại danh sách thông báo"/></main><SiteFooter/></>
}
