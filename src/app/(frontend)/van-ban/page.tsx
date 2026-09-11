import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 60

export default async function Page(){
  let items:any[]=[]
  try{
    const p=await getCMS()
    const [r,defaults]=await Promise.all([
      p.find({collection:'documents',sort:'-issuedAt',limit:200,depth:2}),
      getDefaultContentMedia(),
    ])
    items=(r.docs as any[]).map(x=>{
      const fileUrl=mediaUrl(x.file)
      return {
        ...x,
        category:categoryName(x)||x.category||'Văn bản – Tài liệu',
        coverUrl:mediaUrl(x.cover||x.seoImage)||defaults.documents,
        date:x.issuedAt?new Date(x.issuedAt).toLocaleDateString('vi-VN'):'',
        meta:[x.number,x.issuer].filter(Boolean).join(' · '),
        excerpt:x.summary||'Văn bản, biểu mẫu và tài liệu được bệnh viện công khai.',
        href:fileUrl||'#',
        actionLabel:fileUrl?'Xem / Tải xuống':'Chưa có tệp',
        external:Boolean(fileUrl),
      }
    })
  }catch{}
  return <><SiteHeader/><PageHero eyebrow="VĂN BẢN – TÀI LIỆU" title="Kho văn bản & biểu mẫu" description="Tra cứu văn bản, quyết định, biểu mẫu và tài liệu công khai của bệnh viện."/><main className="section"><div className="container"><SearchFilter items={items} kind="document"/></div></main><SiteFooter/></>
}
