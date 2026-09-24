import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { CompactWarningFilter, type WarningDirectoryItem } from '@/components/CompactWarningFilter'
import { getCMS } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { categoryName, getDefaultContentMedia } from '@/lib/defaultMedia'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Góc cảnh báo & Khuyến cáo y tế – Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Cập nhật kịp thời các cảnh báo dịch bệnh, an toàn thực phẩm, phòng ngừa lừa đảo y tế và các khuyến cáo khẩn cấp từ Bệnh viện Đa khoa Khu vực Thới Lai và Ngành Y tế.',
}

export default async function WarningPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const requestedLevel = (await searchParams).level || 'all'
  let items: WarningDirectoryItem[] = []

  try {
    const payload = await getCMS()
    const [warningsRes, defaults] = await Promise.all([
      payload.find({
        collection: 'health-warnings' as any,
        where: { _status: { equals: 'published' } },
        sort: ['-pinned', '-publishedAt', '-createdAt'],
        limit: 100,
        depth: 2,
      }).catch(async () => {
        // Fallback: nếu chưa có collection hoặc dữ liệu cũ ở notices
        return payload.find({
          collection: 'notices',
          where: {
            and: [
              { _status: { equals: 'published' } },
              {
                or: [
                  { homePlacement: { in: ['warning', 'both'] } },
                  { level: { in: ['urgent', 'important'] } },
                ],
              },
            ],
          },
          sort: '-startAt',
          limit: 100,
          depth: 2,
        }).catch(() => ({ docs: [] }))
      }),
      getDefaultContentMedia(),
    ])

    items = (warningsRes.docs as any[]).map(x => {
      const dateRaw = x.publishedAt || x.startAt || x.createdAt
      const dateStr = dateRaw ? new Date(dateRaw).toLocaleDateString('vi-VN') : ''
      const cat = categoryName(x) || (x.noticeType && x.noticeType !== 'normal' ? x.noticeType : undefined) || 'Cảnh báo y tế'

      return {
        id: `warning-${x.id}`,
        title: x.title,
        slug: x.slug,
        href: `/goc-canh-bao/${x.slug}`,
        date: dateStr,
        rawDate: dateRaw,
        level: x.level || 'urgent',
        excerpt: x.excerpt || 'Thông tin cảnh báo & khuyến cáo y tế chính thức từ Bệnh viện Đa khoa Khu vực Thới Lai.',
        coverUrl: mediaUrl(x.cover || x.seoImage) || defaults.notices,
        category: cat,
      }
    })
  } catch (err) {
    console.error('Lỗi tải dữ liệu góc cảnh báo:', err)
  }

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CẢNH BÁO Y TẾ & CỘNG ĐỒNG"
        title="Góc cảnh báo & Khuyến cáo sức khỏe"
        description="Thông tin cảnh báo dịch bệnh, an toàn vệ sinh thực phẩm, phòng chống lừa đảo y tế và khuyến cáo khẩn cấp từ Bệnh viện Đa khoa Khu vực Thới Lai."
      />
      <main className="section" style={{ background: '#f8fafc', minHeight: '80vh', padding: '36px 0 64px' }}>
        <div className="container">
          <CompactWarningFilter items={items} initialLevel={requestedLevel} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
