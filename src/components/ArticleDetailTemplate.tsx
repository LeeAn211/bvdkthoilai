import React from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { AttachmentList } from '@/components/AttachmentList'
import { BackToList } from '@/components/BackToList'
import { ShareButtons } from '@/app/(frontend)/thong-bao/[slug]/ShareButtons'
import { mediaUrl } from '@/lib/media'
import { getVisibilityClass, shouldRender } from '@/lib/deviceVisibility'
import styles from './ArticleDetailTemplate.module.css'

export interface ArticleBreadcrumb {
  label: string
  href?: string
}

export interface RelatedArticle {
  id: string | number
  title: string
  slug: string
  href?: string
  publishedAt?: string
  categoryName?: string
  excerpt?: string
}

export interface HighlightMetaItem {
  label: string
  value: string | React.ReactNode
}

export interface ArticleDetailTemplateProps {
  // Breadcrumbs
  breadcrumbs?: ArticleBreadcrumb[]
  showBreadcrumbs?: boolean

  // Header meta & title
  title: string
  publishedDate?: string
  views?: number
  categoryName?: string
  categoryHref?: string
  expireDate?: string

  showDate?: boolean
  showViews?: boolean
  showCategory?: boolean

  // Highlights
  highlights?: HighlightMetaItem[]
  showHighlights?: boolean

  // Content
  excerpt?: string
  showExcerpt?: boolean
  content: any
  customBodyTop?: React.ReactNode
  customBodyBottom?: React.ReactNode
  children?: React.ReactNode

  // Attachments
  attachments?: any[]
  attachmentTitle?: string
  showAttachments?: boolean

  sourceName?: string
  hospitalName?: string
  showSource?: boolean

  // Share
  showShareButtons?: boolean

  // Sidebar
  showSidebar?: boolean
  sidebarTitle?: string
  latestItems?: RelatedArticle[]
  showSidebarLatest?: boolean
  showSidebarBanners?: boolean

  // Related
  relatedTitle?: string
  relatedItems?: RelatedArticle[]
  showRelatedSection?: boolean

  // Back button
  showBackToList?: boolean

  // Sidebar & Layout Config (Lấy từ Admin ThemeSettings)
  adminConfig?: {
    shareSettings?: {
      enabled?: boolean
      position?: 'left' | 'right' | 'top' | 'bottom'
      platformsOrder?: string
      showFacebook?: boolean
      facebookCustomIcon?: any
      showZalo?: boolean
      zaloCustomIcon?: any
      showCopyLink?: boolean
      copyLinkCustomIcon?: any
      showPrint?: boolean
      printCustomIcon?: any
      customShares?: Array<{ title: string; shareUrlTemplate: string; iconUrl?: string }>
      customSharesJson?: string
    }
    sidebarBanner?: {
      enabled?: boolean
      position?: 'aboveLatest' | 'belowLatest'
      title?: string
      description?: string
      buttonText?: string
      buttonLink?: string
      openNewTab?: boolean
      customBannerImage?: any

      banner2Enabled?: boolean
      banner2Title?: string
      banner2Description?: string
      banner2ButtonText?: string
      banner2ButtonLink?: string
      banner2OpenNewTab?: boolean
      banner2Image?: any

      banner3Enabled?: boolean
      banner3Title?: string
      banner3Description?: string
      banner3ButtonText?: string
      banner3ButtonLink?: string
      banner3OpenNewTab?: boolean
      banner3Image?: any

      extraBannersJson?: string
    }
    displayOptions?: {
      showBreadcrumbs?: boolean
      showViews?: boolean
      showDate?: boolean
      showCategory?: boolean
      showHighlights?: boolean
      showExcerpt?: boolean
      showSource?: boolean
      showSidebar?: boolean
      showSidebarLatest?: boolean
      sidebarLatestTitle?: string
      showSidebarBanners?: boolean
      showRelatedSection?: boolean
      relatedSectionTitle?: string
      defaultSourceName?: string
      showBackToList?: boolean
    }
  }

  // Cấu hình hiển thị đa thiết bị từ Global DisplaySettings (Desktop / Mobile / Cả hai / Tắt)
  displaySettings?: any

  baseHref: string // ví dụ: "/thong-bao", "/tin-tuc", "/dau-thau-mua-sam", "/ky-thuat-chuyen-sau"
}

