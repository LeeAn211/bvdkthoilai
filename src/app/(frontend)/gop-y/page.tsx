import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FeedbackForm } from '@/components/FeedbackForm'
export const metadata = { title: 'Góp ý – Phản ánh' }
export default function Page(){return <><SiteHeader/><PageHero eyebrow="CSKH" title="Góp ý – Phản ánh" description="Gửi ý kiến đến bệnh viện và nhận mã để theo dõi tiến độ xử lý."/><main className="section"><div className="container narrow"><FeedbackForm/><p className="feedback-lookup-link"><a href="/gop-y/tra-cuu">Đã gửi phản ánh? Tra cứu tiến độ →</a></p></div></main><SiteFooter/></>}
