'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'

export type PartnerBannerItem = {
  id?: string
  enabled?: boolean
  title: string
  subTitle?: string
  url: string
  openNewTab?: boolean
  bannerImage?: any
  bannerImageUrl?: string
  bgGradient?: 'cantho' | 'moh' | 'chinhphu' | 'dvc' | 'medical' | 'green' | string
}

interface HomePartnerBannersProps {
  banners: PartnerBannerItem[]
  columns?: string
  motionMode?: 'marquee' | 'carousel' | 'grid' | string
  autoplaySpeed?: number
  eyebrow?: string
  title?: string
  description?: string
}

const GRADIENT_PRESETS: Record<string, { bg: string; text: string; subText: string; border: string; glow: string }> = {
  cantho: {
    bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 45%, #0f766e 100%)',
    text: '#ffffff',
    subText: '#bae6fd',
    border: '#38bdf8',
    glow: 'rgba(2, 132, 199, 0.28)',
  },
  moh: {
    bg: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)',
    text: '#ffffff',
    subText: '#fecaca',
    border: '#f87171',
    glow: 'rgba(185, 28, 28, 0.28)',
  },
  chinhphu: {
    bg: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)',
    text: '#ffffff',
    subText: '#fef3c7',
    border: '#fbbf24',
    glow: 'rgba(217, 119, 6, 0.28)',
  },
  dvc: {
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)',
    text: '#ffffff',
    subText: '#bfdbfe',
    border: '#60a5fa',
    glow: 'rgba(29, 78, 216, 0.28)',
  },
  medical: {
    bg: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #024670 100%)',
    text: '#ffffff',
    subText: '#e0f2fe',
    border: '#7dd3fc',
    glow: 'rgba(3, 105, 161, 0.28)',
  },
  green: {
    bg: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #047857 100%)',
    text: '#ffffff',
    subText: '#bbf7d0',
    border: '#4ade80',
    glow: 'rgba(22, 163, 74, 0.28)',
  },
}

function getIconForBanner(preset?: string) {
  if (preset === 'moh') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      </svg>
    )
  }
  if (preset === 'chinhphu') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="rgba(255,255,255,0.25)" />
      </svg>
    )
  }
  if (preset === 'dvc') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function SingleBannerCard({ item, index }: { item: PartnerBannerItem; index: number }) {
  const bannerImg = item.bannerImageUrl || (item.bannerImage?.url ? item.bannerImage.url : '')
  const presetKey = item.bgGradient || 'cantho'
  const styleConfig = GRADIENT_PRESETS[presetKey] || GRADIENT_PRESETS.cantho
  const isExt = item.openNewTab !== false

  return (
    <a
      key={item.id || index}
      href={item.url}
      target={isExt ? '_blank' : undefined}
      rel={isExt ? 'noopener noreferrer' : undefined}
      className="partnerBannerCard"
      title={`${item.title} (Mở trang web ở tab mới)`}
      style={{
        background: bannerImg ? '#ffffff' : styleConfig.bg,
      }}
      onMouseOver={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = `0 10px 24px ${styleConfig.glow}`
      }}
      onMouseOut={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 4px 14px rgba(10, 42, 74, 0.07)'
      }}
    >
      {bannerImg ? (
        /* CHẾ ĐỘ 1: Ảnh banner đồ họa có sẵn - Tràn đầy 100% khung ô (Full 100% Width & Height) */
        <img
          src={bannerImg}
          alt={item.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
          }}
        />
      ) : (
        /* CHẾ ĐỘ 2: Tự động vẽ Banner thông minh (Auto Smart Graphic Banner) */
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            gap: '12px',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {/* Pattern chìm trang trọng */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.15) 0, rgba(255, 255, 255, 0) 65%)',
              pointerEvents: 'none',
            }}
          />

          {/* Icon đồ họa */}
          <div
            style={{
              flexShrink: 0,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            {getIconForBanner(presetKey)}
          </div>

          {/* Chữ tiêu đề + Tên miền */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '4px',
              zIndex: 1,
              paddingTop: '2px',
              paddingBottom: '2px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 800,
                lineHeight: 1.35,
                color: styleConfig.text,
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                paddingTop: '1px',
              }}
            >
              {item.title}
            </span>
            {item.subTitle && (
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: styleConfig.subText,
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  opacity: 0.95,
                }}
              >
                {item.subTitle}
              </span>
            )}
          </div>

          {/* Biểu tượng liên kết ngoài ↗ */}
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            ↗
          </div>
        </div>
      )}
    </a>
  )
}

