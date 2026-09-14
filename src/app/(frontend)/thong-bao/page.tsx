import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SearchFilter } from '@/components/SearchFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'
export const revalidate = 60
export default async function Page() {
  let items:any[]=[]
  try {
    const p=await getCMS()
    const [r, defaults]=await Promise.all([
      p.find({collection:'notices',where:{_status:{equals:'published'}},sort:'-startAt',limit:100,depth:2}),
      getDefaultContentMedia(),
    ])
    items=(r.docs as any[]).map(x=>({...x,category:categoryName(x),coverUrl:mediaUrl(x.cover||x.seoImage)||defaults.notices,date:x.publishedAt?new Date(x.publishedAt).toLocaleDateString('vi-VN'):(x.startAt?new Date(x.startAt).toLocaleDateString('vi-VN'):''),meta:x.expireAt?`Hết hiệu lực: ${new Date(x.expireAt).toLocaleDateString('vi-VN')}`:'',href:`/thong-bao/${x.slug}`}))
  } catch {}
  return <><SiteHeader/><PageHero eyebrow="THÔNG BÁO" title="Thông báo từ bệnh viện" description="Thông báo mới, quan trọng và thông báo khẩn."/><main className="section"><div className="container"><SearchFilter items={items} kind="notice"/></div></main><SiteFooter/></>
}
