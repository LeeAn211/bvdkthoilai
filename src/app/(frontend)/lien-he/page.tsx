import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { FeedbackForm } from '@/components/FeedbackForm'
import { getGlobal } from '@/lib/payload'

const defaultAddress = 'Ấp Thới Phong, Xã Thới Lai, Thành phố Cần Thơ'

function getGoogleMapsUrl(value: unknown, address: string) {
  const raw = typeof value === 'string' ? value.trim() : ''
  const iframeSrc = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1]
  const candidate = (iframeSrc || raw).replaceAll('&amp;', '&')

  if (candidate) {
    try {
      const url = new URL(candidate)
      const googleHost = url.hostname === 'google.com' || url.hostname.endsWith('.google.com')
      if (url.protocol === 'https:' && googleHost && (url.pathname.includes('/embed') || url.searchParams.get('output') === 'embed')) {
        return url.toString()
      }
    } catch {
      // Nếu mã không hợp lệ, tự tạo bản đồ theo địa chỉ bên dưới.
    }
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
}

export default async function Page() {
  let settings: any = {}
  try {
    settings = await getGlobal('site-settings')
  } catch {}

  const hospitalName = settings.hospitalName || 'Bệnh viện Đa khoa Khu vực Thới Lai'
  const address = settings.address || defaultAddress
  const mapUrl = getGoogleMapsUrl(settings.googleMapsEmbed, address)

  return <>
    <SiteHeader />
    <PageHero eyebrow="LIÊN HỆ" title="Liên hệ bệnh viện" description="Thông tin hỗ trợ và tiếp nhận góp ý từ người bệnh." />
    <main className="section">
      <div className="container contact-page-grid">
        <div className="contact-box">
          <h2 className="contact-hospital-name" title={hospitalName}>{hospitalName}</h2>
          <p><b>Địa chỉ:</b> {address}</p>
          <p><b>Hotline:</b> {settings.hotline || 'Chưa cập nhật'}</p>
          <p><b>Email:</b> {settings.email || 'Chưa cập nhật'}</p>
          <p><b>Giờ làm việc:</b> {settings.workingHours || 'Chưa cập nhật'}</p>
          <div className="contact-map">
            <iframe src={mapUrl} title={`Bản đồ ${hospitalName}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
        <FeedbackForm />
      </div>
    </main>
    <SiteFooter />
  </>
}
