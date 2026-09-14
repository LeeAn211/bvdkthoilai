import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'
export const revalidate=60
export default async function Page(){
  let items:any[]=[]
  try{
    const p=await getCMS()
    const [r, defaults]=await Promise.all([
      p.find({collection:'procurement',where:{_status:{equals:'published'}},sort:'-publishedAt',limit:100,depth:2}),
      getDefaultContentMedia(),
    ])
    items=(r.docs as any[]).map(x=>({...x,category:categoryName(x)||x.type,coverUrl:mediaUrl(x.cover||x.seoImage)||defaults.procurement,date:x.publishedAt?new Date(x.publishedAt).toLocaleDateString('vi-VN'):'',meta:x.deadlineAt?`Hạn: ${new Date(x.deadlineAt).toLocaleDateString('vi-VN')}`:'',href:`/dau-thau-mua-sam/${x.slug}`}))
  }catch{}
  return <><SiteHeader/><PageHero eyebrow="ĐẤU THẦU – MUA SẮM" title="Thông tin đấu thầu & mua sắm" description="Yêu cầu báo giá, kế hoạch lựa chọn nhà thầu và kết quả."/><main className="section"><div className="container"><SearchFilter items={items} kind="procurement"/></div></main><SiteFooter/></>
}
