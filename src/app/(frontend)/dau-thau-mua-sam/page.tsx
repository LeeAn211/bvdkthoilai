import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { DocumentDirectoryView, type DocumentDirectoryItem } from '@/components/DocumentDirectoryView'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Đấu thầu – Mua sắm – Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Thông tin đấu thầu, mua sắm công khai: yêu cầu báo giá, thông báo mời thầu, kế hoạch lựa chọn nhà thầu và kết quả đấu thầu tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function Page() {
  let items: DocumentDirectoryItem[] = []

  try {
    const payload = await getCMS()
    const [r, defaults] = await Promise.all([
      payload.find({ collection: 'procurement', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 200, depth: 2 }).catch(() => ({ docs: [] })),
      getDefaultContentMedia(),
    ])

    items = (r.docs as any[]).map(x => {
      const dateRaw = x.publishedAt
      const dateStr = dateRaw ? new Date(dateRaw).toLocaleDateString('vi-VN') : ''
      const yearStr = dateRaw ? String(new Date(dateRaw).getFullYear()) : ''
      const cat = categoryName(x) || x.type || x.procurementType || 'Đấu thầu – Mua sắm'

      const statusMap: Record<string, string> = {
        open: '🟢 Đang tiếp nhận',
        closing: '🟡 Sắp hết hạn',
        closed: '🔴 Đã hết hạn',
        cancelled: '⚫ Đã hủy',
      }
      const statusLabel = statusMap[x.procurementStatus] || ''

      const summaryParts: string[] = []
      if (statusLabel) summaryParts.push(statusLabel)
      if (x.deadlineAt) summaryParts.push(`⏰ Hạn nộp: ${new Date(x.deadlineAt).toLocaleDateString('vi-VN')}`)
      if (x.excerpt) summaryParts.push(x.excerpt)
      if (summaryParts.length === 0) {
        summaryParts.push('Hồ sơ mời thầu, báo giá công khai phục vụ hoạt động y tế của Bệnh viện Đa khoa Khu vực Thới Lai.')
      }

      return {
        id: `proc-${x.id}`,
        title: x.title,
        slug: x.slug,
        number: x.referenceCode || undefined,
        category: cat,
        documentType: cat,
        issuer: x.contactUnit || 'BVĐK Khu vực Thới Lai',
        issuedAt: dateRaw,
        date: dateStr,
        year: yearStr,
        summary: summaryParts.join(' • '),
        excerpt: x.excerpt || 'Thông tin đấu thầu – mua sắm công khai từ Bệnh viện Đa khoa Khu vực Thới Lai.',
        coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.procurement,
        href: `/dau-thau-mua-sam/${x.slug}`,
        accessMode: 'public' as const,
        allowDownload: true,
      }
    })
  } catch {}

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="ĐẤU THẦU – MUA SẮM"
        title="Thông tin đấu thầu & mua sắm"
        description="Yêu cầu báo giá, thông báo mời thầu, kế hoạch lựa chọn nhà thầu và kết quả đấu thầu công khai."
      />
      <main className="section" style={{ background: '#f8fafc', minHeight: '80vh', padding: '36px 0 64px' }}>
        <div className="container">
          <DocumentDirectoryView
            items={items}
            title="Danh sách hồ sơ đấu thầu"
            eyebrow="TRA CỨU ĐẤU THẦU – MUA SẮM"
            emptyText="Chưa có hồ sơ đấu thầu nào được đăng."
            hideColumns={['issuer']}
            searchPlaceholder="Tìm theo mã gói thầu, tên dự toán..."
            columnLabels={{
              number: 'Mã số / Ký hiệu gói thầu',
              date: 'Ngày đăng tải',
              title: 'Tên gói thầu & Thông tin chi tiết',
              action: 'Xem hồ sơ',
            }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
