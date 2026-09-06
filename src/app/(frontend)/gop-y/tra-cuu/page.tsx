import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FeedbackLookup } from '@/components/FeedbackLookup'
export const metadata = { title: 'Tra cứu phản ánh', robots: { index: false, follow: false } }
export default async function Page({searchParams}:{searchParams:Promise<{code?:string}>}){const params=await searchParams;return <><SiteHeader/><PageHero eyebrow="CSKH" title="Tra cứu phản ánh" description="Nhập mã tiếp nhận và số điện thoại đã sử dụng khi gửi phản ánh."/><main className="section"><div className="container narrow"><FeedbackLookup initialCode={params?.code||''}/></div></main><SiteFooter/></>}
