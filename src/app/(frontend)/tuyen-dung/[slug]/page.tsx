import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import { ArticleDetailTemplate } from '@/components/ArticleDetailTemplate'

type Props = { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const payload = await getCMS()
  const [current, latest] = await Promise.all([
    payload.find({
      collection: 'recruitment',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: 'recruitment',
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
    const image = mediaUrl(item.seoImage || item.cover) || defaults.recruitment
    return {
      title: item.seoTitle || item.title,
      description: item.seoDescription || `Thông tin tuyển dụng ${item.title}`,
      openGraph: {
        title: item.seoTitle || item.title,
        description: item.seoDescription || `Thông tin tuyển dụng ${item.title}`,
        images: image ? [image] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function RecruitmentDetail({ params }: Props) {
  const { slug } = await params
  const [{ item, related }, theme] = await Promise.all([
    getData(slug),
    getGlobal('theme-settings').catch(() => null) as Promise<any>,
  ])

  if (!item) notFound()

  const isBạchMaiLayout = theme?.detailLayout?.applyRecruitment !== false
  const publishedDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : ''
  const expireDate = item.deadlineAt ? new Date(item.deadlineAt).toLocaleDateString('vi-VN') : undefined

  const allAttachments = [
    ...(item.attachments || []),
    ...(item.attachment ? [{ file: item.attachment }] : []),
  ]

  if (isBạchMaiLayout) {
    const breadcrumbs = [
      { label: 'Trang chủ', href: '/' },
      { label: 'Tuyển dụng', href: '/tuyen-dung' },
      { label: item.title },
    ]

    const highlights = [
      { label: 'Số lượng tuyển', value: item.quantity ? `${item.quantity} chỉ tiêu` : 'Theo thông báo' },
      { label: 'Hạn nhận hồ sơ', value: expireDate || 'Không giới hạn' },
      ...(item.department && typeof item.department === 'object'
        ? [{ label: 'Khoa / Phòng', value: item.department.name }]
        : []),
    ]

    const mappedRelated = related.map((rel: any) => ({
      id: rel.id,
      title: rel.title,
      slug: rel.slug,
      publishedAt: rel.publishedAt,
      categoryName: 'TUYỂN DỤNG',
      excerpt: rel.excerpt,
    }))

    return (
      <ArticleDetailTemplate
        breadcrumbs={breadcrumbs}
        title={item.title}
        publishedDate={publishedDate}
        views={item.views || 88}
        categoryName="Tuyển dụng Bệnh viện"
        categoryHref="/tuyen-dung"
        expireDate={expireDate}
        highlights={highlights}
        excerpt={item.excerpt}
        content={item.content}
        attachments={allAttachments}
        attachmentTitle="Hồ sơ & Mẫu biểu tuyển dụng"
        sourceName={item.source || undefined}
        adminConfig={theme?.detailLayout}
        sidebarTitle="Tin tuyển dụng mới"
        latestItems={mappedRelated}
        relatedTitle="Vị trí tuyển dụng khác"
        relatedItems={mappedRelated}
        baseHref="/tuyen-dung"
      />
    )
  }

  // Fallback layout
  return (
    <>
      <SiteHeader />
      <main className="article-shell container">
        <div className="article-meta">
          TUYỂN DỤNG{publishedDate ? ` · ${publishedDate}` : ''}
        </div>
        <h1>{item.title}</h1>
        <div className="procurement-summary">
          <span>
            Số lượng: <b>{item.quantity || 'Theo thông báo'}</b>
          </span>
          <span>
            Hạn nhận hồ sơ: <b>{expireDate || 'Không giới hạn'}</b>
          </span>
        </div>
        <RichText data={item.content} />
        <AttachmentList items={allAttachments} />
        <BackToList href="/tuyen-dung" label="Trở lại danh sách tuyển dụng" />
      </main>
      <SiteFooter />
    </>
  )
}
