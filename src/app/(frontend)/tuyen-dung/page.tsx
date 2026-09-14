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
    const [r, defaults]=await Promise.all([
      p.find({collection:'recruitment',where:{_status:{equals:'published'}},sort:'-publishedAt',limit:100,depth:2}),
      getDefaultContentMedia(),
    ])
    items=(r.docs as any[]).map(x=>({
      ...x,
      category: categoryName(x) || 'Tuyển dụng',
      coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.recruitment,
      date: x.publishedAt ? new Date(x.publishedAt).toLocaleDateString('vi-VN') : '',
      meta: x.deadlineAt ? `Hạn nộp: ${new Date(x.deadlineAt).toLocaleDateString('vi-VN')}` : '',
      href: `/tuyen-dung/${x.slug}`,
    }))
  }catch{}
  return <><SiteHeader/><PageHero eyebrow="TUYỂN DỤNG" title="Thông tin tuyển dụng" description="Thông tin vị trí tuyển dụng và thời hạn tiếp nhận hồ sơ."/><main className="section"><div className="container"><SearchFilter items={items} kind="recruitment"/></div></main><SiteFooter/></>
}
