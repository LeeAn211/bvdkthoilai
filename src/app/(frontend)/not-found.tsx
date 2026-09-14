import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export default function NotFound() {
  return <><SiteHeader/><main className="notFoundPage container"><span>404</span><h1>Không tìm thấy nội dung</h1><p>Trang bạn đang tìm có thể đã được chuyển, ẩn hoặc không còn tồn tại.</p><div><a className="btn btn-primary" href="/">Về trang chủ</a><a className="btn btn-outline" href="/tin-tuc">Xem tin tức</a></div></main><SiteFooter/></>
}
