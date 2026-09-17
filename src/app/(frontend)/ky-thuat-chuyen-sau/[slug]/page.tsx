import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { getDefaultContentMedia } from '@/lib/defaultMedia'
import { ArticleDetailTemplate, type HighlightMetaItem } from '@/components/ArticleDetailTemplate'
import { BackToList } from '@/components/BackToList'

type Props = { params: Promise<{ slug: string }> }

async function getData(slug: string) {
  const payload = await getCMS()
  const [current, latest] = await Promise.all([
    payload.find({
      collection: 'advanced-techniques',
      where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] },
      limit: 1,
      depth: 2,
    }),
    payload.find({
      collection: 'advanced-techniques',
      where: { and: [{ slug: { not_equals: slug } }, { active: { equals: true } }] },
      sort: 'sortOrder',
      limit: 6,
      depth: 2,
    }),
  ])
  return {
    item: (current.docs[0] as any) || null,
    related: (latest.docs as any[]) || [],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const [{ item }, defaults] = await Promise.all([getData(slug), getDefaultContentMedia()])
    if (!item) return {}
    const image = mediaUrl(item.seoImage || item.cover) || defaults.news
    return {
      title: item.seoTitle || `${item.title} — Kỹ thuật chuyên sâu`,
      description: item.seoDescription || item.summary,
      openGraph: {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.summary,
        images: image ? [image] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function AdvancedTechniqueDetailPage({ params }: Props) {
  const { slug } = await params
  const [{ item, related }, theme, displaySettings] = await Promise.all([
    getData(slug),
    getGlobal('theme-settings').catch(() => null) as Promise<any>,
    getGlobal('display-settings').catch(() => null) as Promise<any>,
  ])

  if (!item) notFound()

  const department = typeof item.department === 'object' ? item.department : null
  const coverUrl = mediaUrl(item.cover)
  const catName = department?.name || 'Kỹ thuật chuyên sâu'
  const publishedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : ''

  // Cấu hình bật/tắt từng khối từ Admin ThemeSettings (techniqueOptions):
  const techConfig = theme?.detailLayout?.techniqueOptions || {}
  const showBreadcrumbs = techConfig.showBreadcrumbs !== false
  const showDate = techConfig.showDate !== false
  const showViews = techConfig.showViews !== false
  const showCategory = techConfig.showCategory !== false
  const showHighlights = techConfig.showHighlights !== false
  const showAdvantages = techConfig.showAdvantages !== false
  const showCover = item.showCoverInDetail === true || techConfig.showCoverInDetail === true
  // Cho phép bật/tắt nguồn ở từng bài riêng biệt, nếu không chọn thì theo cài đặt chung trong Admin ThemeSettings
  const showSource = item.showSource !== undefined ? item.showSource : (techConfig.showSource === true)
  const sourceName = techConfig.sourceName || 'Bệnh viện Đa khoa Khu vực Thới Lai'
  const showShareButtons = techConfig.showShareButtons !== false
  const showSidebar = techConfig.showSidebar !== false
  const showSidebarLatest = techConfig.showSidebarLatest !== false
  const sidebarTitle = techConfig.sidebarLatestTitle || 'Kỹ thuật chuyên sâu khác'
  const showSidebarBanners = techConfig.showSidebarBanners !== false
  const showRelatedSection = techConfig.showRelatedSection !== false
  const relatedTitle = techConfig.relatedSectionTitle || 'Kỹ thuật cùng chuyên mục'
  const showBackToList = techConfig.showBackToList !== false

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Kỹ thuật chuyên sâu', href: '/#ky-thuat-chuyen-sau' },
    ...(department?.name ? [{ label: department.name, href: `/khoa-phong/${department.slug}` }] : []),
    { label: item.title },
  ]

  // Thông tin nổi bật (highlights)
  const highlights: HighlightMetaItem[] = []
  if (department?.name) {
    highlights.push({
      label: 'Khoa / Phòng phụ trách',
      value: (
        <Link href={`/khoa-phong/${department.slug}`} style={{ color: 'var(--site-primary, #0878d1)', textDecoration: 'none' }}>
          {department.name}
        </Link>
      ),
    })
  }
  if (item.badge) {
    highlights.push({
      label: 'Tiêu chuẩn / Phân loại',
      value: item.badge,
    })
  }
  if (item.doctors) {
    highlights.push({
      label: 'Bác sĩ / Nhân sự chuyên môn',
      value: item.doctors,
    })
  }
  if (item.indications) {
    highlights.push({
      label: 'Đối tượng chỉ định',
      value: item.indications,
    })
  }

  // Khối tùy chỉnh trước nội dung bài viết
  const customBodyTop = (
    <>
      {coverUrl && showCover && (
        <div
          style={{
            margin: '0 0 24px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #dce8f1',
            maxHeight: '520px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f9fc',
          }}
        >
          <img
            src={coverUrl}
            alt={item.title}
            style={{ width: '100%', height: 'auto', maxHeight: '520px', objectFit: 'contain' }}
          />
        </div>
      )}

      {showAdvantages && Array.isArray(item.advantages) && item.advantages.length > 0 && (
        <div
          style={{
            margin: '0 0 24px',
            padding: '20px 24px',
            backgroundColor: '#f0f7fd',
            borderRadius: '14px',
            border: '1px solid #bce0f8',
          }}
        >
          <h3 style={{ margin: '0 0 12px', color: '#0754a8', fontSize: '18px', fontWeight: 700 }}>
            ✦ Ưu điểm vượt trội của kỹ thuật:
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#18344e', lineHeight: 1.7 }}>
            {item.advantages.map((adv: any, idx: number) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{adv.text}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )

  const customBodyBottom = showBackToList ? (
    <BackToList href="/#ky-thuat-chuyen-sau" label="Xem thêm kỹ thuật chuyên sâu trên Trang chủ" />
  ) : null

  const mappedRelated = related.map((rel: any) => ({
    id: rel.id,
    title: rel.title,
    slug: rel.slug,
    publishedAt: rel.createdAt || rel.updatedAt,
    categoryName: (typeof rel.department === 'object' && rel.department?.name) || 'Kỹ thuật chuyên sâu',
    excerpt: rel.summary,
  }))

  return (
    <ArticleDetailTemplate
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={showBreadcrumbs}
      title={item.title}
      publishedDate={publishedDate}
      views={item.views || 188}
      categoryName={catName}
      categoryHref={department?.slug ? `/khoa-phong/${department.slug}` : '/#ky-thuat-chuyen-sau'}
      showDate={showDate}
      showViews={showViews}
      showCategory={showCategory}
      highlights={highlights.length > 0 ? highlights : undefined}
      showHighlights={showHighlights}
      showExcerpt={false}
      content={item.content}
      customBodyTop={customBodyTop}
      customBodyBottom={customBodyBottom}
      attachments={item.attachments}
      attachmentTitle="Tài liệu / Quy trình kỹ thuật đính kèm"
      sourceName={sourceName}
      showSource={showSource}
      showShareButtons={showShareButtons}
      showSidebar={showSidebar}
      sidebarTitle={sidebarTitle}
      latestItems={mappedRelated}
      showSidebarLatest={showSidebarLatest}
      showSidebarBanners={showSidebarBanners}
      relatedTitle={relatedTitle}
      relatedItems={mappedRelated}
      showRelatedSection={showRelatedSection}
      showBackToList={showBackToList}
      adminConfig={theme?.detailLayout}
      displaySettings={displaySettings}
      baseHref="/ky-thuat-chuyen-sau"
    />
  )
}