export function ArticleDetailTemplate({
  breadcrumbs,
  showBreadcrumbs,
  title,
  publishedDate,
  views = 128,
  categoryName,
  categoryHref,
  expireDate,
  showDate,
  showViews,
  showCategory,
  highlights,
  showHighlights,
  excerpt,
  showExcerpt = false,
  content,
  customBodyTop,
  customBodyBottom,
  children,
  attachments,
  attachmentTitle = 'Tài liệu / Văn bản đính kèm',
  showAttachments,
  sourceName,
  hospitalName,
  showSource,
  showShareButtons,
  showSidebar,
  sidebarTitle = 'Tin mới nhất',
  latestItems = [],
  showSidebarLatest,
  showSidebarBanners,
  relatedTitle = 'Tin tức cùng chuyên mục',
  relatedItems = [],
  showRelatedSection,
  showBackToList,
  adminConfig,
  displaySettings,
  baseHref,
}: ArticleDetailTemplateProps) {
  const shareConfig = adminConfig?.shareSettings
  const bannerConfig = adminConfig?.sidebarBanner
  const displayConfig = adminConfig?.displayOptions

  // Chế độ hiển thị đa thiết bị từ Global displaySettings ('both' | 'desktop_only' | 'mobile_only' | 'hidden')
  const dsBreadcrumbs = displaySettings?.articleBreadcrumbs || 'both'
  const dsDate = displaySettings?.articleDate || 'both'
  const dsViews = displaySettings?.articleViews || 'both'
  const dsCategory = displaySettings?.articleCategory || 'both'
  const dsHighlights = displaySettings?.articleHighlights || 'both'
  const dsExcerpt = displaySettings?.articleExcerpt !== undefined ? displaySettings.articleExcerpt : (displayConfig?.showExcerpt ? 'both' : 'hidden')
  const dsSource = displaySettings?.articleSource || 'both'
  const dsShare = displaySettings?.articleShare || 'both'
  const dsSidebar = displaySettings?.articleSidebar || 'both'
  const dsSidebarLatest = displaySettings?.articleSidebarLatest || 'both'
  const dsSidebarBanners = displaySettings?.articleSidebarBanners || 'both'
  const dsRelated = displaySettings?.articleRelated || 'both'
  const dsBackToList = displaySettings?.articleBackToList || 'both'

  // Tính toán quyền bật/tắt (Granular Toggles kết hợp DisplaySettings)
  const isBreadcrumbsVisible = showBreadcrumbs !== undefined ? showBreadcrumbs : (displayConfig?.showBreadcrumbs !== false && shouldRender(dsBreadcrumbs))
  const isDateVisible = showDate !== undefined ? showDate : (displayConfig?.showDate !== false && shouldRender(dsDate))
  const isViewsVisible = showViews !== undefined ? showViews : (displayConfig?.showViews !== false && shouldRender(dsViews))
  const isCategoryVisible = showCategory !== undefined ? showCategory : (displayConfig?.showCategory !== false && shouldRender(dsCategory))
  const isHighlightsVisible = showHighlights !== undefined ? showHighlights : (displayConfig?.showHighlights !== false && shouldRender(dsHighlights))
  const isExcerptVisible = (showExcerpt === true || displayConfig?.showExcerpt === true || dsExcerpt !== 'hidden') && shouldRender(dsExcerpt)
  const isSourceVisible = showSource !== undefined ? showSource : (displayConfig?.showSource !== false && shouldRender(dsSource))
  const isShareEnabled = showShareButtons !== undefined ? showShareButtons : (shareConfig?.enabled !== false && shouldRender(dsShare))
  const isAttachmentsVisible = showAttachments !== false
  const isSidebarVisible = showSidebar !== undefined ? showSidebar : (displayConfig?.showSidebar !== false && shouldRender(dsSidebar))
  const isSidebarLatestVisible = showSidebarLatest !== undefined ? showSidebarLatest : (displayConfig?.showSidebarLatest !== false && shouldRender(dsSidebarLatest))
  const isSidebarBannersVisible = showSidebarBanners !== undefined ? showSidebarBanners : (displayConfig?.showSidebarBanners !== false && bannerConfig?.enabled !== false && shouldRender(dsSidebarBanners))
  const isRelatedVisible = showRelatedSection !== undefined ? showRelatedSection : (displayConfig?.showRelatedSection !== false && shouldRender(dsRelated))
  const isBackToListVisible = showBackToList !== undefined ? showBackToList : (displayConfig?.showBackToList !== false && shouldRender(dsBackToList))

  const finalSidebarTitle = displaySettings?.articleSidebarLatestTitle || displayConfig?.sidebarLatestTitle || sidebarTitle
  const finalRelatedTitle = displaySettings?.articleRelatedTitle || displayConfig?.relatedSectionTitle || relatedTitle
  const finalSourceName = sourceName || hospitalName || displaySettings?.articleDefaultSourceName || displayConfig?.defaultSourceName || 'Bệnh viện Đa khoa Khu vực Thới Lai'

  // Vị trí thanh chia sẻ: 'left' | 'right' | 'top' | 'bottom'
  const sharePosition = shareConfig?.position || 'left'
  const isLeftShare = isShareEnabled && sharePosition === 'left'

  // Xác định class grid của layout theo trạng thái bật/tắt cột trái và sidebar phải
  let layoutGridClass = styles.postDetailLayout
  if (!isLeftShare && !isSidebarVisible) {
    layoutGridClass = `${styles.postDetailLayout} ${styles.postDetailLayoutFull}`
  } else if (!isLeftShare && isSidebarVisible) {
    layoutGridClass = `${styles.postDetailLayout} ${styles.postDetailLayoutNoLeft}`
  } else if (isLeftShare && !isSidebarVisible) {
    layoutGridClass = `${styles.postDetailLayout} ${styles.postDetailLayoutNoRight}`
  }

  // Danh sách banners
  const bannerList: Array<{
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
    openNewTab?: boolean
    imageUrl?: string | null
  }> = []

  if (isSidebarBannersVisible) {
    // Banner 1
    const b1Img = bannerConfig?.customBannerImage ? mediaUrl(bannerConfig.customBannerImage) : null
    bannerList.push({
      title: bannerConfig?.title || 'ĐẶT LỊCH KHÁM BỆNH',
      description: bannerConfig?.description || 'Khám chữa bệnh nhanh chóng, tiện lợi, không phải chờ đợi qua ứng dụng y tế.',
      buttonText: bannerConfig?.buttonText || 'Đặt lịch khám ngay →',
      buttonLink: bannerConfig?.buttonLink || 'https://medpro.vn/',
      openNewTab: bannerConfig?.openNewTab !== false,
      imageUrl: b1Img,
    })

    // Banner 2
    if (bannerConfig?.banner2Enabled) {
      const b2Img = bannerConfig?.banner2Image ? mediaUrl(bannerConfig.banner2Image) : null
      bannerList.push({
        title: bannerConfig?.banner2Title || 'LỊCH TIÊM CHỦNG',
        description: bannerConfig?.banner2Description || 'Tra cứu thông tin và lịch tiêm vắc xin cho trẻ em và người lớn.',
        buttonText: bannerConfig?.banner2ButtonText || 'Xem lịch tiêm →',
        buttonLink: bannerConfig?.banner2ButtonLink || '/tiem-chung',
        openNewTab: Boolean(bannerConfig?.banner2OpenNewTab),
        imageUrl: b2Img,
      })
    }

    // Banner 3
    if (bannerConfig?.banner3Enabled) {
      const b3Img = bannerConfig?.banner3Image ? mediaUrl(bannerConfig.banner3Image) : null
      bannerList.push({
        title: bannerConfig?.banner3Title || 'BẢNG GIÁ DỊCH VỤ',
        description: bannerConfig?.banner3Description || 'Công khai giá khám chữa bệnh BHYT và dịch vụ yêu cầu.',
        buttonText: bannerConfig?.banner3ButtonText || 'Tra cứu giá →',
        buttonLink: bannerConfig?.banner3ButtonLink || '/bang-gia',
        openNewTab: Boolean(bannerConfig?.banner3OpenNewTab),
        imageUrl: b3Img,
      })
    }

    // Extra banners từ JSON
    if (bannerConfig?.extraBannersJson) {
      try {
        const extra = JSON.parse(bannerConfig.extraBannersJson)
        if (Array.isArray(extra)) {
          extra.forEach((item: any) => {
            if (item) {
              bannerList.push({
                title: item.title,
                description: item.desc || item.description,
                buttonText: item.btnText || item.buttonText,
                buttonLink: item.btnLink || item.link || item.buttonLink || '#',
                openNewTab: item.openNewTab !== false,
                imageUrl: item.imageUrl || item.image || null,
              })
            }
          })
        }
      } catch {}
    }
  }

  // Component render danh sách banner
  const renderBanners = () => {
    if (bannerList.length === 0) return null
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {bannerList.map((banner, index) => {
          const hasImage = Boolean(banner.imageUrl)
          return (
            <div
              key={`banner-${index}`}
              className={`${styles.sidebarBannerBox} ${hasImage ? styles.sidebarBannerBoxImage : ''}`}
            >
              {hasImage ? (
                <a
                  href={banner.buttonLink || '#'}
                  target={banner.openNewTab ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  style={{ display: 'block', borderRadius: '9px', overflow: 'hidden' }}
                >
                  <img
                    src={banner.imageUrl!}
                    alt={banner.title || 'Banner'}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </a>
              ) : (
                <>
                  {banner.title && <h4>{banner.title}</h4>}
                  {banner.description && <p>{banner.description}</p>}
                  {banner.buttonText && (
                    <a
                      className={styles.sidebarBannerBtn}
                      href={banner.buttonLink || '#'}
                      target={banner.openNewTab ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                    >
                      {banner.buttonText}
                    </a>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Component render Danh sách bài viết mới ở Sidebar
  const renderSidebarLatest = () => {
    if (!isSidebarLatestVisible || !latestItems || latestItems.length === 0) return null
    return (
      <div className={styles.sidebarBox}>
        <h3 className={styles.sidebarBoxTitle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          {finalSidebarTitle}
        </h3>
        <div className={styles.sidebarNewsList}>
          {latestItems.slice(0, 5).map((item) => {
            const itemUrl = item.href || `${baseHref}/${item.slug}`
            return (
              <Link key={item.id} href={itemUrl} className={styles.sidebarNewsItem}>
                <span className={styles.sidebarNewsItemTitle}>{item.title}</span>
                <span className={styles.sidebarNewsItemDate}>
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className={`container ${styles.postDetailContainer}`}>
        {/* Breadcrumb điều hướng */}
        {isBreadcrumbsVisible && breadcrumbs && breadcrumbs.length > 0 && (
          <nav className={`${styles.postDetailBreadcrumb} ${getVisibilityClass(dsBreadcrumbs)}`} aria-label="Đường dẫn">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>›</span>}
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Layout bài viết */}
        <div className={layoutGridClass}>
          {/* Vị trí 1: Cột trái (Mặc định) */}
          {isLeftShare && (
            <div className={getVisibilityClass(dsShare)}>
              <ShareButtons title={title} config={shareConfig} />
            </div>
          )}

          {/* Cột giữa: Nội dung chính */}
          <article className={styles.postDetailMainCol}>
            {/* Tiêu đề thông báo / bài viết */}
            <h1 className={styles.postDetailTitle}>{title}</h1>

            {/* Dòng metadata: Ngày đăng | Lượt xem | Chuyên mục */}
            {(isDateVisible || isViewsVisible || isCategoryVisible || expireDate) && (
              <div className={styles.postDetailMetaTop}>
                {isDateVisible && publishedDate && (
                  <div className={`${styles.postDetailMetaItem} ${getVisibilityClass(dsDate)}`}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.metaIconGold}
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{publishedDate}</span>
                  </div>
                )}
                {isDateVisible && publishedDate && isViewsVisible && <span className={styles.metaDivider}>|</span>}
                {isViewsVisible && (
                  <div className={`${styles.postDetailMetaItem} ${getVisibilityClass(dsViews)}`}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.metaIconGold}
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>{views} lượt xem</span>
                  </div>
                )}
                {isCategoryVisible && categoryName && (
                  <div className={getVisibilityClass(dsCategory)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {(isDateVisible || isViewsVisible) && <span className={styles.metaDivider}>|</span>}
                    {categoryHref ? (
                      <Link href={categoryHref} className={styles.metaCategoryLink}>
                        {categoryName}
                      </Link>
                    ) : (
                      <span className={styles.metaCategoryLink}>{categoryName}</span>
                    )}
                  </div>
                )}
                {expireDate && <span className={styles.metaExpire}>(Hạn: {expireDate})</span>}
              </div>
            )}

            {/* Vị trí 2: Thanh chia sẻ nằm ngay dưới tiêu đề */}
            {isShareEnabled && sharePosition === 'top' && (
              <div className={getVisibilityClass(dsShare)}>
                <ShareButtons title={title} horizontal config={shareConfig} />
              </div>
            )}

            {/* Trên Mobile: Khi sharePosition === 'left', cột sticky trái bị ẩn theo responsive, tự động hiển thị thanh chia sẻ ngang gọn gàng ở đây */}
            {isShareEnabled && sharePosition === 'left' && (
              <div className={`${styles.postDetailShareMobileOnly} ${getVisibilityClass(dsShare)}`}>
                <ShareButtons title={title} horizontal config={shareConfig} />
              </div>
            )}

            {/* Thông tin nổi bật (dành cho đấu thầu, tuyển dụng, kỹ thuật...) */}
            {isHighlightsVisible && highlights && highlights.length > 0 && (
              <div className={`${styles.metaHighlightBox} ${getVisibilityClass(dsHighlights)}`}>
                {highlights.map((item, idx) => (
                  <div key={idx} className={styles.metaHighlightItem}>
                    <span>{item.label}: </span>
                    <b>{item.value}</b>
                  </div>
                ))}
              </div>
            )}

            {/* Đoạn trích dẫn Sapo nổi bật (chỉ hiển thị khi có cấu hình bật showExcerpt) */}
            {isExcerptVisible && excerpt && (
              <div className={`${styles.postDetailExcerpt} ${getVisibilityClass(dsExcerpt)}`}>
                {excerpt}
              </div>
            )}

            {/* Khối tùy chỉnh trên nội dung (ảnh đại diện chi tiết, khối ưu điểm...) */}
            {customBodyTop}

            {/* Nội dung chi tiết RichText */}
            <div className={styles.postDetailBody}>
              <RichText data={content} />
            </div>

            {/* Khối tùy chỉnh dưới nội dung */}
            {customBodyBottom}
            {children}

            {/* Danh sách đính kèm tệp */}
            {isAttachmentsVisible && attachments && attachments.length > 0 && (
              <div style={{ marginTop: '28px' }}>
                <AttachmentList items={attachments} title={attachmentTitle} />
              </div>
            )}

            {/* Vị trí 3: Thanh chia sẻ nằm ngang ở cuối bài viết */}
            {isShareEnabled && sharePosition === 'bottom' && (
              <div className={getVisibilityClass(dsShare)}>
                <ShareButtons title={title} horizontal config={shareConfig} />
              </div>
            )}

            {/* Nguồn bài viết (cho phép tắt độc lập) */}
            {isSourceVisible && finalSourceName && (
              <div className={`${styles.postDetailAuthor} ${getVisibilityClass(dsSource)}`}>
                <span>Nguồn: {finalSourceName}</span>
              </div>
            )}

            {/* Nút quay lại danh sách bài viết */}
            {isBackToListVisible && (
              <div className={getVisibilityClass(dsBackToList)} style={{ marginTop: '28px' }}>
                <BackToList href={baseHref} label="Trở lại danh sách trước" />
              </div>
            )}
          </article>

          {/* Cột phải: Sidebar */}
          {isSidebarVisible && (
            <aside className={`${styles.postDetailSidebar} ${getVisibilityClass(dsSidebar)}`}>
              {/* Vị trí 4: Thanh chia sẻ đặt ở đầu Sidebar cột phải */}
              {isShareEnabled && sharePosition === 'right' && (
                <div className={getVisibilityClass(dsShare)} style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <ShareButtons title={title} horizontal config={shareConfig} />
                </div>
              )}

              {/* Thứ tự Banner so với Tin mới nhất (aboveLatest hoặc belowLatest) */}
              {bannerConfig?.position === 'belowLatest' ? (
                <>
                  <div className={getVisibilityClass(dsSidebarLatest)}>{renderSidebarLatest()}</div>
                  <div className={getVisibilityClass(dsSidebarBanners)}>{renderBanners()}</div>
                </>
              ) : (
                <>
                  <div className={getVisibilityClass(dsSidebarBanners)}>{renderBanners()}</div>
                  <div className={getVisibilityClass(dsSidebarLatest)}>{renderSidebarLatest()}</div>
                </>
              )}
            </aside>
          )}
        </div>

        {/* Khối bài viết cùng chuyên mục phía dưới chân trang */}
        {isRelatedVisible && relatedItems && relatedItems.length > 0 && (
          <section className={`${styles.relatedSection} ${getVisibilityClass(dsRelated)}`}>
            <h2 className={styles.relatedSectionHeading}>
              <span>{finalRelatedTitle}</span>
            </h2>
            <div className={styles.relatedGrid}>
              {relatedItems.slice(0, 3).map((item) => {
                const itemUrl = item.href || `${baseHref}/${item.slug}`
                return (
                  <Link
                    key={item.id}
                    href={itemUrl}
                    className={styles.sidebarNewsItem}
                    style={{
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <span className={styles.sidebarNewsItemDate} style={{ color: '#0878d1', fontWeight: 700 }}>
                      {item.categoryName || 'BÀI VIẾT'} ·{' '}
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                    <span
                      className={styles.sidebarNewsItemTitle}
                      style={{ fontSize: '15px', marginTop: '6px', color: '#0f172a' }}
                    >
                      {item.title}
                    </span>
                    {item.excerpt && (
                      <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
                        {item.excerpt}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
