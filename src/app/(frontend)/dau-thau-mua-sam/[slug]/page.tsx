import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'

type Props = { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const p = await getCMS()
  const [current, latest] = await Promise.all([
    p.find({
      collection: 'procurement',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    }),
    p.find({
      collection: 'procurement',
      where: { and: [{ slug: { not_equals: slug } }, { _status: { equals: 'published' } }] },
      sort: '-publishedAt',
      limit: 6,
      depth: 1,
    }),
  ])
  return {
    item: (current.docs[0] as any) || null,
    related: (latest.docs as any[]) || [],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const [{ item }, defaults] = await Promise.all([getData(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover) || defaults.procurement
    return {
      title: item.seoTitle || item.title,
      description: item.seoDescription || item.excerpt,
      openGraph: {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.excerpt,
        images: image ? [image] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [{ item, related }, theme] = await Promise.all([
    getData(slug),
    getGlobal('theme-settings').catch(() => null) as Promise<any>,
  ])

  if (!item) notFound()

  const isBạchMaiLayout = theme?.detailLayout?.applyProcurement !== false
  const publishedDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : ''

  const statusLabel =
    item.procurementStatus === 'open'
      ? 'Đang tiếp nhận hồ sơ'
      : item.procurementStatus === 'closing'
      ? 'Sắp hết hạn'
      : item.procurementStatus === 'closed'
      ? 'Đã hết hạn'
      : item.procurementStatus === 'cancelled'
      ? 'Đã hủy'
      : item.procurementStatus || 'Đang mở'

  if (isBạchMaiLayout) {
    const breadcrumbs = [
      { label: 'Trang chủ', href: '/' },
      { label: 'Đấu thầu – Mua sắm', href: '/dau-thau-mua-sam' },
      ...(item.type ? [{ label: item.type }] : []),
    ]

    const highlights = [
      { label: 'Trạng thái gói thầu', value: statusLabel },
      {
        label: 'Hạn tiếp nhận',
        value: item.deadlineAt ? new Date(item.deadlineAt).toLocaleDateString('vi-VN') : 'Không thời hạn',
      },
      ...(item.referenceCode ? [{ label: 'Mã tham chiếu', value: item.referenceCode }] : []),
      ...(item.contactUnit ? [{ label: 'Đơn vị phụ trách', value: item.contactUnit }] : []),
    ]

    const mappedRelated = related.map((rel: any) => ({
      id: rel.id,
      title: rel.title,
      slug: rel.slug,
      publishedAt: rel.publishedAt,
      categoryName: rel.type || 'Đấu thầu – Mua sắm',
      excerpt: rel.excerpt,
    }))

    return (
      <ArticleDetailTemplate
        breadcrumbs={breadcrumbs}
        title={item.title}
        publishedDate={publishedDate}
        views={item.views || 92}
        categoryName={item.type || 'Đấu thầu – Mua sắm'}
        categoryHref="/dau-thau-mua-sam"
        highlights={highlights}
        excerpt={item.excerpt}
        content={item.content}
        attachments={item.attachments}
        attachmentTitle="Hồ sơ – Tài liệu mời thầu"
        sourceName={item.source || undefined}
        adminConfig={theme?.detailLayout}
        sidebarTitle="Gói thầu mới nhất"
        latestItems={mappedRelated}
        relatedTitle="Thông tin đấu thầu liên quan"
        relatedItems={mappedRelated}
        baseHref="/dau-thau-mua-sam"
      />
    )
  }

  // Fallback layout
  return (
    <>
      <SiteHeader />
      <main className="article-shell container">
        <div className="article-meta">
          {item.type}
          {item.referenceCode ? ` · ${item.referenceCode}` : ''}
          {item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString('vi-VN')}` : ''}
        </div>
        <h1>{item.title}</h1>
        {item.excerpt && <p className="articleLead">{item.excerpt}</p>}
        <div className="procurement-summary">
          <span>
            Trạng thái: <b>{item.procurementStatus}</b>
          </span>
          <span>
            Hạn tiếp nhận: <b>{item.deadlineAt ? new Date(item.deadlineAt).toLocaleDateString('vi-VN') : '-'}</b>
          </span>
        </div>
        <RichText data={item.content} />
        <AttachmentList items={item.attachments} title="Hồ sơ – tài liệu" />
        {item.changeLog?.length > 0 && (
          <div className="change-log">
            <h2>Lịch sử cập nhật</h2>
            {item.changeLog.map((x: any, i: number) => (
              <p key={i}>
                {new Date(x.date).toLocaleString('vi-VN')} — {x.note}
              </p>
            ))}
          </div>
        )}
        <BackToList href="/dau-thau-mua-sam" label="Trở lại danh sách đấu thầu – mua sắm" />
      </main>
      <SiteFooter />
    </>
  )
}
