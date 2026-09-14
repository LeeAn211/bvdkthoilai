import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { AttachmentList } from '@/components/AttachmentList'
type Props={params:Promise<{slug:string}>}
export default async function Page({params}:Props){
  const {slug}=await params
  const p=await getCMS()
  const r=await p.find({collection:'pages',where:{and:[{slug:{equals:slug}},{_status:{equals:'published'}}]},limit:1,depth:1})
  const page:any=r.docs[0]
  if(!page)notFound()
  return <><SiteHeader/><main className="article-shell container"><h1>{page.title}</h1>{page.layout?.map((b:any,i:number)=>b.blockType==='richText'?<RichText key={i} data={b.content}/>:b.blockType==='imageText'?<section className={`image-text ${b.imagePosition}`} key={i}>{mediaUrl(b.image,'article')?<img className="contentImage" src={mediaUrl(b.image,'article')} alt={b.image?.alt||page.title}/>:<div className="image-placeholder">Hình ảnh</div>}<RichText data={b.content}/></section>:b.blockType==='gallery'?<section className="contentGallery" key={i}>{(b.images||[]).map((entry:any,j:number)=>{const url=mediaUrl(entry.image,'card');return url?<figure key={entry.id||j}><img src={url} loading="lazy" decoding="async" alt={entry.image?.alt||`${page.title} – ảnh ${j+1}`}/>{entry.image?.caption&&<figcaption>{entry.image.caption}</figcaption>}</figure>:null})}</section>:b.blockType==='faq'?<section key={i}><h2>Câu hỏi thường gặp</h2>{b.items?.map((x:any,j:number)=><details key={j}><summary>{x.question}</summary><p>{x.answer}</p></details>)}</section>:b.blockType==='downloads'?<AttachmentList key={i} items={b.items} title="Tài liệu"/>:null)}<AttachmentList items={page.attachments}/></main><SiteFooter/></>
}