export function HomePartnerBanners({
  banners = [],
  columns = '4',
  motionMode = 'marquee',
  autoplaySpeed = 5,
  eyebrow,
  title,
  description,
}: HomePartnerBannersProps) {
  const activeBanners = useMemo(
    () => banners.filter((b) => b && b.enabled !== false && b.title?.trim() && b.url?.trim()),
    [banners]
  )

  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const colCount = Math.max(1, Number(columns) || 4)
  const total = activeBanners.length

  // Tự động lật trang cho Carousel
  useEffect(() => {
    if (motionMode !== 'carousel' || total <= colCount || isPaused) return
    const speed = Math.max(2, autoplaySpeed || 5) * 1000
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % total)
    }, speed)
    return () => clearInterval(timer)
  }, [motionMode, total, colCount, autoplaySpeed, isPaused])

  if (total === 0) return null

  // Chuyển trang Carousel
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + total) % total)
  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % total)

  // Danh sách hiển thị theo lượt cho Carousel
  const visibleCarouselItems = Array.from({ length: Math.min(colCount, total) }).map((_, offset) => {
    const idx = (carouselIndex + offset) % total
    return activeBanners[idx]
  })

  // Tính số trang phân trang (pagination dots) cho Carousel
  const pageCount = Math.ceil(total / colCount)
  const currentPage = Math.floor(carouselIndex / colCount)

  // Tốc độ lướt marquee vô tận (tính theo số banner)
  const marqueeDuration = Math.max(18, total * 6)

  return (
    <div className="homePartnerBannersBlock">
      {(eyebrow || title || description) && (
        <div className="homeSectionHead" style={{ marginBottom: 20 }}>
          <div>
            {eyebrow && <span className="sectionKicker">{eyebrow}</span>}
            <h2>{title || 'Liên kết Website & Cổng thông tin'}</h2>
            {description && <p>{description}</p>}
          </div>
        </div>
      )}

      {/* ── KIỂU 1: CHẠY TRƯỢT NGANG LIÊN TỤC (MARQUEE TICKER VÔ TẬN) ── */}
      {motionMode === 'marquee' && (
        <div
          className="partnerBannersMarqueeViewport"
          style={{ '--marquee-duration': `${marqueeDuration}s` } as React.CSSProperties}
          aria-label="Dải banner liên kết trượt ngang liên tục"
        >
          <div className="partnerBannersMarqueeTrack">
            {/* Nhóm 1 */}
            <div className="partnerBannersMarqueeGroup">
              {activeBanners.map((item, idx) => (
                <SingleBannerCard key={`mq1-${item.id || idx}`} item={item} index={idx} />
              ))}
            </div>
            {/* Nhóm 2 lặp lại mượt mà vô tận */}
            <div className="partnerBannersMarqueeGroup" aria-hidden="true">
              {activeBanners.map((item, idx) => (
                <SingleBannerCard key={`mq2-${item.id || idx}`} item={item} index={idx} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── KIỂU 2: BĂNG CHUYỀN CHUYỂN TRANG TỰ ĐỘNG (SLIDE CAROUSEL) ── */}
      {motionMode === 'carousel' && (
        <div
          className="partnerBannersCarouselViewport"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const diff = e.changedTouches[0].clientX - touchStartX.current
            if (diff > 40) prevSlide()
            else if (diff < -40) nextSlide()
            touchStartX.current = null
          }}
        >
          <div
            className="partnerBannersCarouselGrid"
            key={carouselIndex}
            style={{
              gridTemplateColumns: `repeat(${visibleCarouselItems.length}, minmax(0, 1fr))`,
            }}
          >
            {visibleCarouselItems.map((item, idx) => (
              <SingleBannerCard key={`car-${item.id || idx}-${carouselIndex}`} item={item} index={idx} />
            ))}
          </div>

          {total > colCount && (
            <div className="partnerBannersCarouselControls">
              <button
                type="button"
                className="partnerBannerNavBtn"
                onClick={prevSlide}
                aria-label="Xem banner trước"
                title="Trước"
              >
                ‹
              </button>
              <div className="partnerBannerDots">
                {Array.from({ length: pageCount }).map((_, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    className={`partnerBannerDot ${pIdx === currentPage ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(pIdx * colCount)}
                    aria-label={`Trang banner ${pIdx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="partnerBannerNavBtn"
                onClick={nextSlide}
                aria-label="Xem banner kế tiếp"
                title="Kế tiếp"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── KIỂU 3: LƯỚI TĨNH (GRID) ── */}
      {motionMode === 'grid' && (
        <div
          className="partnerBannersGrid"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`,
          }}
        >
          {activeBanners.map((item, idx) => (
            <SingleBannerCard key={`grid-${item.id || idx}`} item={item} index={idx} />
          ))}
        </div>
      )}
    </div>
  )
}
